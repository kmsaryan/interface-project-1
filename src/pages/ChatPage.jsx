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

      {/* Button to open the chatbot */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: "8px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Open Chat
        </button>
      )}

      {/* Render chatbot only after button click */}
      {chatOpen && (
        <div className="app-chatbot-container">
          <JackBot />
        </div>
      )}
    </div>
  );
}
