// ChatInterface.jsx
import React, { useState, useEffect } from "react";
import "../styles/ChatInterface.css";
import Suggestions from "./Suggestions"; // Import the Suggestions component
import VideoCallButton from "./VideoCallButton"; // Import the VideoCallButton component

export default function ChatInterface({
  messages,
  onSendMessage,
  suggestions,
  role,
  onJoinLiveChat,
  inLiveChat,
  showVideoCallButton, // New prop to control video call button visibility
}) {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [chatMessages, setChatMessages] = useState(messages || []); // Local state for chat messages

  useEffect(() => {
    console.log("Messages received in ChatInterface:", messages);
    setChatMessages(messages); // Sync messages with parent state
  }, [messages]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Filter suggestions based on input
    if (value.trim() !== "") {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setFilteredSuggestions([]); // Clear suggestions after selection
  };

  const handleSendMessage = () => {
    if (input.trim() === "" && !attachment) {
      console.log("No message or attachment to send.");
      return;
    }

    const newMessage = { sender: "You", text: input, attachment };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]); // Add the user's message to the chat
    onSendMessage(newMessage);

    setInput("");
    setAttachment(null);
    setFilteredSuggestions([]); // Clear suggestions after sending
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
            <p>{msg.text}</p>
            {msg.attachment && (
              <img src={URL.createObjectURL(msg.attachment)} alt="Attachment" />
            )}
          </div>
        ))}
        {!inLiveChat && role === "customer" && (
          <div className="dedicated-message-buttons">
            <button onClick={onJoinLiveChat}>Join Live Chat</button>
          </div>
        )}
        {inLiveChat && showVideoCallButton && (
          <div className="dedicated-message-buttons">
            <VideoCallButton />
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        {filteredSuggestions.length > 0 && (
          <Suggestions
            suggestions={filteredSuggestions}
            onSelectSuggestion={handleSuggestionClick}
          />
        )}
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