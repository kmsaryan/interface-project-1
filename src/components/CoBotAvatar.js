import React from "react";
import BotAvatar from "../assets/icons/bot1.png";

const CoBotAvatar = () => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar">
      <img
        alt="BotAvatar"
        src={BotAvatar}
        style={{ width: "50px", height: "50px", objectFit: "contain" }}
      />
    </div>
  );
};

export default CoBotAvatar;
