import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.navigate = useNavigate;
    this._hasSentFirstMessage = false; // Track if first message was sent
  }

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
    const message = this.createChatBotMessage(responseText, { withAvatar: true });
    this.addMessageToState(message);
  };

  handleImageResponse = (imageName) => {
    const imageUrl = `/assets/${imageName}`;
    const message = this.createChatBotMessage(`http://localhost:3000${imageName}`);
    this.addMessageToState(message);
  };

  handleUserMessage(message) {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.id)


  const storedResetFlag = localStorage.getItem('hasSentFirstMessage') === 'true';
  const resetFlag = !storedResetFlag; 

    // Build payload
    const payload = {
      user_id: user.id,
      message: message,
      reset: resetFlag
    };
    console.log("Sending to backend:", {
      user_id: user.id,
      message: message,
      reset: resetFlag,
    });
    

    // Send POST request
    fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data && data.response) {
        this.handleBotResponse(data.response);
      } else {
        this.handleBotResponse("Desculpe, algo deu errado.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      this.handleBotResponse("Erro na conexão com o servidor.");
    });
    localStorage.setItem('hasSentFirstMessage', 'true');
    }

  addMessageToState = (message) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message]
    }));

  };
}

export default ActionProvider;