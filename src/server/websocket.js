const { Server } = require("socket.io");

const users = new Map(); // Map to track connected users (socketId -> userDetails)
let liveChatQueue = []; // Array to track live chat queue
let activeChats = new Map(); // Map to track active chats (technicianId -> customerId)
let technicianSchedule = []; // Store the technician's schedule

function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000", // Use frontend URL from .env
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log("[WEBSOCKET LOG]: WebSocket server initialized and listening");

  io.on("connection", (socket) => {
    console.log(`[WEBSOCKET LOG]: A user connected: ${socket.id}`);
    users.set(socket.id, { status: "online" }); // Set user status to online
    io.emit("updateUserStatus", Array.from(users.values())); // Notify all clients

    // Log all events for debugging
    socket.onAny((event, ...args) => {
      console.log(`[WEBSOCKET EVENT]: ${event}`, args);
    });

    // Handle user registration
    socket.on("registerUser", (userDetails) => {
      users.set(socket.id, userDetails);
      console.log(`[WEBSOCKET LOG]: User registered:`, userDetails);

      if (userDetails.role === "customer") {
        if (!liveChatQueue.some((customer) => customer.id === socket.id)) {
          liveChatQueue.push({ id: socket.id, ...userDetails });
          console.log(`[WEBSOCKET LOG]: Customer added to liveChatQueue:`, liveChatQueue);
          io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
        }
      }

      if (userDetails.role === "technician") {
        // Emit only if there is a change in the technician list
        const technicians = Array.from(users.values()).filter(user => user.role === "technician");
        io.emit("updateTechnicianStatus", technicians);
      }
    });

    // Handle customer joining live chat queue
    socket.on("joinLiveChatQueue", (customerDetails) => {
      if (!liveChatQueue.some((customer) => customer.id === socket.id)) {
        const customerWithDefaults = {
          id: socket.id,
          ...customerDetails,
          joinedAt: Date.now(),
          priority: customerDetails.priority || "Medium", // Ensure priority has a default value
        };
        liveChatQueue.push(customerWithDefaults);
        console.log(`[WEBSOCKET LOG]: Customer added to liveChatQueue:`, liveChatQueue);
        io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
      }
    });

    // Handle technician selecting a customer
    socket.on("selectCustomer", (customerId) => {
      const customer = liveChatQueue.find((c) => c.id === customerId);
      const isCustomerInActiveChat = Array.from(activeChats.values()).includes(customerId);

      if (isCustomerInActiveChat) {
        console.warn(`[WARN] Customer with ID ${customerId} is already in an active chat.`);
        io.to(socket.id).emit("customerAlreadyInChat", { customerId });
        return;
      }

      if (customer) {
        // Remove customer from queue and map technician to customer
        liveChatQueue = liveChatQueue.filter((c) => c.id !== customerId);
        activeChats.set(socket.id, customerId);
        io.emit("updateLiveChatQueue", liveChatQueue); // Update queue for all technicians
        io.to(customerId).emit("technicianConnected", { technicianId: socket.id });
        io.to(socket.id).emit("customerConnected", customer);
        console.log(`[WEBSOCKET LOG]: Technician ${socket.id} connected to customer ${customerId}`);
      } else {
        console.warn(`[WARN] Customer with ID ${customerId} not found in queue.`);
        io.to(socket.id).emit("customerNotFound", { customerId });
      }
    });

    // Handle real-time messaging
    socket.on("sendMessage", ({ to, message, attachment }) => {
      if (to) {
        io.to(to).emit("receiveMessage", { from: socket.id, message, attachment, timestamp: Date.now() });
        console.log(`[WEBSOCKET LOG]: Message sent from ${socket.id} to ${to}`);
      } else {
        console.warn(`[WARN] Message not sent. Missing recipient (to).`);
      }
    });

    // Handle ending the chat
    socket.on("endChat", ({ customerId }) => {
      const technicianId = Array.from(activeChats.entries()).find(([techId, custId]) => custId === customerId)?.[0];
      if (technicianId) {
        activeChats.delete(technicianId); // Remove the active chat
        io.to(customerId).emit("chatEnded"); // Notify the customer
        io.to(technicianId).emit("chatEnded"); // Notify the technician
        console.log(`[WEBSOCKET LOG]: Chat ended between technician ${technicianId} and customer ${customerId}`);
      } else {
        console.warn(`[WARN] No active chat found for customer ID ${customerId}`);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`[WEBSOCKET LOG]: A user disconnected: ${socket.id}`);
      users.delete(socket.id);
      io.emit("updateUserStatus", Array.from(users.values())); // Notify all clients
      const user = users.get(socket.id);
      users.delete(socket.id);

      if (user?.role === "technician") {
        const customerId = activeChats.get(socket.id);
        if (customerId) {
          // Return the customer to the queue if the technician disconnects
          const customer = activeChats.get(socket.id);
          if (customer) {
            liveChatQueue.push(customer);
            io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
          }
          activeChats.delete(socket.id);
        }
        io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
      }

      if (user?.role === "customer") {
        liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
        io.emit("updateLiveChatQueue", liveChatQueue);
      }
    });

    // Handle technician schedule updates
    socket.on("updateTechnicianSchedule", (schedule) => {
      technicianSchedule = schedule;
      io.emit("updateTechnicianSchedule", technicianSchedule);
    });
  });

  return io;
}

module.exports = setupWebSocket;
