import { createChatBotMessage } from "react-chatbot-kit"; // Updated path
import React from "react";
import CoBotAvatar from "./CoBotAvatar";
import CustomUserAvatar from "../components/CustomUserAvatar";
import BotChatMessage from "../components/BotChatMessage";
import LiveChatLink from "./LiveChatLink";
import ActionProvider from "./ActionProvider"; // Ensure this is imported correctly
import MessageParser from "./MessageParser"; // Ensure this is imported correctly

const config = {
  lang: "no", // Set language to Norwegian
  botName: "VolvoBot", // Set bot name
  customStyles: {
    botMessageBox: {
      backgroundColor: "#04668a", // Bot's message box color
    },
    chatButton: {
      backgroundColor: "#0f5faf", // Chat button color
    },
  },
  initialMessages: [
    createChatBotMessage("Hi! How can I assist you today?"),
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
    {
      widgetName: "liveChatLink",
      widgetFunc: (props) => <LiveChatLink {...props} />,
    }
  ],
  actionProvider: (createChatBotMessage, setStateFunc, createClientMessage) =>
    new ActionProvider(createChatBotMessage, setStateFunc, createClientMessage), // Ensure proper instantiation
  messageParser: (actionProvider, state) => new MessageParser(actionProvider, state), // Instantiate with `new`
};

export default config;
