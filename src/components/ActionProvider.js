import socket from "../utils/socket";
import { useLocation, useNavigate } from "react-router-dom";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.navigate = useNavigate; // Store for later
  }

  setTechnicianSocketId = (id) => {
    this.technicianSocketId = id;
  
    this.setState((state) => ({
      ...state,
      technicianSocketId: id
    }));
  };
  

  handleGreeting = () => {
    const message = this.createChatBotMessage("Hello! How can I assist you today?", { withAvatar: true});
    this.addMessageToState(message);
  };

  handleOptions = (options) => {
    const message = this.createChatBotMessage(
      "How can I help you? Below are some possible options.",
      {
        widget: "overview",
        loading: true,
        withAvatar: true,
        terminateLoading: true,
        ...options
      }
    );

    this.addMessageToState(message);
  };

  handleBotResponse = (responseText) => {
    const message = this.createChatBotMessage(responseText, { withAvatar: true});
    this.addMessageToState(message);
  };


  handleFindTech = async (dayOfWeek, timeSlot) => {
    try {
      const response = await fetch(
        `http://localhost:5000/schedule/first-available?day_of_week=${dayOfWeek}&time_slot=${timeSlot}`
      );
      const data = await response.json();
  
      if (response.ok) {
        this.setTechnicianSocketId(data.socket_id);
  
        const message = this.createChatBotMessage(
          `${data.name} is available! Would you like to connect now?`,
          { withAvatar: true }
        );
        this.addMessageToState(message);
        
        // ✅ Set confirmation flag and form data
        this.setState((state) => ({
          ...state,
          awaitingTechConfirmation: true,
          formData: {
            issue: "FUMAÇA",    // or from user
            machine: "LX500",
            priority: "Medium"
          }
        }));
        
      } else {
        const errorMessage = this.createChatBotMessage(
          "No technician is available at the moment. Please try again later."
        );
        this.addMessageToState(errorMessage);
      }
    } catch (error) {
      console.error("Error finding technician:", error);
      const errorMessage = this.createChatBotMessage(
        "An error occurred while trying to find a technician."
      );
      this.addMessageToState(errorMessage);
    }
  };
  
  handleConnectToTech = (formData) => {
    const user = JSON.parse(localStorage.getItem("user"));    
  
    socket.emit("joinLiveChatQueue", {
      name: user?.name || "Anonymous",
      issue: formData.issue,
      machine: formData.machine,
      priority: formData.priority || "Medium",
    });
  
    // You could also emit a message to the technician here if you want
    localStorage.setItem("livechatFormData", JSON.stringify({
      name: user?.name,
      issue: formData.issue,
      machine: formData.machine,
      priority: formData.priority,
      
    }));

    const message = this.createChatBotMessage(
      "You're now connected!",
      {
        withAvatar: true,
        widget: "liveChatLink"
      }
    );
    this.addMessageToState(message);
  
  };

  // Handle Thank You responses
  handleThankYou = () => {
    const message = this.createChatBotMessage("You're welcome! How else can I assist you?", { withAvatar: true});
    this.addMessageToState(message);
  };

  handleImageResponse = (imageName) => {
    const imageUrl = `/assets/${imageName}`; // Adjust this to match where your images are stored
    const message = this.createChatBotMessage(`http://localhost:3000${imageName}`); // Construct the full URL
    this.addMessageToState(message); // Add the URL to the chat
  };

  addMessageToState = (message) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message]
    }));
  };
}

export default ActionProvider;