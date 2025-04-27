const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const users = new Map(); // Map to track connected users (socketId -> userDetails)
let liveChatQueue = []; // Array to track live chat queue
let activeChats = new Map(); // Map to track active chats (technicianId -> customerId)
let technicianSchedule = []; // Store the technician's schedule

function setupWebSocket(server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000", // Ensure this matches the frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log("[SOCKET AUTH]: Incoming token:", token);

    if (!token) {
      console.error("[SOCKET AUTH ERROR]: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[SOCKET AUTH]: Decoded token payload:", decoded);
      socket.user = decoded; // Attach user info to the socket
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("[SOCKET AUTH]: Token expired, attempting to refresh...");
        try {
          const decoded = jwt.decode(token); // Decode the expired token
          const newToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Set a new expiration time
          );
          console.log("[SOCKET AUTH]: Token refreshed successfully");
          socket.handshake.auth.token = newToken; // Update the token in the handshake
          socket.emit("tokenRefreshed", { token: newToken }); // Notify the client
          socket.user = jwt.verify(newToken, process.env.JWT_SECRET); // Verify and attach the refreshed token
          next();
        } catch (refreshErr) {
          console.error("[SOCKET AUTH ERROR]: Failed to refresh token:", refreshErr.message);
          return next(new Error("Authentication error: Token refresh failed"));
        }
      } else {
        console.error("[SOCKET AUTH ERROR]: Invalid token:", err.message);
        return next(new Error("Authentication error: Invalid token"));
      }
    }
  });

  console.log("[WEBSOCKET LOG]: WebSocket server initialized and listening");

  io.on("connection", (socket) => {
    console.log("[WEBSOCKET LOG]: WebSocket connected:", socket.id, "User:", socket.user);

    socket.on("error", (err) => {
      console.error("WebSocket error:", err);
    });

    socket.on("disconnect", () => {
      console.log("[WEBSOCKET LOG]: WebSocket disconnected:", socket.id);
    });

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
    socket.on("sendMessage", ({ to, message, fileData, timestamp }) => {
      // Enhanced debugging
      console.log(`[WEBSOCKET LOG]: Processing message to ${to}`);
      
      if (fileData) {
        console.log(`[WEBSOCKET LOG]: Message includes file: ${fileData.name}, type: ${fileData.type}, size: ${fileData.size}`);
        // To avoid logging potentially large content, just check its presence
        console.log(`[WEBSOCKET LOG]: File content is ${fileData.content ? 'present' : 'missing'}`);
      }
      
      const messageData = {
        from: socket.id,
        message,
        fileData, // Explicitly include file data
        timestamp: timestamp || Date.now(),
      };

      if (to) {
        // Send message to recipient
        io.to(to).emit("receiveMessage", messageData);
        console.log(`[WEBSOCKET LOG]: Message sent to ${to} ${fileData ? 'with file' : ''}`);
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
