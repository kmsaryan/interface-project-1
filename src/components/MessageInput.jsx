import React, { useState } from "react";
import "../styles/MessageInput.css"; // Import styles

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleSend = () => {
    if (message.trim() || attachment) {
      onSendMessage({ message, attachment });
      setMessage("");
      setAttachment(null);
    }
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
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} className="send-button">➤</button>
    </div>
  );
};

export default MessageInput;
