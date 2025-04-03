// ChatInterface.jsx
import React, { useState, useEffect } from "react";
import "../styles/ChatInterface.css";

export default function ChatInterface({ messages, onSendMessage }) {
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState(null);

  // Log messages prop to verify if it's being received correctly
  useEffect(() => {
    console.log("Messages received in ChatInterface:", messages);
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "" && !attachment) {
      console.log("No message or attachment to send.");
      return;
    }

    console.log("Sending message:", { text: input, attachment });
    onSendMessage({ text: input, attachment });
    setInput("");
    setAttachment(null);
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
            {msg.attachment && (
              <img src={URL.createObjectURL(msg.attachment)} alt="Attachment" />
            )}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            console.log("Input changed:", e.target.value);
            setInput(e.target.value);
          }}
          placeholder="Type your message..."
        />
        <input
          type="file"
          onChange={(e) => {
            console.log("Attachment selected:", e.target.files[0]);
            setAttachment(e.target.files[0]);
          }}
          className="attachment-input"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}