//livechat.js
// This code implements a live chat system using React and Socket.io.
// The customer can send messages to a technician, and the technician can respond.
// The system also tracks the number of technicians online and manages the connection between customers and technicians.
// The code is divided into two parts: the client-side React component and the server-side Socket.io implementation.
import React, { useState, useEffect } from "react";
import socket from "../utils/socket"; // Use the WebSocket client from socket.js
import ChatInterface from "./ChatInterface";
import "../styles/LiveChat.css";

export default function LiveChat({ customerDetails }) {
  const [messages, setMessages] = useState([]);
  const [connectedTechnician, setConnectedTechnician] = useState(null);
  const [queueStatus, setQueueStatus] = useState("Waiting to connect...");

  useEffect(() => {
    console.log("Joining live chat queue with customer details:", customerDetails);
    socket.emit("joinLiveChatQueue", customerDetails);

    socket.on("technicianConnected", ({ technicianId }) => {
      console.log("Technician connected:", technicianId);
      setConnectedTechnician(technicianId);
      setQueueStatus("Connected to a technician!");
    });

    socket.on("receiveMessage", ({ from, message }) => {
      console.log("Message received from:", from, "Message:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: from === socket.id ? "You" : "Technician", text: message },
      ]);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("technicianConnected");
      socket.off("receiveMessage");
      socket.off("error");
    };
  }, [customerDetails]);

  const handleSendMessage = ({ text, attachment }) => {
    if (connectedTechnician) {
      console.log("Sending message to technician:", connectedTechnician, "Message:", text);
      socket.emit("sendMessage", { to: connectedTechnician, message: text });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", text, attachment },
      ]);
    } else {
      console.warn("Cannot send message, no technician connected.");
    }
  };

  return (
    <div className="live-chat">
      <p>{queueStatus}</p>
      {connectedTechnician ? (
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
      ) : (
        <p>Waiting for a technician to connect...</p>
      )}
    </div>
  );
}