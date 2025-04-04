import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Import Link for navigation
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import socket from "../utils/socket";
import "../styles/LiveChat.css";

const LiveChat = () => {
  const location = useLocation(); // Access navigation state
  const { role, customerId, name, queue } = location.state || {}; // Extract role, customerId, name, and queue from state
  const [messages, setMessages] = useState([]);
  const [recipientId, setRecipientId] = useState(customerId || null); // Track the recipient ID
  const [chatPartnerName, setChatPartnerName] = useState(name || ""); // Track the name of the person being chatted with

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        // Avoid duplicate messages
        if (prev.some((msg) => msg.timestamp === message.timestamp && msg.from === message.from)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    // Handle connection events
    socket.on("customerConnected", (customer) => {
      if (role === "technician") {
        setRecipientId(customer.id); // Set recipient ID for technician
        setChatPartnerName(customer.name); // Set chat partner name
      }
    });

    socket.on("technicianConnected", (technician) => {
      if (role === "customer") {
        setRecipientId(technician.technicianId); // Set recipient ID for customer
        setChatPartnerName("Technician"); // Set chat partner name
      }
    });

    // Handle chat ended event
    socket.on("chatEnded", () => {
      alert("Chat has ended.");
      setMessages([]); // Clear messages
      setRecipientId(null); // Reset recipient ID
      setChatPartnerName(""); // Reset chat partner name
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("customerConnected");
      socket.off("technicianConnected");
      socket.off("chatEnded");
    };
  }, [role]);

  const handleSendMessage = ({ message, attachment }) => {
    if (recipientId) {
      const data = { to: recipientId, message, attachment, timestamp: Date.now() };
      setMessages((prev) => [...prev, { ...data, from: socket.id }]); // Add sent message to state
      socket.emit("sendMessage", data); // Emit message to server
    } else {
      console.warn("Recipient ID is not set. Cannot send message.");
    }
  };

  return (
    <div className="live-chat-page">
      {role === "technician" && ( // Show the back link only for technicians
        <div className="queue-section">
          <Link to="/technician" className="back-link">← Back to Technician Dashboard</Link>
          <h3>Customer Queue</h3>
          <div className="queue-list">
            {queue?.map((customer) => (
              <div key={customer.id} className="queue-card">
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Time Elapsed:</strong> {Math.floor((Date.now() - customer.joinedAt) / 60000)} mins</p>
                <button className="end-chat-button">End Chat</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="chat-section">
        <header className="chat-header">
          <h2>Chat with {chatPartnerName || "Unknown"}</h2>
        </header>
        <ChatWindow messages={messages} role={role} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default LiveChat;
