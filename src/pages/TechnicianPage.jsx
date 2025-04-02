//TechnicianPage.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import TechnicianSchedule from "../components/TechnicianSchedule";
import "../styles/TechnicianPage.css";
import "../styles/Header.css";
import "../components/VideoCallButton";
import Header from "../components/Header";
import Footer from "../components/Footer";
import socket from '../utils/socket'; // Assume socket is initialized elsewhere

export default function TechnicianPage() {
  const [schedule, setSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [liveChatQueue, setLiveChatQueue] = useState([]);
  const [videoCallQueue, setVideoCallQueue] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [techniciansOnline, setTechniciansOnline] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Join as a technician
    socket.emit("technicianJoin", { name: "Technician" });

    // Listen for queue updates
    socket.on("updateLiveChatQueue", (queue) => {
      setLiveChatQueue(queue);
    });

    // Listen for technician status updates
    socket.on("updateTechnicianStatus", (technicians) => {
      setTechniciansOnline(technicians.length);
    });

    return () => {
      socket.off("updateLiveChatQueue");
      socket.off("updateTechnicianStatus");
    };
  }, []);

  const addAvailability = (date, time) => {
    setSchedule((prevSchedule) => [...prevSchedule, { date, time }]);
  };

  const handleAddAvailability = () => {
    const date = prompt("Enter date (YYYY-MM-DD):");
    const time = prompt("Enter time (HH:MM):");
    if (date && time) {
      addAvailability(date, time);
      alert("Availability added!");
    }
  };

  const handleViewSchedule = () => {
    setShowSchedule(!showSchedule);
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomer(customerId);
    socket.emit("selectCustomer", customerId);
  };

  const handleSendMessage = (message) => {
    if (!selectedCustomer) return;

    socket.emit("message", { to: selectedCustomer, message });
    setMessages((prevMessages) => [...prevMessages, { sender: "technician", text: message }]);
  };

  return (
    <div className="technician-page">
      <Header />
      <h1>Technician Dashboard</h1>
      <p>Technicians Online: {techniciansOnline}</p>
      <div className="technician-actions">
        <button
          className="video-call-button"
          onClick={() => window.open("https://meet.google.com", "_blank")}
        >
          Attend Video Call
        </button>
      </div>
      <div className="queues">
        <h2>Live Chat Queue</h2>
        <ul>
          {liveChatQueue.map((customer) => (
            <li key={customer.id}>
              <strong>{customer.name}</strong> - {customer.issue || "No issue provided"}
              <button onClick={() => handleSelectCustomer(customer.id)}>
                Connect
              </button>
            </li>
          ))}
        </ul>
        <h2>Video Call Queue</h2>
        <ul>
          {videoCallQueue.map((customer) => (
            <li key={customer.id}>
              <strong>{customer.name}</strong> - {customer.issue || "No issue provided"}
              <button onClick={() => handleSelectCustomer(customer.id, "videoCall")}>
                Connect
              </button>
              <button
                onClick={() =>
                  window.open(`https://meet.google.com/new?customer=${customer.id}`, "_blank")
                }
              >
                Start Video Call
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedCustomer && (
        <div className="live-chat">
          <h2>Chat with {selectedCustomer.name}</h2>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(e.target.value);
              }}
            />
          </div>
        </div>
      )}
      <h2>Technician Schedule</h2>
      <div className="schedule-actions">
        <button className="add-availability-button" onClick={handleAddAvailability}>
          Add Availability
        </button>
        <button className="view-schedule-button" onClick={handleViewSchedule}>
          {showSchedule ? "Hide Schedule" : "View Schedule"}
        </button>
      </div>
      {showSchedule && <TechnicianSchedule schedule={schedule} />}
      <h2>Notifications</h2>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}