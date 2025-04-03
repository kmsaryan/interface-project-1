// File: src/pages/ChatPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";
import "../styles/ChatPage.css";

export default function ChatPage() {
  const [inQueue, setInQueue] = useState(false);

  useEffect(() => {
    console.log("ChatPage rendered. Current inQueue state:", inQueue);
  }, [inQueue]);

  const joinQueue = () => {
    console.log("Join Queue button clicked.");
    setInQueue(true);
  };

  return (
    <div className="chat-page">
      <Header />
      <h1>Customer Chat</h1>
      {!inQueue ? (
        <button onClick={joinQueue}>Join Live Chat Queue</button>
      ) : (
        <LiveChat
          customerDetails={{ name: "Customer", issue: "Need help" }}
          onError={(error) => console.error("LiveChat error:", error)}
          onData={(data) => console.log("LiveChat received data:", data)}
        />
      )}
      <Footer />
    </div>
  );
}