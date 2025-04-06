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
  
    if (["hello", "hi", "hey", "hello!"].includes(message)) {
      return this.actionProvider.handleGreeting();
    }
  
    if (message.includes("help") || message.includes("options")) {
      return this.actionProvider.handleOptions({ withAvatar: true });
    }
  
    if (["thanks", "thank you", "thankyou", "thank"].includes(message) || message.includes("thank")) {
      return this.actionProvider.handleThankYou();
    }
  
    if (["image", "picture"].includes(message)) {
      const imageUrl = loaderAxleImage;
      return this.actionProvider.handleImageResponse(imageUrl);
    }

    if (message.includes("technician") || message.includes("need help") || message.includes("mechanic")) {
      const now = new Date();
      

      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayOfWeek = daysOfWeek[now.getDay()];
      

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const roundedMinutes = minutes >= 30 ? "30" : "00";
      const timeSlot = `${hours}:${roundedMinutes}`;
  
      console.log(`Finding technician for ${dayOfWeek}, ${timeSlot}`);
      
      return this.actionProvider.handleFindTech(dayOfWeek, timeSlot);
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
