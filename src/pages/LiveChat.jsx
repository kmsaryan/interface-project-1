import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import socket from "../utils/socket";
import "../styles/LiveChat.css"; // Styles for the chat interface

const LiveChat = () => {
  const location = useLocation();
  const { role, customerId, name, queue = [] } = location.state || {};
  const [messages, setMessages] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [connectedTechnician, setConnectedTechnician] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [readReceipts, setReadReceipts] = useState({}); // Track read receipts

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const senderId = message.from;
      setMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), message],
      }));
      socket.emit("readReceipt", { from: senderId }); // Send read receipt
    };

    const handleTyping = (id) => {
      if ((role === "technician" && selectedCustomer?.id === id) || (role === "customer" && connectedTechnician?.technicianId === id)) {
        setTypingIndicator(true);
        setTimeout(() => setTypingIndicator(false), 2000);
      }
    };

    if (role === "technician") {
      socket.emit("registerUser", { role: "technician", name: "Technician" });
      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("customerTyping", handleTyping);
    } else if (role === "customer") {
      socket.emit("registerUser", { role: "customer", name });
      socket.on("technicianConnected", (technician) => setConnectedTechnician(technician));
      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("technicianTyping", handleTyping);
    }

    socket.on("readReceipt", ({ from }) => {
      setReadReceipts((prev) => ({ ...prev, [from]: true })); // Mark messages as read
    });

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("customerTyping", handleTyping);
      socket.off("technicianTyping", handleTyping);
      socket.off("readReceipt");
      if (role === "customer") {
        socket.off("technicianConnected");
      }
    };
  }, [role, name, selectedCustomer, connectedTechnician]);

  const handleSendMessage = (message) => {
    const recipientId = role === "technician" ? selectedCustomer?.id : connectedTechnician?.technicianId;
    if (!recipientId) {
      console.warn("No recipient ID found. Message not sent.");
      return;
    }

    const newMessage = {
      to: recipientId,
      message: typeof message === "string" ? message : JSON.stringify(message),
      timestamp: Date.now(),
      from: socket.id,
    };

    setMessages((prev) => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), newMessage],
    }));

    if (socket.connected) {
      socket.emit("sendMessage", newMessage);
    } else {
      console.error("Socket is not connected. Message not sent.");
    }
  };

  const handleTyping = () => {
    if (role === "technician" && selectedCustomer) {
      socket.emit("technicianTyping", selectedCustomer.id);
    } else if (role === "customer" && connectedTechnician) {
      socket.emit("customerTyping", connectedTechnician.technicianId);
    }
  };

  if (role === "customer") {
    return (
      <>
        <Header />
        <div className="live-chat-page">
          <div className="chat-container">
            <div className="chat-sidebar">
              <h3>Technician Details</h3>
              {connectedTechnician ? (
                <div className="technician-details">
                  <p><strong>Name:</strong> {connectedTechnician.name}</p>
                  <p><strong>ID:</strong> {connectedTechnician.technicianId}</p>
                  <p><strong>Status:</strong> Online</p>
                </div>
              ) : (
                <p>No technician connected.</p>
              )}
            </div>
            <div className="chat-main">
              <ChatWindow
                messages={messages[connectedTechnician?.technicianId] || []}
                socket={socket} // Pass the socket instance
                readReceipts={readReceipts} // Pass read receipts
                role={role} // Pass the role
              />
              <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
              {typingIndicator && <div className="typing-indicator">Technician is typing...</div>}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="live-chat-page">
        <div className="chat-container">
          <div className="chat-sidebar">
            <h3>Customer Queue</h3>
            {queue.map((customer) => (
              <div
                key={customer.id}
                className={`queue-item ${selectedCustomer?.id === customer.id ? "selected" : ""}`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <span>{customer.name}</span>
              </div>
            ))}
          </div>
          <div className="chat-main">
            <ChatWindow
              messages={messages[selectedCustomer?.id] || []}
              socket={socket} // Pass the socket instance
              readReceipts={readReceipts} // Pass read receipts
              role={role} // Pass the role
            />
            <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
            {typingIndicator && <div className="typing-indicator">Customer is typing...</div>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LiveChat;
