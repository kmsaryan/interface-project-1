const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

const technicians = new Map(); // Track connected technicians
const liveChatQueue = [];
const videoCallQueue = [];

// Generate unique video call link
const generateVideoCallLink = () => `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;

const log = (message) => {
  console.log(`[SERVER LOG]: ${message}`);
};

io.on("connection", (socket) => {
  log(`A user connected: ${socket.id}`);

  // Handle technician connection
  socket.on("technicianConnected", (technicianId) => {
    technicians.set(socket.id, { id: technicianId, status: "Available" });
    io.emit("updateTechnicianStatus", Array.from(technicians.values()));
  });

  // Handle technician joining
  socket.on("technicianJoin", (technician) => {
    technicians.set(socket.id, { id: socket.id, ...technician });
    log(`Technician joined: ${JSON.stringify(technician)}`);
    io.emit("updateTechnicianStatus", Array.from(technicians.values())); // Notify all customers
    io.emit("updateLiveChatQueue", liveChatQueue); // Send the current queue to the technician
  });

  // Handle customer joining live chat queue
  socket.on("joinLiveChatQueue", (customerDetails) => {
    liveChatQueue.push({ id: socket.id, ...customerDetails });
    log(`Customer joined live chat queue: ${JSON.stringify(customerDetails)}`);
    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
  });

  // Handle customer joining video call queue
  socket.on("joinVideoCallQueue", (customerDetails) => {
    const videoCallLink = generateVideoCallLink();
    videoCallQueue.push({ socketId: socket.id, ...customerDetails, videoCallLink });
    io.emit("updateVideoCallQueue", videoCallQueue);
    io.emit("newCustomer", customerDetails);
  });

  // Handle technician selecting a customer from the queue
  socket.on("selectCustomer", (customerId) => {
    const customerIndex = liveChatQueue.findIndex((c) => c.id === customerId);
    if (customerIndex !== -1) {
      const customer = liveChatQueue.splice(customerIndex, 1)[0];
      log(`Technician selected customer: ${JSON.stringify(customer)}`);
      io.emit("updateLiveChatQueue", liveChatQueue); // Update queue for all technicians
      io.to(customerId).emit("technicianConnected", { technicianId: socket.id }); // Notify customer
      io.to(socket.id).emit("customerConnected", customer); // Notify technician
    } else {
      log(`Customer not found in queue: ${customerId}`);
    }
  });

  // Handle real-time messaging
  socket.on("message", ({ to, message }) => {
    log(`Message sent from ${socket.id} to ${to}: ${message}`);
    io.to(to).emit("message", { from: socket.id, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    log(`A user disconnected: ${socket.id}`);
    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    technicians.delete(socket.id);
    io.emit("updateLiveChatQueue", liveChatQueue);
    io.emit("updateTechnicianStatus", Array.from(technicians.values()));
  });
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});