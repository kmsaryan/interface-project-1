//server.js
// This is a simple Node.js server using Express and Socket.io
// to handle real-time communication between clients.
// It listens for incoming connections and allows clients to send messages
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3002", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

let liveChatQueue = []; // Queue for live chat
let technicians = []; // List of connected technicians

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle customer joining live chat queue
  socket.on("joinLiveChatQueue", (customer) => {
    liveChatQueue.push({ id: socket.id, ...customer });
    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
  });

  // Handle technician joining
  socket.on("technicianJoin", (technician) => {
    technicians.push({ id: socket.id, ...technician });
    io.emit("updateTechnicianStatus", technicians); // Notify all customers
  });

  // Handle technician selecting a customer from the queue
  socket.on("selectCustomer", (customerId) => {
    const customer = liveChatQueue.find((c) => c.id === customerId);
    if (customer) {
      liveChatQueue = liveChatQueue.filter((c) => c.id !== customerId);
      io.emit("updateLiveChatQueue", liveChatQueue); // Update queue for all technicians
      io.to(customerId).emit("technicianConnected", { technicianId: socket.id }); // Notify customer
      io.to(socket.id).emit("customerConnected", customer); // Notify technician
    }
  });

  // Handle real-time messaging
  socket.on("message", ({ to, message }) => {
    io.to(to).emit("message", { from: socket.id, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    technicians = technicians.filter((technician) => technician.id !== socket.id);
    io.emit("updateLiveChatQueue", liveChatQueue);
    io.emit("updateTechnicianStatus", technicians);
  });
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});