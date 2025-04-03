// File: src/pages/ChatPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatInterface from "../components/ChatInterface";
import "../styles/ChatPage.css";
import socket from "../utils/socket";

export default function ChatPage() {
  const [inLiveChat, setInLiveChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [connectedTechnician, setConnectedTechnician] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    problem: "",
    machine: "",
  });
  const [showDetailsForm, setShowDetailsForm] = useState(true);

  useEffect(() => {
    socket.on("technicianConnected", ({ technicianId }) => {
      setConnectedTechnician(technicianId);
      setInLiveChat(true);
      console.log("Connected to technician:", technicianId);
    });

    socket.on("receiveMessage", ({ from, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Technician", text: message },
      ]);
    });

    return () => {
      socket.off("technicianConnected");
      socket.off("receiveMessage");
    };
  }, []);

  const handleJoinLiveChat = () => {
    socket.emit("joinLiveChatQueue", customerDetails);
    console.log("Customer joined live chat queue with details:", customerDetails);
    setShowDetailsForm(false); // Hide the form after joining the queue
  };

  const handleSendMessage = ({ text, attachment }) => {
    const newMessage = { sender: "You", text, attachment };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (inLiveChat && connectedTechnician) {
      socket.emit("sendMessage", { to: connectedTechnician, message: text });
    }
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="chat-page">
      <Header />
      <h1>Customer Chat</h1>
      {showDetailsForm ? (
        <div className="customer-details-form">
          <h2>Enter Your Details</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJoinLiveChat();
            }}
          >
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={customerDetails.name}
                onChange={handleDetailsChange}
                required
              />
            </div>
            <div>
              <label>Describe Your Problem:</label>
              <textarea
                name="problem"
                value={customerDetails.problem}
                onChange={handleDetailsChange}
                required
              />
            </div>
            <div>
              <label>Machine:</label>
              <input
                type="text"
                name="machine"
                value={customerDetails.machine}
                onChange={handleDetailsChange}
                required
              />
            </div>
            <button type="submit">Join Live Chat</button>
          </form>
        </div>
      ) : (
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          suggestions={["How can I help you?", "What is your issue?", "Can you provide more details?"]}
          role="customer"
          onJoinLiveChat={handleJoinLiveChat}
          inLiveChat={inLiveChat}
        />
      )}
      <Footer />
    </div>
  );
}