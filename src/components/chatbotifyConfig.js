import { createChatbotMessage } from "react-chatbotify";

export const chatbotConfig = {
  theme: {
    primaryColor: "#0b5ed7",
    secondaryColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  chatFlow: [
    {
      id: "greeting",
      message: createChatbotMessage("Hi! I'm Jack, how can I help you?"),
      trigger: "userInput",
    },
    {
      id: "userInput",
      user: true,
      trigger: "responseHandler",
    },
    {
      id: "responseHandler",
      message: (previousValue) =>
        createChatbotMessage(`You said: "${previousValue}"`),
      trigger: "userInput",
    },
  ],
};