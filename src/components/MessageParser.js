import axios from "axios";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (e) => {
      if (e.results[0].isFinal) {
        const transcript = e.results[0][0].transcript;
        this.recognition.abort();
        this.parse_speech(transcript);
      }
    };
  }

  startRecognition() {
    this.recognition.start();
  }

  stopRecognition() {
    this.recognition.abort();
  }

  parse_speech(message) {
    console.log('Speech message:', message);
    this.parse(message);
    setTimeout(() => {
      this.recognition.start();
    }, 2000);
  }

  async parse(message) {
    message = message.toLowerCase().trim();
    console.log("User message:", message);

    if (message.includes("activate voice control")) {
      console.log("Voice control activated.");
      this.startRecognition();
      return this.actionProvider.handleBotResponse("Voice control activated!");
    }

    if (["hello", "hi", "hey", "Hello!"].includes(message)) {
      return this.actionProvider.handleGreeting();
    }

    if (message.includes("help") || message.includes("options")) {
      return this.actionProvider.handleOptions({ withAvatar: true });
    }

    if (["thanks", "thank you", "thankyou", "thank"].includes(message) || message.includes("thank")) {
      return this.actionProvider.handleThankYou();
    }

    if (["image", "picture"].includes(message)) {
      const imageUrl = loaderAxleImage; // Replace with your image URL
      return this.actionProvider.handleImageResponse(imageUrl);
    }

    try {
      const response = await axios.post(API_URL, { question: message });

      if (response.data.answer) {
        this.actionProvider.handleBotResponse(response.data.answer);
      } else {
        this.actionProvider.handleBotResponse("Sorry, I didn't understand that.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      this.actionProvider.handleBotResponse("I'm having trouble reaching the server. Try again later.");
    }
  }
}

export default MessageParser;
