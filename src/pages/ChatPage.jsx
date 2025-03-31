// File: src/pages/ChatPage.jsx
// ChatPage.jsx
import React, { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import VideoCallButton from "../components/VideoCallButton";
import "../styles/ChatPage.css";
import "../styles/Header.css";
import "../styles/Footer.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/ChatInterface.jsx";
import "../components/VideoCallButton.jsx";
import "../components/Footer.jsx";
import "../components/Header.jsx";

export default function ChatPage() {
  const [issueResolved, setIssueResolved] = useState(false);

  const handleResolveIssue = () => {
    setIssueResolved(true);
  };

  return (
    <div className="chat-page">
      <Header />
      <h1>Chat with Volvo Assistant</h1>
      <ChatInterface />
      {!issueResolved && (
        <button onClick={handleResolveIssue}>Mark Issue as Resolved</button>
      )}
      {issueResolved && (
        <div className="technician-options">
          <h2>Need Further Assistance?</h2>
          <VideoCallButton />
          <button className="live-chat-button">Live Chat (Coming Soon)</button>
        </div>
      )}
      <Footer />
    </div>
  );
}