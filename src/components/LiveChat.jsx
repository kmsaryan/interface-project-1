import React, { useState, useEffect } from "react";
import socket from "../utils/socket";
import ChatInterface from "./ChatInterface";
import "../styles/LiveChat.css";

export default function LiveChat({ role, userDetails, connectedUser }) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(
    role === "customer" ? "Waiting to connect..." : "Select a customer to connect."
  );
  const [connectedUserId, setConnectedUserId] = useState(null);
  const [notification, setNotification] = useState(null); // State to store notifications

  useEffect(() => {
    if (role === "customer") {
      socket.emit("joinLiveChatQueue", userDetails);

      socket.on("technicianConnected", ({ technicianId }) => {
        setConnectedUserId(technicianId);
        setConnectionStatus("Connected to a technician!");
      });
    }

    if (role === "technician" && connectedUser) {
      setConnectedUserId(connectedUser.id);
      setConnectionStatus(`Connected to ${connectedUser.name}`);
    }

    socket.on("receiveMessage", ({ from, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: from === socket.id ? "You" : role === "customer" ? "Technician" : "Customer", text: message },
      ]);
    });

    socket.on("notification", (data) => {
      console.log("[NOTIFICATION]:", data);
      setNotification(data); // Display the notification
    });

    return () => {
      socket.off("technicianConnected");
      socket.off("receiveMessage");
      socket.off("notification");
    };
  }, [role, userDetails, connectedUser]);

  const handleSendMessage = ({ text, attachment }) => {
    if (connectedUserId) {
      console.log(`[DEBUG] Sending message to ${connectedUserId}: ${text}`);
      socket.emit("sendMessage", { to: connectedUserId, message: text });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", text, attachment },
      ]);
    } else {
      console.warn("[WARN] No connected user to send the message to.");
    }
  };

  return (
    <div className="live-chat">
      <p>{connectionStatus}</p>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {connectedUserId ? (
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
      ) : (
        <p>{role === "customer" ? "Waiting for a technician to connect..." : "No customer connected."}</p>
      )}
    </div>
  );
}