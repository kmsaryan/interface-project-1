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