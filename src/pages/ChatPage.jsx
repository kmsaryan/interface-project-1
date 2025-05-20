import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Jack from "../assets/icons/jack.png";
import JackBot from "../components/JackBot";
import "../styles/ChatPage.css";
import TypedReact from "../components/TypedReact";

export default function ChatPage() {
  const [chatOpen, setChatOpen] = useState(false);

  // Reset the flag only once when the page loads (optional)
  React.useEffect(() => {
    localStorage.setItem("hasSentFirstMessage", "false");
  }, []);

  return (
    <div className="ChatPage">
      <Helmet>
        <title>Volvo CE Chatbot</title>
        <meta name="description" content="Repair AI assistance" />
      </Helmet>

      <h1 className="jack-heading">
        <img src={Jack} alt="Jack" className="jack-avatar" />
        Meet Jack
      </h1>

      <div style={{ height: "20px" }}>
        <TypedReact />
      </div>

      <button
  onClick={() => setChatOpen(true)}
  style={{
    marginTop: "40px", // 👈 Add spacing here
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 100px",
    fontSize: "1.1rem",
    fontWeight: 600,
    lineHeight: 1.2,
    borderRadius: "12px",
    background: "linear-gradient(135deg, #20cfcf, #00b3b3)",
    color: "#ffffff",
    border: "none",
    boxShadow: "0 6px 12px rgba(0, 179, 179, 0.3)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 8px 16px rgba(0, 179, 179, 0.4)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 6px 12px rgba(0, 179, 179, 0.3)";
  }}
>
  <span role="img" aria-label="chat">💬</span>
  <span>Start Chat</span>
</button>

      {/* Render chatbot only after button click */}
      {chatOpen && (
        <div className="app-chatbot-container">
          <JackBot />
        </div>
      )}
    </div>
  );
}
