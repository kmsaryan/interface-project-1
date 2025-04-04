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
      liveChatQueue.push({ id: socket.id, ...customerDetails });
      io.emit("updateLiveChatQueue", liveChatQueue);
    });

    // Handle technician selecting a customer
    socket.on("selectCustomer", (customerId) => {
      const customer = liveChatQueue.find((c) => c.id === customerId);
      if (customer) {
        liveChatQueue = liveChatQueue.filter((c) => c.id !== customerId);
        activeChats.set(socket.id, customerId);
        io.emit("updateLiveChatQueue", liveChatQueue);
        io.to(customerId).emit("technicianConnected", { technicianId: socket.id });
        io.to(socket.id).emit("customerConnected", customer);
      }
    });

    // Handle real-time messaging
    socket.on("sendMessage", ({ to, message }) => {
      io.to(to).emit("receiveMessage", { from: socket.id, message });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`[WEBSOCKET LOG]: A user disconnected: ${socket.id}`);
      const user = users.get(socket.id);
      users.delete(socket.id);

      if (user?.role === "technician") {
        const customerId = activeChats.get(socket.id);
        if (customerId) {
          const customer = liveChatQueue.find((c) => c.id === customerId);
          if (customer) {
            liveChatQueue.push(customer);
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
