import React, { useState, useEffect } from "react";
import ChatBot from "../react-simple-chatbot/lib/ChatBot";
import BotAvatar from "./CoBotAvatar";
import UserAvatar from "./CustomUserAvatar";
import "../styles/SimpleChatbot.css";

// Fallback ThemeProvider implementation
const FallbackThemeProvider = ({ children }) => {
  return <div className="theme-provider">{children}</div>;
};

// Try to import ThemeProvider from styled-components, use fallback if it fails
let ThemeProvider;
try {
  const styledComponents = require("styled-components");
  ThemeProvider = styledComponents.ThemeProvider;
} catch (error) {
  console.warn("styled-components not found, using fallback ThemeProvider");
  ThemeProvider = FallbackThemeProvider;
}

const SimpleChatbot = ({ handleEnd }) => {
  const [opened, setOpened] = useState(false);

  // Theme customization for Volvo branding
  const theme = {
    background: "#f5f8fb",
    fontFamily: "Novum-Light, Arial, sans-serif",
    headerBgColor: "#04668a",
    headerFontColor: "#fff",
    headerFontSize: "16px",
    botBubbleColor: "#04668a",
    botFontColor: "#fff",
    userBubbleColor: "#0f5faf",
    userFontColor: "#fff",
  };

  const toggleFloating = ({ opened }) => {
    setOpened(opened);
  };

  // Define the steps for the conversation flow
  const steps = [
    {
      id: "welcome",
      message: "Hi, I'm here to assist you with Volvo heavy machinery!",
      trigger: "askName",
    },
    {
      id: "askName",
      message: "What's your name?",
      trigger: "waitingName",
    },
    {
      id: "waitingName",
      user: true,
      trigger: "greet",
    },
    {
      id: "greet",
      message: ({ previousValue }) => `Hello ${previousValue}! How can I help you today?`,
      trigger: "mainOptions",
    },
    {
      id: "mainOptions",
      message: "Please select what you need help with:",
      trigger: "mainSelection",
    },
    {
      id: "mainSelection",
      options: [
        { value: "troubleshooting", label: "Troubleshooting", trigger: "troubleshootingStart" },
        { value: "maintenance", label: "Maintenance", trigger: "maintenanceStart" },
        { value: "technician", label: "Connect with Technician", trigger: "technicianStart" },
        { value: "other", label: "Other Question", trigger: "otherStart" },
      ],
    },
    {
      id: "troubleshootingStart",
      message: "What issue are you experiencing with your machine?",
      trigger: "waitingIssue",
    },
    {
      id: "waitingIssue",
      user: true,
      trigger: "askMachineModel",
    },
    {
      id: "askMachineModel",
      message: "What is the model of your Volvo machine?",
      trigger: "waitingModel",
    },
    {
      id: "waitingModel",
      user: true,
      trigger: "troubleshootingResponse",
    },
    {
      id: "troubleshootingResponse",
      message: "Based on your description, this could be related to the hydraulic system. Would you like me to connect you with a technician for further assistance?",
      trigger: "troubleshootingOptions",
    },
    {
      id: "troubleshootingOptions",
      options: [
        { value: "yes", label: "Yes, connect me", trigger: "technicianStart" },
        { value: "no", label: "No, provide more info", trigger: "troubleshootingMoreInfo" },
      ],
    },
    {
      id: "troubleshootingMoreInfo",
      message: "I recommend checking the hydraulic fluid levels and inspecting for leaks. If the issue persists, it may require professional diagnosis.",
      trigger: "askMoreHelp",
    },
    {
      id: "maintenanceStart",
      message: "What specific maintenance information are you looking for?",
      trigger: "waitingMaintenanceQuestion",
    },
    {
      id: "waitingMaintenanceQuestion",
      user: true,
      trigger: "maintenanceResponse",
    },
    {
      id: "maintenanceResponse",
      message: "Regular maintenance is crucial for optimal machine performance. I recommend following the maintenance schedule in your operator's manual. Can I provide specific information about a maintenance task?",
      trigger: "askMoreHelp",
    },
    {
      id: "technicianStart",
      message: "I'll help connect you with a technician. Please provide a brief description of your issue for the technician.",
      trigger: "waitingTechnicianIssue",
    },
    {
      id: "waitingTechnicianIssue",
      user: true,
      trigger: "connectingTechnician",
    },
    {
      id: "connectingTechnician",
      message: "Thank you! I'm preparing to connect you with a technician. Click the button below to start the live chat.",
      trigger: "technicianConnect",
    },
    {
      id: "technicianConnect",
      component: (
        <div className="connect-technician-button">
          <a href="/livechat-form" className="tech-link">Connect with Technician</a>
        </div>
      ),
      trigger: "askMoreHelp",
    },
    {
      id: "otherStart",
      message: "Please type your question, and I'll do my best to assist you.",
      trigger: "waitingOtherQuestion",
    },
    {
      id: "waitingOtherQuestion",
      user: true,
      trigger: "otherResponse",
    },
    {
      id: "otherResponse",
      message: "Thank you for your question. I'll try to provide the best information I can. For more detailed information, you might want to consult the operator's manual or connect with a specialist.",
      trigger: "askMoreHelp",
    },
    {
      id: "askMoreHelp",
      message: "Is there anything else I can help you with?",
      trigger: "moreHelpOptions",
    },
    {
      id: "moreHelpOptions",
      options: [
        { value: "yes", label: "Yes", trigger: "mainOptions" },
        { value: "no", label: "No, thank you", trigger: "goodbye" },
      ],
    },
    {
      id: "goodbye",
      message: "Thank you for using the Volvo CE Chatbot. Have a great day!",
      end: true,
    },
  ];

  // Custom component for the bot avatar
  const BotAvatarComponent = () => <BotAvatar />;
  
  // Custom component for the user avatar
  const UserAvatarComponent = () => <UserAvatar />;

  // Create the ChatBot component
  const chatbot = (
    <ChatBot
      steps={steps}
      headerTitle="Volvo CE Assistant"
      botAvatar="/assets/icons/bot1.png"
      userAvatar="/assets/icons/mechanic.png"
      floating={true}
      floatingStyle={{
        right: '40px',
        bottom: '40px',
        transformOrigin: 'bottom right'
      }}
      floatingIcon={
        <img 
          src="/assets/icons/bot1.png" 
          alt="Chat Bot" 
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      }
      opened={opened}
      toggleFloating={toggleFloating}
      handleEnd={handleEnd}
      botDelay={800}
      userDelay={800}
      width="350px"
      height="500px"
      placeholder="Type your message..."
    />
  );

  return (
    <div className="simple-chatbot-container">
      <ThemeProvider theme={theme}>
        {chatbot}
      </ThemeProvider>
    </div>
  );
};

export default SimpleChatbot;
