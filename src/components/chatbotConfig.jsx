import { createChatBotMessage } from "react-chatbot-kit"; // Updated path
import React from "react";
import CoBotAvatar from "./CoBotAvatar";
import CustomUserAvatar from "../components/CustomUserAvatar";
import BotChatMessage from "../components/BotChatMessage";
import LiveChatLink from "./LiveChatLink";
import ActionProvider from "../components/ActionProvider";
import { useNavigate } from "react-router-dom";

const config = (props) => {
  const navigate = useNavigate();

  return {
    lang: "no",
    botName: "R2-D2",
    customStyles: {
      botMessageBox: {
        backgroundColor: "#04668a",
      },
      chatButton: {
        backgroundColor: "#0f5faf",
      },
    },
    initialMessages: [
      createChatBotMessage("Hi, I'm here to assist you with Volvo heavy machinery!"),
    ],
    state: {},
    customComponents: {
      botAvatar: (props) => <CoBotAvatar {...props} />,
      userAvatar: (props) => <CustomUserAvatar {...props} />,
      botChatMessage: BotChatMessage,
    },
    customMessages: {},
    widgets: [
      {
        widgetName: "liveChatLink",
        widgetFunc: (props) => <LiveChatLink {...props} />,
      },
    ],
    actionProvider: (createChatBotMessage, setStateFunc, createClientMessage) =>
      new ActionProvider(createChatBotMessage, setStateFunc, createClientMessage, navigate),
  };
};

export default config;
