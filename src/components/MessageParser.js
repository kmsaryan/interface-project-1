import { findMainIssueByKeyword, findResponseWithKeywordAndParentId } from "../components/treeService"; // path as needed
import { v4 as uuidv4 } from 'uuid';
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

    const issueId = localStorage.getItem("issue_id");  // Retrieve it from localStorage

    if (issueId !== "0" && issueId!=="undefined"){
      fetch("http://localhost:5000/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          issue_id: issueId,
          sender: "user",
          message: message
        })
      }).catch((error) => {
        console.error("Failed to save message to DB:", error);
      });
    }

    if (message.includes("activate voice control")) {
      console.log("Voice control activated.");
      this.startRecognition();
      return this.actionProvider.handleBotResponse("Voice control activated!");
    }

    if (this.state.awaitingMachineModel) {
      return this.actionProvider.handleFindModel(message.trim());
    }

    if (this.state.awaitingSerialConfirmation) {

      const confirm = message.trim();

      if (
        confirm.length < 3 ||
        ["i don't know", "not sure", "no idea", "no"].includes(confirm.toLowerCase())
      ) {
        const msg = this.actionProvider.createChatBotMessage(
          "Please provide the serial number, so I can assist you better"
        );
        return this.actionProvider.addMessageToState(msg);
      }

      this.actionProvider.setState((state) => ({
        ...state,
        awaitingSerialConfirmation: false,
        awaitingIssueDescription: true
      }));

      const msg = this.actionProvider.createChatBotMessage("Thank you for confirming the serial number. Now, could you describe the issue you're experiencing?");
      return this.actionProvider.addMessageToState(msg);
  
    }

    if (this.state.awaitingMachineRegistrationConfirmation) {
      
      if (["yes", "yeah", "sure", "ok", "okay"].includes(message)) {
        this.actionProvider.setState((state) => ({
          ...state,
          awaitingMachineRegistrationConfirmation: false,
          awaitingSerialNumber: true
        }));
    
        const msg = this.actionProvider.createChatBotMessage("Great! Please provide the serial number of the machine.");
        return this.actionProvider.addMessageToState(msg);
      } else if (["no", "not now", "maybe later"].includes(message)) {
        this.actionProvider.setState((state) => ({
          ...state,
          awaitingMachineRegistrationConfirmation: false
        }));
    
        const msg = this.actionProvider.createChatBotMessage("Alright. Let me know if you need anything else!");
        return this.actionProvider.addMessageToState(msg);
      }
    }
    
    if (this.state.awaitingSerialNumber) {
      const serial = message.trim();
    
      if (serial.length < 3) {
        const msg = this.actionProvider.createChatBotMessage("That serial number seems too short. Please try again.");
        return this.actionProvider.addMessageToState(msg);
      }
    
      try {
        // Call your backend to register the new machine
        const newMachine = await this.actionProvider.registerMachine({
          model: this.state.formData.machineModel,
          serial_number: serial,
          user_id: this.state.formData.user_id
        });
    
        this.actionProvider.setState((state) => ({
          ...state,
          machine: newMachine,
          awaitingSerialNumber: false,
          awaitingIssueDescription: true
        }));
    
        const msg = this.actionProvider.createChatBotMessage("Machine registered successfully! Now, could you describe the issue you're experiencing?");
        return this.actionProvider.addMessageToState(msg);
      } catch (err) {
        console.error("Failed to register machine:", err);
        const msg = this.actionProvider.createChatBotMessage("Something went wrong while registering the machine. Please try again.");
        return this.actionProvider.addMessageToState(msg);
      }
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

        const issueId = this.actionProvider.saveIssue(issue,matchedIssue.id, this.state);
  
        const msg = this.actionProvider.createChatBotMessage(
          `Thanks! Based on your description, the issue might be: "${matchedIssue.question}". Would you like to troubleshoot this now?`
        );
    
        this.actionProvider.setState((state) => ({
          ...state,
          issue_id: issueId,
          matchedRoot: matchedIssue,
          awaitingTroubleshootConfirmation: true,
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
    if (this.state.awaitingTroubleshootConfirmation && this.state.matchedRoot) {
      const parentId = this.state.matchedRoot.id;

      try {
        const matchedResponse = await findResponseWithKeywordAndParentId(parentId, message);

        if (matchedResponse.solution) {
          const msg = this.actionProvider.createChatBotMessage(`Here's a possible solution: ${matchedResponse.solution}`);
          this.actionProvider.setState((state) => ({
            ...state,
            awaitingTroubleshootConfirmation: false
          }));
          return this.actionProvider.addMessageToState(msg);
        } else {
          const msg = this.actionProvider.createChatBotMessage(`${matchedResponse.question}`);
          this.actionProvider.setState((state) => ({
            ...state,
            matchedRoot: matchedResponse // update matchedRoot to continue down the tree
          }));
          return this.actionProvider.addMessageToState(msg);
        }

      } catch (err) {
        console.error("Failed to match follow-up response:", err);

        const msg = this.actionProvider.createChatBotMessage("I'm sorry, I couldn't understand that. Could you try rephrasing?");
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
