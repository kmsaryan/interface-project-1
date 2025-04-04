import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import socket from "../utils/socket";
import "../styles/LiveChat.css";

const LiveChat = () => {
  const location = useLocation(); // Access navigation state
  const navigate = useNavigate(); // Initialize navigate
  const { role, customerId, name, queue } = location.state || {}; // Extract role, customerId, name, and queue from state
  const [messages, setMessages] = useState([]);
  const [recipientId, setRecipientId] = useState(customerId || null); // Track the recipient ID
  const [chatPartnerName, setChatPartnerName] = useState(name || "Unknown"); // Track the name of the person being chatted with

  useEffect(() => {
    // Persist chat partner details across tabs
    if (!chatPartnerName && role === "technician" && queue) {
      const customer = queue.find((c) => c.id === customerId);
      if (customer) setChatPartnerName(customer.name);
    }

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
      setChatPartnerName("Unknown"); // Reset chat partner name
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("customerConnected");
      socket.off("technicianConnected");
      socket.off("chatEnded");
    };
  }, [role, customerId, chatPartnerName, queue]);

  const handleSendMessage = ({ message, attachment }) => {
    if (recipientId) {
      const data = { to: recipientId, message, attachment, timestamp: Date.now() };
      setMessages((prev) => [...prev, { ...data, from: socket.id }]); // Add sent message to state
      socket.emit("sendMessage", data); // Emit message to server
    } else {
      console.warn("Recipient ID is not set. Cannot send message.");
    }
  };

  const handleEndChat = () => {
    const confirmEnd = window.confirm("Are you sure you want to end this chat?");
    if (confirmEnd) {
      socket.emit("endChat", { customerId: recipientId });
      alert("Chat has ended.");
    }
  };

  const handleEscalateToVideoCall = () => {
    const confirmEscalate = window.confirm("Are you sure you want to escalate this chat to a video call?");
    if (confirmEscalate) {
      const meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;
      socket.emit("escalateToVideoCall", { customerId: recipientId, meetLink });
      alert(`Video call link: ${meetLink}`);
    }
  };

  const handleCustomerEndChat = () => {
    const confirmEnd = window.confirm("Are you sure you want to end this chat?");
    if (confirmEnd) {
      socket.emit("endChat", { customerId: socket.id });
      alert("You have ended the chat.");
      navigate("/home"); // Redirect to customer home page
    }
  };

  const handleCustomerEscalate = () => {
    const confirmEscalate = window.confirm("Do you want to escalate this issue?");
    if (confirmEscalate) {
      socket.emit("escalateChat", { customerId: socket.id, escalationType: "Supervisor" });
      alert("Your issue has been escalated.");
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
                <button className="end-chat-button" onClick={handleEndChat}>End Chat</button>
                <button className="escalate-button" onClick={handleEscalateToVideoCall}>Escalate to Video Call</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="chat-section">
        <header className="chat-header">
          <h2>Chat with {chatPartnerName || "Unknown"}</h2>
          {role === "customer" && (
            <>
              <button className="end-chat-button" onClick={handleCustomerEndChat}>
                End Chat
              </button>
              <button className="escalate-button" onClick={handleCustomerEscalate}>
                Escalate Issue
              </button>
            </>
          )}
        </header>
        <ChatWindow messages={messages} role={role} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default LiveChat;
