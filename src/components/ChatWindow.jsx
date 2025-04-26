// ChatWindow.jsx
import React from "react";
import "../styles/ChatWindow.css"; // Import styles

const ChatWindow = ({ messages, socket, readReceipts, typingIndicator, onDownloadFile }) => {
  const getFilePreview = (fileData) => {
    // If it's an image, show it
    if (fileData.type && fileData.type.startsWith('image/')) {
      return (
        <div className="attachment-preview">
          <img src={fileData.content} alt="Attachment" />
          <button 
            className="download-button"
            onClick={() => onDownloadFile(fileData)}
          >
            Download
          </button>
        </div>
      );
    } else {
      // For other files show an icon based on type
      let icon = "📄"; // Default file icon
      if (fileData.type === 'application/pdf') icon = "📑";
      else if (fileData.type.includes('spreadsheet')) icon = "📊";
      else if (fileData.type.includes('word')) icon = "📝";
      else if (fileData.type === 'text/plain') icon = "📃";
      
      return (
        <div className="attachment-file">
          <div className="file-icon">{icon}</div>
          <div className="file-details">
            <span className="file-name">{fileData.name}</span>
            <span className="file-size">{(fileData.size / 1024).toFixed(1)} KB</span>
          </div>
          <button 
            className="download-button"
            onClick={() => onDownloadFile(fileData)}
          >
            Download
          </button>
        </div>
      );
    }
  };
  
  return (
    <div className="chat-window">
      {messages.map((msg, index) => {
        let messageContent = msg.message;

        // Parse the message if it is a JSON string
        try {
          const parsedMessage = JSON.parse(msg.message);
          if (parsedMessage && typeof parsedMessage.message === "string") {
            messageContent = parsedMessage.message;
          }
        } catch (error) {
          // Not a JSON string, use as is
        }

        const isSent = msg.from === socket.id;
        const readReceipt = isSent && readReceipts[msg.to] ? "✓✓" : "✓";

        // Parse and format the timestamp
        const timestamp = msg.timestamp
          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "N/A";

        return (
          <div
            key={index}
            className={`chat-bubble ${isSent ? "sent" : "received"}`}
          >
            {messageContent && <div className="message-body">{messageContent}</div>}
            
            {msg.fileData && getFilePreview(msg.fileData)}
            
            <div className="message-footer">
              {isSent && <span className="read-receipt">{readReceipt}</span>}
              <span className="message-timestamp">{timestamp}</span>
            </div>
          </div>
        );
      })}
      {typingIndicator && <div className="typing-indicator">Typing...</div>}
    </div>
  );
};

export default ChatWindow;
