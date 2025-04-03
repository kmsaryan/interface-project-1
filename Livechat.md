---
# Live Chat Implementation Documentation
## Overview
This documentation provides an overview of how the live chat functionality is implemented using the provided scripts. It covers the setup and configuration of the server, client-side integration, event-based messaging, CORS, and other relevant concepts.
## Table of Contents
1. Introduction
2. Technologies Used
3. Setup and Configuration
4. Backend Implementation
5. Frontend Implementation
6. Event-Based Messaging
7. CORS Configuration
8. Running the Application

## Introduction
The live chat system allows real-time communication between customers and technicians. It uses Socket.IO for bidirectional communication, Express for server-side logic, and WebSocket for reliable transport. The system includes functionalities for user registration, queue management, real-time messaging, and technician scheduling.
## Technologies Used
- **Node.js**: JavaScript runtime for server-side code.
- **Express**: Web framework for Node.js.
- **Socket.IO**: Library for real-time, bidirectional communication.
- **WebSocket**: Protocol for full-duplex communication channels.
- **CORS**: Cross-Origin Resource Sharing for secure cross-domain requests.

## Setup and Configuration
### Environment Variables
Set up environment variables for dynamic configuration:
```bash
REACT_APP_SERVER_URL=http://your-frontend-url.com
PORT=5000
HOST=0.0.0.0
FRONTEND_URL=http://your-frontend-url.com
```

### Server Setup

The server is configured to listen on a dynamic host and port, allowing it to work in different environments, including production.

```javascript
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
```

## Backend Implementation

### Express and Socket.IO Setup

The backend uses Express to create an HTTP server and Socket.IO for real-time communication.

```javascript
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```

### Data Structures

The backend uses in-memory data structures to track users, live chat queues, and technician schedules.

```javascript
const users = new Map();
let liveChatQueue = [];
let technicianSchedule = [];
```

### Event Handlers

The backend handles various events for user registration, queue management, real-time messaging, and technician scheduling.

```javascript
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("registerUser", (userDetails) => {
    users.set(socket.id, userDetails);
    if (userDetails.role === "technician") {
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }
  });

  socket.on("joinLiveChatQueue", (customerDetails) => {
    const customerData = { id: socket.id, ...customerDetails };
    liveChatQueue.push(customerData);
    io.emit("updateLiveChatQueue", liveChatQueue);
  });

  socket.on("selectCustomer", (customerId) => {
    const customer = liveChatQueue.find((c) => c.id === customerId);
    if (customer) {
      liveChatQueue = liveChatQueue.filter((c) => c.id !== customerId);
      io.emit("updateLiveChatQueue", liveChatQueue);
      io.to(customerId).emit("technicianConnected", { technicianId: socket.id });
      io.to(socket.id).emit("customerConnected", customer);
    }
  });

  socket.on("sendMessage", ({ to, message }) => {
    io.to(to).emit("receiveMessage", { from: socket.id, message });
  });

  socket.on("updateTechnicianSchedule", (updatedSchedule) => {
    technicianSchedule = updatedSchedule;
    io.emit("updateTechnicianSchedule", technicianSchedule);
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    users.delete(socket.id);
    if (user?.role === "technician") {
      io.emit("updateTechnicianStatus", Array.from(users.values()).filter(user => user.role === "technician"));
    }
    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    io.emit("updateLiveChatQueue", liveChatQueue);
  });
});
```

### Broadcasting Technician Schedule

The backend broadcasts the technician schedule to all connected clients.

```javascript
function broadcastTechnicianSchedule() {
  const schedule = [
    { date: "2023-10-01", time: "10:00 AM" },
    { date: "2023-10-01", time: "02:00 PM" },
    { date: "2023-10-02", time: "11:00 AM" },
  ];
  io.emit("updateTechnicianSchedule", schedule);
}

broadcastTechnicianSchedule();
```

## Frontend Implementation
### Socket.IO Client Setup
The frontend initializes a Socket.IO client and sets up event handlers for real-time communication.
## Event-Based Messaging
Event-based messaging allows for real-time interactions between the client and server. Key events include:
- **Connection Events**: `connect`, `disconnect`
- **User Events**: `registerUser`, `updateTechnicianStatus`
- **Queue Events**: `joinLiveChatQueue`, `updateLiveChatQueue`, `selectCustomer`
- **Messaging Events**: `sendMessage`, `receiveMessage`
- **Schedule Events**: `updateTechnicianSchedule`
These events enable the system to handle real-time updates, manage queues, and facilitate live chat sessions.
## CORS Configuration
CORS (Cross-Origin Resource Sharing) is configured to allow requests from the frontend domain, ensuring secure cross-domain communication.
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```
## Running the Application
### Starting the Server
To start the server, run the following command:
```bash
node server.js
```
