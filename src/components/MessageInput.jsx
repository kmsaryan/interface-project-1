//MessageInput.jsx
import React, { useState } from "react";
import "../styles/MessageInput.css"; // Import styles

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState("");
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size
  const ALLOWED_FILE_TYPES = [
    "image/jpeg", "image/png", "image/gif", 
    "application/pdf", "text/plain", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
  ];

  const handleSend = () => {
    if (!message.trim() && !attachment) {
      setFileError("Cannot send an empty message.");
      return;
    }
    
    if (attachment) {
      // Start simulated progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // Reset after a short delay
          setTimeout(() => {
            setUploadProgress(0);
            onSendMessage(message, attachment);
            setMessage("");
            setAttachment(null);
            setFileError("");
          }, 500);
        }
      }, 100);
    } else {
      onSendMessage(message, null);
      setMessage("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    
    if (!file) return;
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File too large. Maximum size is ${MAX_FILE_SIZE/1024/1024}MB.`);
      return;
    }
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError("Unsupported file type. Please upload an image, PDF, or document.");
      return;
    }

    setAttachment(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  return (
    <div className="message-input-container">
      {fileError && <div className="file-error">{fileError}</div>}
      
      {attachment && (
        <div className="attachment-preview">
          <span>{attachment.name}</span>
          <button onClick={removeAttachment} className="remove-attachment">×</button>
          {uploadProgress > 0 && (
            <div className="upload-progress-container">
              <div 
                className="upload-progress-bar" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
      
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
        <button 
          onClick={handleSend} 
          disabled={(!message.trim() && !attachment) || uploadProgress > 0} 
          className="send-button"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
