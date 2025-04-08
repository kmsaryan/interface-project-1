import { findMainIssueByKeyword } from "../components/treeService"; // adjust the path if needed

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

    if (this.state.awaitingMachineModel) {
      const model = message.trim();
    
      // Simple validation: make sure user didn't say something too short or irrelevant
      if (model.length < 3 || ["i don't know", "not sure", "no idea"].includes(model.toLowerCase())) {
        const msg = this.actionProvider.createChatBotMessage("Please provide the model of the machine so I can assist you better.");
        return this.actionProvider.addMessageToState(msg);
      }
    
      // Save the model and move to next step
      this.actionProvider.setState((state) => ({
        ...state,
        formData: {
          ...state.formData,
          machineModel: model
        },
        awaitingMachineModel: false,
        awaitingIssueDescription: true
      }));
    
      const msg = this.actionProvider.createChatBotMessage("Thanks! Now, could you describe the issue you're experiencing?");
      return this.actionProvider.addMessageToState(msg);
    }

    if (this.state.awaitingIssueDescription) {
      const issue = message.trim();
    
      if (
        issue.length < 3 ||
        ["i don't know", "not sure", "no idea"].includes(issue.toLowerCase())
      ) {
        const msg = this.actionProvider.createChatBotMessage(
          "Please provide the issue, so I can assist you better"
        );
        return this.actionProvider.addMessageToState(msg);
      }
    
      this.actionProvider.setState((state) => ({
        ...state,
        formData: {
          ...state.formData,
          machineIssue: issue,
        },
        awaitingIssueDescription: false,
      }));
    
      try {
        const matchedIssue = await findMainIssueByKeyword(issue);
    
        const msg = this.actionProvider.createChatBotMessage(
          `Thanks! Based on your description, the issue might be: "${matchedIssue.question}". Would you like to troubleshoot this now?`
        );
    
        this.actionProvider.setState((state) => ({
          ...state,
          matchedRoot: matchedIssue,
          awaitingTechConfirmation: true,
        }));
    
        return this.actionProvider.addMessageToState(msg);
      } catch (err) {
        console.error("Keyword match failed:", err);
    
        const msg = this.actionProvider.createChatBotMessage(
          "Thanks! I couldn't find a specific match for that issue. Would you like to talk to a technician instead?"
        );
    
        this.actionProvider.setState((state) => ({
          ...state,
          awaitingTechConfirmation: true,
        }));
    
        return this.actionProvider.addMessageToState(msg);
      }
    }
    
    
    if (this.state.awaitingTechConfirmation) {
      if (["yes", "yeah", "sure", "ok", "okay", "please do", "connect me"].includes(message)) {
        // Clear the flag before proceeding
        this.actionProvider.setState((state) => ({
          ...state,
          awaitingTechConfirmation: false
        }));

        // You must pass navigate here somehow (see next note)
        return this.actionProvider.handleConnectToTech(this.state.formData);
      } else if (["no", "not now", "maybe later"].includes(message)) {
        this.actionProvider.setState((state) => ({
          ...state,
          awaitingTechConfirmation: false
        }));

        const msg = this.actionProvider.createChatBotMessage("Alright, let me know if you need anything else!");
        return this.actionProvider.addMessageToState(msg);
      }
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

  }
}

export default MessageParser;
