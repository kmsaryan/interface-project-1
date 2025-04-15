import React from "react";
import { Helmet } from "react-helmet";
import Chatbot from "../react-chatbot-kit";
import '../styles/ChatPage.css';
import config from "../components/chatbotConfig";
import MessageParser from "../components/MessageParser";
import ActionProvider from "../components/ActionProvider";
import TypedReact from "../components/TypedReact";

export default function ChatPage() {
  return (
    <div className="ChatPage">
      <Helmet>
        <title>Volvo CE Chatbot</title>
        <meta name="description" content="Repair AI assistance" />
      </Helmet>

      <h1>Volvo CE Chatbot</h1>
      <h2>Start chatting with the Volvo CE Chatbot!</h2>

      <TypedReact />

      {showBot && (
        <div className="app-chatbot-container">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}

      <button
        className="app-chatbot-button"
        onClick={() => toggleBot((prev) => !prev)}
      >
        <div>Bot</div>
        <svg viewBox="0 0 640 512" className="app-chatbot-button-icon">
          {/* ...SVG content... */}
        </svg>
      </button>
    </div>
  );
}