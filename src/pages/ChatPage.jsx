// File: src/pages/ChatPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VideoCallButton from "../components/VideoCallButton";
import "../styles/ChatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true); // Show suggestions initially
  const [isChatLayout, setIsChatLayout] = useState(false); // Switch to chat layout after the first message

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
    if (input.trim() === "") return;

    // Add the user's message to the chat
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Simulate a response from the assistant
    setTimeout(() => {
      const response = "I'm sorry, I couldn't fix that. Would you like to connect with a technician?";

      setMessages((prevMessages) => [
      ...prevMessages, 
      { text: response, sender: "assistant" },
      { 
        text: (
        <div>
          Options: 
          <button onClick={() => alert("Connecting to Live Chat...")}>Live Chat</button>
          <VideoCallButton />
        </div>
        ), 
        sender: "assistant", 
        isOptions: true 
      }
      ]);
    }, 1000);

    // Hide suggestions and switch to chat layout
    setShowSuggestions(false);
    setIsChatLayout(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Show suggestions based on user input
    if (value.length > 2) {
      setSuggestions([
        `Try restarting your ${value}`,
        `Check the ${value} manual`,
        `Contact support about ${value}`,
      ]);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false); // Hide suggestions after selecting one
    setIsChatLayout(true); // Switch to chat layout
  };

  return (
    <div className="chat-page">
      <Header />
      <h1>Chat with Volvo Assistant</h1>
      <div className={`chat-interface ${isChatLayout ? "chat-layout" : ""}`}>
        {messages.length === 1 && !isChatLayout && (
          <div className="initial-message">
            {messages[0].text}
          </div>
        )}
        {isChatLayout && (
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
        )}
        {showSuggestions && (
          <div className="suggestions">
            <h3>Suggestions:</h3>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Ensure the input box is always rendered */}
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}