import React from "react";
import Markdown from "react-markdown";

const BotChatMessage = ({ message }) => {
  return (
    <div className="react-chatbot-kit-chat-bot-message">
      <Markdown>{message}</Markdown>
    </div>
  );
};

export default BotChatMessage;