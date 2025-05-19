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
  localStorage.setItem('hasSentFirstMessage', 'false');

  return (
    <div className="ChatPage">
      <Helmet>
        <title>Volvo CE Chatbot</title>
        <meta name="description" content="Repair AI assistance" />
      </Helmet>

      <h1>Meet Jack</h1>

      <div style={{ height: "20px" }}>  {/* Adjust height to fit your text */}
        <TypedReact />
      </div>
        <div className="app-chatbot-container">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      
    </div>
  );
}