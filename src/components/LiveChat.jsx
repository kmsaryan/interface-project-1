//livechat.js
// This code implements a live chat system using React and Socket.io.
// The customer can send messages to a technician, and the technician can respond.
// The system also tracks the number of technicians online and manages the connection between customers and technicians.
// The code is divided into two parts: the client-side React component and the server-side Socket.io implementation.
import React, { useState, useEffect } from "react";
import socket from "../utils/socket"; // Assume socket is initialized elsewhere
import "../styles/LiveChat.css";

export default function LiveChat({ customerId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [techniciansOnline, setTechniciansOnline] = useState(0);
  const [connectedTechnician, setConnectedTechnician] = useState(null);

  useEffect(() => {
    // Join live chat queue
    socket.emit("joinLiveChatQueue", { name: "Customer", issue: "Issue description" });
    console.log("[CUSTOMER LOG]: Customer joined the live chat queue");

    // Listen for technician status updates
    socket.on("updateTechnicianStatus", (technicians) => {
      console.log("[CUSTOMER LOG]: Technicians online", technicians);
      setTechniciansOnline(technicians.length);
    });

    // Listen for technician connection
    socket.on("technicianConnected", ({ technicianId }) => {
      console.log("[CUSTOMER LOG]: Connected to technician", technicianId);
      setConnectedTechnician(technicianId);
    });

    // Listen for messages
    socket.on("message", ({ from, message }) => {
      console.log("[CUSTOMER LOG]: Message received", { from, message });
      setMessages((prevMessages) => [...prevMessages, { from, message }]);
    });

    return () => {
      socket.off("updateTechnicianStatus");
      socket.off("technicianConnected");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (connectedTechnician) {
      console.log(`[CUSTOMER LOG]: Sending message to ${connectedTechnician}: ${message}`);
      socket.emit("message", { to: connectedTechnician, message });
      setMessages((prevMessages) => [...prevMessages, { from: "You", message }]);
      setMessage("");
    }
  };

  return (
    <div className="live-chat">
      <p>Technicians Online: {techniciansOnline}</p>
      {connectedTechnician ? (
        <div>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from}`}>
                <strong>{msg.from}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <p>Waiting for a technician to connect...</p>
      )}
    </div>
  );
}

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