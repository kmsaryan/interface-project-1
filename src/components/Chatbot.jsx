import React, { useState, useEffect, useRef } from "react";
import ChatBot from "react-simple-chatbot";
import "../styles/Chatbot.css";
import LiveChatLink from "./LiveChatLink";
import botIcon from "../assets/icons/bot1.png";
import userIcon from "../assets/icons/user-alt.svg";

const Chatbot = () => {
  const [showBot, setShowBot] = useState(false);
  const botRef = useRef(null);

  // Prevent re-rendering issues causing duplicate messages
  useEffect(() => {
    if (showBot && botRef.current) {
      // Reset chat when showing again to prevent duplicates
      botRef.current.setState({ renderedSteps: [], steps: steps });
    }
  }, [showBot]);

  // Function to store form data for LiveChat
  const storeLiveChatData = (machineType, issue) => {
    // Get user info if available
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    
    const formData = {
      role: "customer",
      name: user?.name || "Guest User",
      machine: machineType || "Not specified",
      issue: issue || "Needs assistance",
      priority: "Medium"
    };
    
    // Store the form data for the LiveChatLink component to use
    localStorage.setItem("livechatFormData", JSON.stringify(formData));
  };

  const steps = [
    {
      id: "greeting",
      message: "Hi, I'm here to assist you with Volvo heavy machinery!",
      trigger: "askName",
    },
    {
      id: "askName",
      message: "What's your name?",
      trigger: "waitForName",
    },
    {
      id: "waitForName",
      user: true,
      trigger: "greetWithName",
    },
    {
      id: "greetWithName",
      message: "Hello {previousValue}, how can I help you today?",
      trigger: "options",
    },
    {
      id: "options",
      message: "Please select what you need help with:",
      trigger: "optionSelection",
    },
    {
      id: "optionSelection",
      options: [
        { value: "machinery", label: "Machinery Issues", trigger: "askMachineType" },
        { value: "schedule", label: "Schedule Service", trigger: "scheduleService" },
        { value: "technician", label: "Speak to a Technician", trigger: "askMachineInfo" },
      ],
    },
    {
      id: "askMachineType",
      message: "What type of machine are you working with?",
      trigger: "machineTypeInput",
    },
    {
      id: "machineTypeInput",
      user: true,
      trigger: "machineIssue",
    },
    {
      id: "machineIssue",
      message: "What issue are you experiencing with your {previousValue}?",
      trigger: "issueInput",
    },
    {
      id: "issueInput",
      user: true,
      trigger: "suggestHelp",
    },
    {
      id: "suggestHelp",
      message: "Based on your description, this might be a common issue. Would you like to troubleshoot or speak with a technician?",
      trigger: "helpOptions",
    },
    {
      id: "helpOptions",
      options: [
        { value: "troubleshoot", label: "Troubleshoot", trigger: "troubleshootSteps" },
        { value: "technician", label: "Speak to a Technician", trigger: "prepareLiveChat" },
      ],
    },
    {
      id: "troubleshootSteps",
      message: "Here are some steps you can try:\n1. Check for warning lights\n2. Verify fluid levels\n3. Inspect for visible damage\n\nDid this solve your issue?",
      trigger: "troubleshootResult",
    },
    {
      id: "troubleshootResult",
      options: [
        { value: "yes", label: "Yes, it's fixed", trigger: "thankYou" },
        { value: "no", label: "No, still having issues", trigger: "prepareLiveChat" },
      ],
    },
    {
      id: "scheduleService",
      message: "I can help you schedule a service appointment. When would you like to have your machine serviced?",
      trigger: "serviceInput",
    },
    {
      id: "serviceInput",
      user: true,
      trigger: "serviceConfirmation",
    },
    {
      id: "serviceConfirmation",
      message: "Thanks! We'll need to connect you with a service advisor to confirm your appointment.",
      trigger: "askMachineInfo",
    },
    {
      id: "askMachineInfo",
      message: "Please tell me what type of machine you have, so we can connect you with the right technician.",
      trigger: "getMachineType",
    },
    {
      id: "getMachineType",
      user: true,
      trigger: "askIssueInfo",
    },
    {
      id: "askIssueInfo",
      message: "Could you briefly describe the issue or what you need help with?",
      trigger: "getIssueInfo",
    },
    {
      id: "getIssueInfo",
      user: true,
      trigger: "prepareLiveChat",
    },
    {
      id: "prepareLiveChat",
      message: "I'm connecting you with one of our technicians who can help you further.",
      trigger: "storeLiveChatData",
    },
    {
      id: "storeLiveChatData",
      component: <div className="hidden-step" />,
      trigger: "showLiveChatLink",
      asMessage: false,
      end: false,
    },
    {
      id: "showLiveChatLink",
      component: <LiveChatLink />,
      asMessage: true,
      end: true,
    },
    {
      id: "thankYou",
      message: "Glad I could help! Is there anything else you need assistance with?",
      trigger: "finalOptions",
    },
    {
      id: "finalOptions",
      options: [
        { value: "yes", label: "Yes", trigger: "options" },
        { value: "no", label: "No, thank you", trigger: "goodbye" },
      ],
    },
    {
      id: "goodbye",
      message: "Thank you for using Volvo CE Assistant. Have a great day!",
      end: true,
    },
  ];

  // Update steps with function to store data before showing LiveChatLink
  const processedSteps = steps.map(step => {
    if (step.id === "storeLiveChatData") {
      return {
        ...step,
        trigger: "showLiveChatLink",
        component: (
          <div style={{ display: "none" }}>
            {({ previousStep, steps }) => {
              // Find machine type and issue info from previous steps
              const machineSteps = steps.filter(s => s.id === "getMachineType" || s.id === "machineTypeInput");
              const issueSteps = steps.filter(s => s.id === "getIssueInfo" || s.id === "issueInput");
              
              const machineType = machineSteps.length > 0 && machineSteps[0].value ? machineSteps[0].value : "";
              const issue = issueSteps.length > 0 && issueSteps[0].value ? issueSteps[0].value : "";
              
              // Store the data
              storeLiveChatData(machineType, issue);
              return null;
            }}
          </div>
        )
      };
    }
    return step;
  });

  const customStyle = {
    background: 'var(--background)',
    headerBgColor: 'var(--button-primary)',
    headerFontColor: 'var(--background)',
    headerFontSize: '16px',
    botBubbleColor: 'var(--button-primary)',
    botFontColor: 'var(--background)',
    userBubbleColor: 'var(--highlight)',
    userFontColor: 'var(--background)',
  };

  return (
    <div className={`chatbot-wrapper ${showBot ? "active" : ""}`}>
      {showBot && (
        <div className="chatbot-container">
          <ChatBot
            ref={botRef}
            steps={processedSteps}
            hideHeader={false}
            placeholder="Type your message..."
            botAvatar={botIcon}
            userAvatar={userIcon}
            customStyle={customStyle}
            headerTitle="Volvo CE Assistant"
            width="350px"
            bubbleOptionStyle={{
              background: 'var(--highlight)',
              color: 'var(--background)'
            }}
            bubbleStyle={{
              fontSize: '14px',
              maxWidth: '80%'
            }}
            inputStyle={{
              borderRadius: '20px',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid var(--border-subtle)'
            }}
            submitButtonStyle={{
              backgroundColor: 'var(--highlight)',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </div>
      )}
      <button
        className="chatbot-toggle-button"
        onClick={() => setShowBot((prev) => !prev)}
        aria-label="Toggle chat"
      >
        <img src={botIcon} alt="Chatbot" />
      </button>
    </div>
  );
};

export default Chatbot;
