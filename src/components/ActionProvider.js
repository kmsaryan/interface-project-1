class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

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
        const message = this.createChatBotMessage(
          `We are going to connect you with ${data.name}. More contact info: ${data.email}`, 
          { withAvatar: true }
        );
        this.addMessageToState(message);
      } else {
        this.handleBotResponse("Sorry, no available technician was found at this time.");
      }
    } catch (error) {
      console.error("Error fetching technician:", error);
      this.handleBotResponse("Oops! Something went wrong while finding a technician.");
    }
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