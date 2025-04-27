import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import socket from "../utils/socket";
import "../styles/LiveChat.css";

const LiveChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, name, queue = [] } = location.state || {};
  const [messages, setMessages] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [connectedTechnician, setConnectedTechnician] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [readReceipts, setReadReceipts] = useState({});

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const senderId = message.from;
      console.log(`[CHAT LOG]: Received message from ${senderId}`, message);

      // Check if the message contains file data for debugging
      if (message.fileData) {
        console.log(`[CHAT LOG]: Received file data: ${message.fileData.name}, type: ${message.fileData.type}`);
      }

      setMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), message],
      }));
      socket.emit("readReceipt", { from: senderId });
    };

    const handleTyping = (id) => {
      if (
        (role === "technician" && selectedCustomer?.id === id) ||
        (role === "customer" && connectedTechnician?.technicianId === id)
      ) {
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
      socket.on("technicianConnected", (technician) =>
        setConnectedTechnician(technician)
      );
      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("technicianTyping", handleTyping);
    }

    socket.on("readReceipt", ({ from }) => {
      setReadReceipts((prev) => ({ ...prev, [from]: true }));
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

  const handleSendMessage = (message, fileData) => {
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
    
    if (fileData) {
      // Don't need to process the file here - it's already processed in MessageInput
      console.log(`[CHAT LOG]: Sending message with file: ${fileData.name}`);
      newMessage.fileData = fileData;
      
      // Send message with file data
      socket.emit("sendMessage", newMessage);
      
      // Update local state
      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), newMessage],
      }));
    } else {
      // Send regular message
      socket.emit("sendMessage", newMessage);
      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), newMessage],
      }));
    }
  };
  
  const handleDownloadFile = (fileData) => {
    try {
      if (!fileData || !fileData.content) {
        console.error("[CHAT ERROR]: Missing file data or content");
        return;
      }
      
      console.log(`[CHAT LOG]: Downloading file: ${fileData.name}`);
      
      const link = document.createElement("a");
      link.href = fileData.content;
      link.download = fileData.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("[CHAT ERROR]: Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    }
  };

  const handleTyping = () => {
    if (role === "technician" && selectedCustomer) {
      socket.emit("technicianTyping", selectedCustomer.id);
    } else if (role === "customer" && connectedTechnician) {
      socket.emit("customerTyping", connectedTechnician.technicianId);
    }
  };

  const handleEndChat = () => {
    const confirmEnd = window.confirm("Are you sure you want to end this chat?");
    if (confirmEnd) {
      const recipientId =
        role === "technician"
          ? selectedCustomer?.id
          : connectedTechnician?.technicianId;
      if (recipientId) {
        socket.emit("endChat", { customerId: recipientId });
        setMessages({});
        setSelectedCustomer(null);
        setConnectedTechnician(null);
        alert("Chat ended.");
        navigate(role === "technician" ? "/technician" : "/customer_home");
      }
    }
  };

  useEffect(() => {
    socket.on("chatEnded", () => {
      alert("The other side has ended the chat.");
      setMessages({});
      setSelectedCustomer(null);
      setConnectedTechnician(null);
      navigate(role === "technician" ? "/technician" : "/customer_home");
    });

    return () => {
      socket.off("chatEnded");
    };
  }, [role, navigate]);

  return (
    <div className="live-chat-page">
      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>
            {role === "technician" ? "Customer Queue" : "Technician Details"}
          </h3>
          {role === "technician" ? (
            queue.map((customer) => (
              <div
                key={customer.id}
                className={`queue-item ${
                  selectedCustomer?.id === customer.id ? "selected" : ""
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <span>{customer.name}</span>
              </div>
            ))
          ) : connectedTechnician ? (
            <div className="technician-details">
              <p>
                <strong>Name:</strong> {connectedTechnician.name}
              </p>
              <p>
                <strong>ID:</strong> {connectedTechnician.technicianId}
              </p>
              <p>
                <strong>Status:</strong> Online
              </p>
            </div>
          ) : (
            <p>No technician connected.</p>
          )}
        </div>
        <div className="chat-main">
          <div className="chat-window">
            <ChatWindow
              messages={
                messages[
                  selectedCustomer?.id || connectedTechnician?.technicianId
                ] || []
              }
              socket={socket}
              readReceipts={readReceipts}
              role={role}
              onDownloadFile={handleDownloadFile}
            />
          </div>
          <div className="chat-actions">
            <button className="end-chat-button" onClick={handleEndChat}>
              End Chat
            </button>
          </div>
          <MessageInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
          />
          {typingIndicator && (
            <div className="typing-indicator">
              {role === "technician"
                ? "Customer is typing..."
                : "Technician is typing..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
