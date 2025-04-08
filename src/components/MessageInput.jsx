//MessageInput.jsx
import React, { useState } from "react";
import "../styles/MessageInput.css"; // Import styles

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleSend = () => {
    if (!message.trim() && !attachment) {
      console.warn("Cannot send an empty message."); // Debugging log
      return;
    }
    onSendMessage({ message, attachment });
    setMessage("");
    setAttachment(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <div className="message-input">
      <label className="attachment-icon">
        📎
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
      </label>
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          onTyping(); // Notify typing
        }}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} disabled={!message.trim() && !attachment} className="send-button">➤</button>
    </div>
  );
};

export default MessageInput;
