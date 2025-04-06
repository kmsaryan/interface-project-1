// ChatWindow.jsx
import React, { useRef, useEffect } from "react";
import "../styles/ChatWindow.css"; // Import styles

const ChatWindow = ({ messages, readReceipts }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.from === "user" ? "sent" : "received"}`}
        >
          <p>{msg.message}</p>
          {readReceipts[msg.from] && <span className="read-receipt">✔ Read</span>}
        </div>
      ))}
      <div ref={messagesEndRef} /> {/* Scroll anchor */}
    </div>
  );
};

export default ChatWindow;
