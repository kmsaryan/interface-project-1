import React from "react";
import Message from "./Message";
import "../styles/ChatWindow.css"; // Import styles
import socket from "../utils/socket"; // Import socket to identify sender

const ChatWindow = ({ messages, role }) => {
  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="empty-chat">No messages yet. Start the conversation!</div>
      ) : (
        <div className="messages">
          {messages.map((msg, index) => (
            <Message
              key={index}
              sender={msg.from === socket.id ? "You" : role === "customer" ? "Technician" : "Customer"}
              text={msg.message}
              timestamp={msg.timestamp || Date.now()}
              attachment={msg.attachment}
              isSender={msg.from === socket.id} // Determine if the message is sent by the current user
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
