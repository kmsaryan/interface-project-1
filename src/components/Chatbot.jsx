import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import CoBotAvatar from "./CoBotAvatar";
import CustomUserAvatar from "./CustomUserAvatar";
import "../styles/Chatbot.css";
import botIcon from "../assets/icons/bot1.png";
import sendIcon from "../assets/icons/paper-plane.svg";

const Chatbot = () => {
  const [showBot, setShowBot] = useState(false);

  const steps = [
    {
      id: "1",
      message: "Hi! How can I assist you today?",
      trigger: "2",
    },
    {
      id: "2",
      user: true,
      trigger: "3",
    },
    {
      id: "3",
      message: "Thank you for your input!",
      end: true,
    },
  ];

  const customStyle = {
    botMessageBox: {
      backgroundColor: "#04668a", // Bot message background
    },
    chatButton: {
      backgroundColor: "#0f5faf", // Chat button background
    },
    userMessageBox: {
      backgroundColor: "#fff", // User message background
      color: "#4a4a4a", // User message text color
    },
  };

  return (
    <div className={`chatbot-wrapper ${showBot ? "active" : ""}`}>
      {showBot && (
        <div className="chatbot-container">
          <ChatBot
            steps={steps}
            botAvatar={<CoBotAvatar />}
            userAvatar={<CustomUserAvatar />}
            customStyle={customStyle}
            footerStyle={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#f5f8fb",
            }}
            footerComponent={
              <div className="chatbot-footer">
                <input
                  type="text"
                  className="chatbot-input"
                  placeholder="Type your message..."
                />
                <button className="chatbot-send-button">
                  <img src={sendIcon} alt="Send" />
                </button>
              </div>
            }
          />
        </div>
      )}
      <button
        className="chatbot-toggle-button"
        onClick={() => setShowBot((prev) => !prev)}
      >
        <img src={botIcon} alt="Chatbot Icon" />
      </button>
    </div>
  );
};

export default Chatbot;
