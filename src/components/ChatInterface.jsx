//ChatInterface.jsx is a component that displays a chat interface with a message area, input area, and buttons for sending messages, viewing suggestions, starting a video call, and connecting to a technician. The component uses the useState hook to manage the messages, user input, and error state. It also includes the Suggestions, VideoCallButton, and TechnicianConnect components.
import React, { useState } from "react";
import Suggestions from "./Suggestions";
import VideoCallButton from "./VideoCallButton";
import TechnicianConnect from "./TechnicianConnect";
import "../styles/ChatInterface.css";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") {
      setError("Please enter a message.");
      return;
    }

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setError("");

    // Simulate a response from the assistant
    setTimeout(() => {
      const response = "I'm sorry, I couldn't fix that. Would you like to connect with a technician?";
      setMessages((prevMessages) => [...prevMessages, { text: response, sender: "assistant" }]);
    }, 1000);
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
        {error && <div className="error">{error}</div>}
      </div>
      <Suggestions />
      <VideoCallButton />
      <TechnicianConnect />
    </div>
  );
}