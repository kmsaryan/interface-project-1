import socket from "../utils/socket";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

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
    const message = this.createChatBotMessage("Hello! How can I assist you today? Please provide the model of the machine so I can assist you better", {withAvatar: true})
    this.setState((state) => ({
      ...state,
      awaitingMachineModel: true

    }));
    this.addMessageToState(message);
  };

  handleFindModel = async (message) => {
    const user = JSON.parse(localStorage.getItem("user"));    

    const model = message.trim();
  
    // Validate machine model input
    if (model.length < 3 || ["i don't know", "not sure", "no idea"].includes(model.toLowerCase())) {
      const msg = this.createChatBotMessage("Please provide the model of the machine so I can assist you better.");
      return this.addMessageToState(msg);
    }

    // Save the model temporarily
    this.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        user_id: user?.id,
        machineModel: model,
      },
      awaitingMachineModel: false
    }));
  
    try {
      const machine = await this.findMachine(model, user.id);

      if (machine) {
        const msg = this.createChatBotMessage(
          `I found a machine with the model "${machine.machine_model}". The serial number is "${machine.machine_number}". Is this correct?`
        );
        this.setState((state) => ({
          ...state,
          machine,
          awaitingSerialConfirmation: true
        }));
        return this.addMessageToState(msg);
      } else {
        // Ask to register a new machine
        const msg = this.createChatBotMessage(
          "I couldn't find a machine with that model. Would you like to register a new machine?"
        );
        this.setState((state) => ({
          ...state,
          awaitingMachineRegistrationConfirmation: true
        }));
        return this.addMessageToState(msg);
      }
    } catch (err) {
      console.error("Error finding machine:", err);
      const msg = this.createChatBotMessage(
        "Something went wrong while searching. Would you like to register a new machine?"
      );
      this.setState((state) => ({
        ...state,
        awaitingMachineRegistrationConfirmation: true
      }));
      return this.addMessageToState(msg);
    }
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
  
        this.setState((state) => ({
          ...state,
          awaitingTechConfirmation: true,
          formData: {
            ...state.formData,
            issue: state.formData.machineIssue,
            machine: state.formData.machineModel,
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
      user_id: user?.id,
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
    let issueId = localStorage.getItem("issue_id");
    console.log("Retrieved issue_id from localStorage:", issueId);  // Debugging log
  
    if (issueId !== "0" && issueId!=="undefined"){
    console.log(issueId);
    fetch("http://localhost:5000/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        issue_id: issueId,
        sender: "bot",
        message: message.message
      })
    }).catch((error) => {
      console.error("Failed to save message to DB:", error);
    });
  }
  

    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message]
    }));
  };
  
  

  findMachine = async (model, userId) => {
    console.log(model, userId);
  
    try {
      const response = await fetch("http://localhost:5000/api/machines/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          search_string: model,
        }),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Machine not found");
      }
    } catch (error) {
      console.error("Error finding machine:", error);
      return null;
    }
  };

  saveIssue = async (description, issueId, state) => {
    const { machine } = state;
  
    if (!machine || !machine.machine_id) {
      console.error("No machine selected to save the issue");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machine_id: machine.machine_id,
          description,
          matched_issue: issueId, 
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("issue_id", result.id);// Save it globally
        return result;
      } else {
        throw new Error("Failed to save issue");
      }
    } catch (err) {
      console.error("Error saving issue:", err);

    }
  };  
  

  registerMachine = async ({ user_id, model, serial_number }) => {
    try {
      const response = await fetch("http://localhost:5000/api/machines", {  // Replace with your actual backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          model,
          serial_number,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to register machine");
      }
      return await response.json();
  
    } catch (error) {
      console.error("Error registering machine:", error);
      const msg = this.createChatBotMessage("Something went wrong while registering the machine. Please try again.");
      this.addMessageToState(msg);
    }
  };
  
}

export default ActionProvider;