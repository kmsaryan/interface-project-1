import { createChatBotMessage } from "../react-chatbot-kit";
import React from "react";
import CoBotAvatar from "../components/CoBotAvatar";
import CustomUserAvatar from "../components/CustomUserAvatar";
import BotChatMessage from "../components/BotChatMessage";

const config = {
  lang: "no", // Set language to Norwegian
  botName: "R2-D2", // Set bot name
  customStyles: {
    botMessageBox: {
      backgroundColor: "#04668a", // Bot's message box color
    },
    chatButton: {
      backgroundColor: "#0f5faf", // Chat button color
    },
  },
  initialMessages: [
    createChatBotMessage(
      `Hi, I'm here to provide you troubleshoot assistance with Volvo heavy machinery!`
    ),
    createChatBotMessage(
      "Here's a quick overview of what I can help you with. You can also type in.",
      {
        withAvatar: true,
        delay: 400,
        widget: "overview", // First widget to show up is overview
      }
    ),
  ],
  state: {},
  customComponents: {
    botAvatar: (props) => <CoBotAvatar {...props} />, // Custom bot avatar
    userAvatar: (props) => <CustomUserAvatar {...props} />, // Custom user avatar
    botChatMessage: BotChatMessage, // Custom bot message rendering
  },
  customMessages: {
  },
  widgets: [

  ],
};

export default config;
