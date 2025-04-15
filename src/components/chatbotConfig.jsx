import { createChatBotMessage } from "react-chatbot-kit";
import React from "react";
import CoBotAvatar from "./CoBotAvatar";
import CustomUserAvatar from "./CustomUserAvatar";
import BotChatMessage from "./BotChatMessage";
import LiveChatLink from "./LiveChatLink";
import ActionProvider from "./ActionProvider";

// Config factory without using hooks directly
const createConfig = (navigate) => {
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

// A wrapper component that uses the hook and passes it to the config
const ConfigWithNavigate = (props) => {
  // Here we'll create the config without hooks, to be used directly
  return createConfig(null); // Passing null for navigate as we'll use the simplified implementation
};

export default ConfigWithNavigate;
