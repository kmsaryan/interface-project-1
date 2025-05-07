//MessageInput.jsx
import React, { useState } from "react";
import "../styles/MessageInput.css"; // Import styles

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState("");
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size
  const ALLOWED_FILE_TYPES = [
    "image/jpeg", "image/png", "image/gif", 
    "application/pdf", "text/plain", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
  ];

  const handleSend = async () => {
    if (!message.trim() && !attachment) {
      setFileError("Cannot send an empty message.");
      return;
    }

    let fileData = null;

    if (attachment) {
      try {
        const formData = new FormData();
        formData.append("file", attachment);

        // Upload the file to the backend
        const response = await fetch("http://localhost:5000/file/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const result = await response.json();
        fileData = {
          id: result.id,
          name: attachment.name,
          type: attachment.type,
          size: attachment.size,
        };

        console.log("File uploaded successfully:", fileData);
      } catch (err) {
        console.error("Error uploading file:", err);
        setFileError("Failed to upload file. Please try again.");
        return;
      }
    }

    onSendMessage(message, fileData);
    setMessage("");
    setAttachment(null);
    setFileError("");
  };

  const handleFileChange = (e) => {
    try {
      const file = e.target.files[0];
      setFileError("");
      
      if (!file) return;
      
      console.log("File selected:", { name: file.name, type: file.type, size: file.size });
      
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

      // Verify it's a proper Blob/File before setting
      if (!(file instanceof Blob)) {
        setFileError("Invalid file format. Please select a valid file.");
        return;
      }

      setAttachment(file);
    } catch (err) {
      console.error("Error handling file selection:", err);
      setFileError("Error selecting file. Please try again.");
    }
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
          disabled={(!message.trim() && !attachment)} 
          className="send-button"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
