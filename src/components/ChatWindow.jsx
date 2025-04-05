import React, { useRef, useEffect } from "react";
import Message from "./Message";
import "../styles/ChatWindow.css"; // Import styles

const ChatWindow = ({ messages, role, socket }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check if socket exists and has an id property
  const socketId = socket?.id;

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message
            key={index}
            sender={msg.from === socketId ? "You" : role === "customer" ? "Technician" : "Customer"}
            text={msg.message}
            timestamp={msg.timestamp || Date.now()}
            attachment={msg.attachment}
            isSender={msg.from === socketId}
          />
        ))}
        <div ref={messagesEndRef} /> {/* Scroll anchor */}
      </div>
    </div>
  );
};

export default ChatWindow;
