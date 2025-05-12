import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Chatbot from "../react-chatbot-kit";
import '../styles/ChatPage.css'
import config from "../components/chatbotConfig";
import MessageParser from "../components/MessageParser";
import ActionProvider from "../components/ActionProvider";
import TypedReact from "../components/TypedReact";

export default function ChatPage() {
  const [showBot, toggleBot] = useState(false);

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
        onClick={() => {
          toggleBot((prev) => !prev);
          localStorage.setItem('hasSentFirstMessage', 'false');
        }}
      >
        <div>Bot</div>
        <svg viewBox="0 0 640 512" className="app-chatbot-button-icon">
          <path d="M192,408h64V360H192ZM576,192H544a95.99975,95.99975,0,0,0-96-96H344V24a24,24,0,0,0-48,0V96H192a95.99975,95.99975,0,0,0-96,96H64a47.99987,47.99987,0,0,0-48,48V368a47.99987,47.99987,0,0,0,48,48H96a95.99975,95.99975,0,0,0,96,96H448a95.99975,95.99975,0,0,0,96-96h32a47.99987,47.99987,0,0,0,48-48V240A47.99987,47.99987,0,0,0,576,192ZM96,368H64V240H96Zm400,48a48.14061,48.14061,0,0,1-48,48H192a48.14061,48.14061,0,0,1-48-48V192a47.99987,47.99987,0,0,1,48-48H448a47.99987,47.99987,0,0,1,48,48Zm80-48H544V240h32ZM240,208a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,240,208Zm160,0a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,400,208ZM384,408h64V360H384Zm-96,0h64V360H288Z"></path>
        </svg>
      </button>
    </div>
  );
}