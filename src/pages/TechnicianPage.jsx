// TechnicianPage.jsx
// File: src/pages/TechnicianPage.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TechnicianSchedule from "../components/TechnicianSchedule";
import "../styles/TechnicianPage.css";
import "../styles/Header.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import socket from "../utils/socket";
import ChatInterface from "../components/ChatInterface";

export default function TechnicianPage() {
  const [liveChatQueue, setLiveChatQueue] = useState([]);
  const [activeChats, setActiveChats] = useState([]); // Track active chat sessions
  const [schedule, setSchedule] = useState([]); // Technician's schedule
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    console.log("Registering technician...");
    socket.emit("registerUser", { role: "technician", name: "Technician" });

    socket.on("updateLiveChatQueue", (queue) => {
      console.log("Received live chat queue update:", queue);
      setLiveChatQueue(queue);
    });

    socket.on("receiveMessage", ({ from, message }) => {
      console.log("Received message:", { from, message });
      setActiveChats((prevChats) =>
        prevChats.map((chat) =>
          chat.customer.id === from
            ? {
                ...chat,
                messages: [...chat.messages, { sender: "Customer", text: message }],
              }
            : chat
        )
      );
    });

    socket.on("updateTechnicianSchedule", (updatedSchedule) => {
      console.log("Received updated schedule:", updatedSchedule);
      setSchedule(updatedSchedule);
    });

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("updateLiveChatQueue");
      socket.off("receiveMessage");
      socket.off("updateTechnicianSchedule");
    };
  }, []);

  const handleAddAvailability = () => {
    if (selectedDate && selectedTime) {
      const date = selectedDate.toISOString().split("T")[0];
      const time = selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newAvailability = { date, time };
      console.log("Adding availability:", newAvailability);

      const updatedSchedule = [...schedule, newAvailability];
      setSchedule(updatedSchedule);
      socket.emit("updateTechnicianSchedule", updatedSchedule); // Notify the server about the updated schedule
      alert("Availability added!");
    } else {
      alert("Please select both date and time.");
    }
  };

  const handleSelectCustomer = (customerId) => {
    console.log("Selecting customer with ID:", customerId);
    const customer = liveChatQueue.find((c) => c.id === customerId);
    if (customer) {
      console.log("Customer found:", customer);
      setActiveChats((prevChats) => [
        ...prevChats,
        { customer, messages: [] }, // Add a new chat session
      ]);
      socket.emit("selectCustomer", customerId);
      setLiveChatQueue((prevQueue) => prevQueue.filter((c) => c.id !== customerId)); // Remove from queue
    } else {
      console.warn("Customer not found in queue.");
    }
  };

  const handleSendMessage = (customerId, text) => {
    console.log("Sending message to customer:", { to: customerId, text });
    socket.emit("sendMessage", { to: customerId, message: text });
    setActiveChats((prevChats) =>
      prevChats.map((chat) =>
        chat.customer.id === customerId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: "You", text }],
            }
          : chat
      )
    );
  };

  const handleEndChat = (customerId) => {
    console.log("Ending chat with customer:", customerId);
    socket.emit("endChat", { customerId });
    setActiveChats((prevChats) => prevChats.filter((chat) => chat.customer.id !== customerId));
    socket.emit("notifyCustomerChatEnded", { customerId }); // Notify the customer
  };

  return (
    <div className="technician-page">
      <Header />
      <h1>Technician Dashboard</h1>
      <div className="technician-layout">
        <div className="customer-queue">
          <h2>Customer Queue</h2>
          <ul>
            {liveChatQueue.map((customer, index) => (
              <li key={customer.id || index} className="queue-item">
                <div>
                  <strong>{customer.name}</strong> - {customer.issue || "No issue provided"}
                </div>
                <button onClick={() => handleSelectCustomer(customer.id)}>Connect</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-sessions">
          {activeChats.length > 0 ? (
            activeChats.map((chat, index) => (
              <div key={index} className="chat-session">
                <h3>Chat with {chat.customer.name}</h3>
                <ChatInterface
                  messages={chat.messages}
                  onSendMessage={({ text }) => handleSendMessage(chat.customer.id, text)}
                  suggestions={["Please elaborate.", "Can you clarify?", "What is the issue?"]}
                  role="technician"
                  inLiveChat={true}
                />
                <button
                  className="end-chat-button"
                  onClick={() => handleEndChat(chat.customer.id)}
                >
                  End Chat
                </button>
              </div>
            ))
          ) : (
            <p>No active chats</p>
          )}
        </div>
      </div>
      <div className="technician-actions">
        <h2>Add Availability</h2>
        <div className="availability-form">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Select Date"
          />
          <DatePicker
            selected={selectedTime}
            onChange={(time) => setSelectedTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="Select Time"
          />
          <button onClick={handleAddAvailability}>Add</button>
        </div>
      </div>
      <h2>Technician Schedule</h2>
      <div className="schedule-actions">
        <button className="view-schedule-button" onClick={() => setShowSchedule(!showSchedule)}>
          {showSchedule ? "Hide Schedule" : "View Schedule"}
        </button>
      </div>
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
              {schedule.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Footer />
    </div>
  );
}