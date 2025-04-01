import React, { useState, useEffect } from "react";
import Suggestions from "./Suggestions";
import "../styles/ChatInterface.css";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null); // State for file attachments
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true); // Show suggestions initially

  useEffect(() => {
    // Display the first message with suggestions when the component loads
    setMessages([{ text: "Welcome! How can I assist you today?", sender: "assistant" }]);
    setSuggestions([
      "Try restarting your device",
      "Check the user manual",
      "Contact support",
    ]);
  }, []);

  const handleSendMessage = () => {
    if (input.trim() === "" && !file) {
      setError("Please enter a message or attach a file.");
      return;
    }

    // Add the user's message to the chat
    setMessages([...messages, { text: input, file, sender: "user" }]);
    setInput("");
    setFile(null); // Clear the file input
    setError("");

    // Simulate a response from the assistant
    setTimeout(() => {
      const response = "I'm sorry, I couldn't fix that. Would you like to connect with a technician?";
      setMessages((prevMessages) => [...prevMessages, { text: response, sender: "assistant" }]);
    }, 1000);

    // Hide suggestions after the first message
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false); // Hide suggestions after selecting one
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
            {msg.file && (
              <div className="attachment">
                <img src={URL.createObjectURL(msg.file)} alt="Attachment" />
              </div>
            )}
          </div>
        ))}
      </div>
      {showSuggestions && (
        <Suggestions suggestions={suggestions} onSelectSuggestion={handleSelectSuggestion} />
      )}
      {!showSuggestions && (
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <label className="attachment-icon">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              📎
            </label>
          </div>
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </div>
  );
}