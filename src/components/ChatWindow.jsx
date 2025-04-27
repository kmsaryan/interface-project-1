// ChatWindow.jsx
import React from "react";
import "../styles/ChatWindow.css"; // Import styles

const ChatWindow = ({ messages, socket, readReceipts, typingIndicator, onDownloadFile }) => {
  const handleDownloadFile = async (fileData) => {
    try {
      const response = await fetch(`http://localhost:5000/file/download/${fileData.id}`);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("File downloaded successfully:", fileData.name);
    } catch (err) {
      console.error("Error downloading file:", err);
      alert("Failed to download file. Please try again.");
    }
  };

  const getFilePreview = (fileData) => {
    // Log file data for debugging
    console.log(`[CHAT WINDOW]: Processing file preview for ${fileData.name}, type: ${fileData.type}`);
    
    if (fileData.type && fileData.type.startsWith('image/')) {
      return (
        <div className="attachment-preview">
          <img src={fileData.content} alt="Attachment" />
          <button 
            className="download-button"
            onClick={() => handleDownloadFile(fileData)}
          >
            Download
          </button>
        </div>
      );
    } else {
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
            onClick={() => handleDownloadFile(fileData)}
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

        return (
          <div
            key={index}
            className={`chat-bubble ${isSent ? "sent" : "received"}`}
          >
            {messageContent && <div className="message-body">{messageContent}</div>}
            
            {/* Check if fileData exists and render it */}
            {msg.fileData && getFilePreview(msg.fileData)}
            
            <div className="message-footer">
              {isSent && <span className="read-receipt">{readReceipt}</span>}
              <span className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        );
      })}
      {typingIndicator && <div className="typing-indicator">Typing...</div>}
    </div>
  );
};

export default ChatWindow;
