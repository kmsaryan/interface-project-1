const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_SERVER_URL || "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

const users = new Map(); // Map to track connected users (socketId -> userDetails)
let liveChatQueue = []; // Array to track live chat queue
let technicianSchedule = []; // Store the technician's schedule

app.get("/", (req, res) => {
  res.send("Welcome to the WebSocket Server!"); // Respond with a simple message
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user registration (customer or technician)
  socket.on("registerUser", (userDetails) => {
    users.set(socket.id, userDetails);
    console.log("User registered:", userDetails);

    if (userDetails.role === "technician") {
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }
  });

  // Handle customer joining live chat queue
  socket.on("joinLiveChatQueue", (customerDetails) => {
    console.log(`[DEBUG] Before adding to queue:`, liveChatQueue);
    const customerData = { id: socket.id, ...customerDetails }; // Ensure all customer details are included
    liveChatQueue.push(customerData);
    console.log(`[DEBUG] After adding to queue:`, liveChatQueue);

    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
    console.log(`[DEBUG] Emitted updateLiveChatQueue with data:`, liveChatQueue);
  });

  // Handle technician selecting a customer
  socket.on("selectCustomer", (customerId) => {
    console.log(`[DEBUG] Technician selected customer with ID: ${customerId}`);
    const customer = liveChatQueue.find((c) => c.id === customerId);
    if (customer) {
      liveChatQueue = liveChatQueue.filter((c) => c.id !== customerId);
      console.log(`[DEBUG] Updated liveChatQueue after selection:`, liveChatQueue);

      io.emit("updateLiveChatQueue", liveChatQueue); // Update queue for all technicians
      console.log(`[DEBUG] Emitted updateLiveChatQueue with data:`, liveChatQueue);

      io.to(customerId).emit("technicianConnected", { technicianId: socket.id });
      io.to(socket.id).emit("customerConnected", customer);
    } else {
      console.warn(`[WARN] Customer with ID ${customerId} not found in queue.`);
    }
  });

  // Handle real-time messaging
  socket.on("sendMessage", ({ to, message }) => {
    console.log(`[DEBUG] Message from ${socket.id} to ${to}: ${message}`);
    io.to(to).emit("receiveMessage", { from: socket.id, message }); // Send message to the recipient
  });

  // Handle updating the technician's schedule
  socket.on("updateTechnicianSchedule", (updatedSchedule) => {
    technicianSchedule = updatedSchedule;
    io.emit("updateTechnicianSchedule", technicianSchedule); // Broadcast the updated schedule
    console.log("Technician schedule updated:", technicianSchedule);
  });

  // Emit the current schedule to newly connected clients
  socket.emit("updateTechnicianSchedule", technicianSchedule);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    const user = users.get(socket.id);
    users.delete(socket.id);

    if (user?.role === "technician") {
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }

    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    console.log(`[DEBUG] Updated liveChatQueue after disconnection:`, liveChatQueue);

    io.emit("updateLiveChatQueue", liveChatQueue); // Notify all technicians
    console.log(`[DEBUG] Emitted updateLiveChatQueue with data:`, liveChatQueue);
  });
});

// Emit technician schedule to all connected clients
function broadcastTechnicianSchedule() {
  const schedule = [
    { date: "2023-10-01", time: "10:00 AM" },
    { date: "2023-10-01", time: "02:00 PM" },
    { date: "2023-10-02", time: "11:00 AM" },
  ]; // Example schedule
  io.emit("updateTechnicianSchedule", schedule);
}

// Call this function whenever the schedule is updated
broadcastTechnicianSchedule();

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});