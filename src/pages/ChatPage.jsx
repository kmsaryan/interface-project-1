import React from "react";
import { Helmet } from "react-helmet";
import Chatbot from "../components/Chatbot"; // Import the new Chatbot component
import "../styles/ChatPage.css";

export default function ChatPage() {
  return (
    <div className="ChatPage">
      <Helmet>
        <title>Volvo CE Chatbot</title>
        <meta name="description" content="Repair AI assistance" />
      </Helmet>

      <h1>Volvo CE Chatbot</h1>
      <h2>Start chatting with the Volvo CE Chatbot!</h2>

      <Chatbot /> {/* Use the new Chatbot component */}
    </div>
  );
}