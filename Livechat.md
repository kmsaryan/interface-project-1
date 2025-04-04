---
# Live Chat Implementation Documentation

## Overview

This guide explains how to implement a live chat system using Node.js, Express, and Socket.IO. It includes server setup, client-side integration, event-based messaging, and environment configuration.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Setup and Configuration](#setup-and-configuration)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Event-Based Messaging](#event-based-messaging)
7. [Running the Application](#running-the-application)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

The live chat system enables real-time communication between customers and technicians using:
- **Socket.IO** for bidirectional communication.
- **Express** for server-side logic.

Features include user registration, queue management, real-time messaging, and technician scheduling.

---

## Technologies Used

- **Node.js**: JavaScript runtime for server-side code.
- **Express**: Web framework for building APIs.
- **Socket.IO**: Library for real-time communication.
- **CORS**: Ensures secure cross-domain requests.

---

## Setup and Configuration

### Environment Variables

Define the following in a `.env` file:

```properties
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:5000
GENERATE_SOURCEMAP=false

```

### Server Setup

The server listens on a configurable host and port:

```javascript
const PORT = process.env.BACKEND_PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
```

---

## Backend Implementation

### Express and Socket.IO Setup

The backend integrates Express and Socket.IO for real-time communication:

```javascript
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```

### Event Handlers

Socket.IO handles events for user registration, queue management, messaging, and scheduling:

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
    liveChatQueue.push({ id: socket.id, ...customerDetails });
    io.emit("updateLiveChatQueue", liveChatQueue);
  });

  socket.on("sendMessage", ({ to, message }) => {
    io.to(to).emit("receiveMessage", { from: socket.id, message });
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    io.emit("updateLiveChatQueue", liveChatQueue);
  });
});
```

---

## Frontend Implementation

The frontend initializes a Socket.IO client for real-time communication.

---

## Event-Based Messaging

Key events include:

- **Connection Events**: `connect`, `disconnect`
- **User Events**: `registerUser`, `updateTechnicianStatus`
- **Queue Events**: `joinLiveChatQueue`, `updateLiveChatQueue`
- **Messaging Events**: `sendMessage`, `receiveMessage`

---

## Running the Application

### Backend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   npm run server
   ```

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the React development server:
   ```bash
   npm start
   ```

---

## Troubleshooting

### WebSocket Connection Issues

- Ensure the backend server is running and accessible.
- Verify the frontend points to the correct WebSocket server URL.

### CORS Errors

- Check the `cors` configuration in the backend.

---

This documentation ensures developers can easily set up, configure, and troubleshoot the live chat system.

