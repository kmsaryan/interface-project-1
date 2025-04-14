const express = require("express");
const http = require("http");
const setupWebSocket = require("./websocket");

const app = express();
const server = http.createServer(app);
const io = setupWebSocket(server);

const users = new Map(); // Map to track connected users (socketId -> userDetails)
let liveChatQueue = []; // Array to track live chat queue
let activeChats = new Map(); // Map to track active chats (technicianId -> customerId)

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the WebSocket Server!"); // Respond with a simple message
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user registration (customer or technician)
  socket.on("registerUser", (userDetails) => {
    console.log("[DEBUG] registerUser event received:", userDetails);
    users.set(socket.id, userDetails);
    console.log("User registered:", userDetails);

    if (userDetails.role === "technician") {
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }
  });

  // Handle customer joining live chat queue
  socket.on("joinLiveChatQueue", (customerDetails) => {
    console.log("[DEBUG] joinLiveChatQueue event received:", customerDetails);
    liveChatQueue.push({ id: socket.id, ...customerDetails });
    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
  });

  // Handle technician selecting a customer
  socket.on("selectCustomer", (customerId) => {
    console.log("[DEBUG] selectCustomer event received:", customerId);
    const customer = liveChatQueue.find((c) => c.id === customerId);
    if (customer) {
      liveChatQueue = liveChatQueue.filter((c) => c.id !== customerId);
      activeChats.set(socket.id, customerId); // Map technician to customer
      io.emit("updateLiveChatQueue", liveChatQueue); // Update queue for all technicians
      io.to(customerId).emit("technicianConnected", { technicianId: socket.id });
      io.to(socket.id).emit("customerConnected", customer);
    } else {
      console.warn(`[WARN] Customer with ID ${customerId} not found in queue.`);
    }
  });

  // Handle real-time messaging
  socket.on("sendMessage", ({ to, message }) => {
    console.log("[DEBUG] sendMessage event received:", { to, message });
    if (to) {
      io.to(to).emit("receiveMessage", { from: socket.id, message }); // Send message to the recipient
    } else {
      console.warn("[WARN] Message not sent. Missing recipient (to).");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    const user = users.get(socket.id);
    users.delete(socket.id);

    if (user?.role === "technician") {
      const customerId = activeChats.get(socket.id);
      if (customerId) {
        // Return the customer to the queue if the technician disconnects
        const customer = liveChatQueue.find((c) => c.id === customerId);
        if (customer) {
          liveChatQueue.push(customer);
        }
        activeChats.delete(socket.id);
      }
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }

    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
  });
});

server.listen(PORT, () => {
  const host = process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
    : `http://localhost:${PORT}`;
  console.log(`Server is running on ${host}`);
});