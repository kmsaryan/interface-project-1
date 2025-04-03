// File: src/pages/ChatPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatInterface from "../components/ChatInterface";
import TechnicianSchedule from "../components/TechnicianSchedule"; // Import TechnicianSchedule
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
  const [showVideoCallButton, setShowVideoCallButton] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false); // State to toggle schedule visibility
  const [technicianSchedule, setTechnicianSchedule] = useState([]); // State to store the schedule

  useEffect(() => {
    // Predefined troubleshooting tips
    const troubleshootingTips = [
      { sender: "Assistant", text: "Welcome! How can I assist you today?" },
      { sender: "Assistant", text: "Here are some basic troubleshooting tips:" },
      { sender: "Assistant", text: "1. Restart your machine." },
      { sender: "Assistant", text: "2. Check all cable connections." },
      { sender: "Assistant", text: "3. Ensure the machine is powered on." },
    ];
    setMessages(troubleshootingTips);

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

      // Check if the technician's message contains a request for a video call
      if (message.toLowerCase().includes("would you like to video call")) {
        setShowVideoCallButton(true);
      }
    });

    // Fetch technician schedule from the server
    socket.on("updateTechnicianSchedule", (schedule) => {
      console.log("Received technician schedule:", schedule);
      setTechnicianSchedule(schedule);
    });

    return () => {
      socket.off("technicianConnected");
      socket.off("receiveMessage");
      socket.off("updateTechnicianSchedule");
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
        <>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            suggestions={["How can I help you?", "What is your issue?", "Can you provide more details?"]}
            role="customer"
            onJoinLiveChat={handleJoinLiveChat}
            inLiveChat={inLiveChat}
            showVideoCallButton={showVideoCallButton}
          />
          <button
            className="view-schedule-button"
            onClick={() => setShowSchedule(!showSchedule)}
          >
            {showSchedule ? "Hide Technician Schedule" : "View Technician Schedule"}
          </button>
          {showSchedule && (
            <div className="schedule-display">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {technicianSchedule.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <Footer />
    </div>
  );
}