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
import socket from '../utils/socket';
import ChatInterface from "../components/ChatInterface";
import LiveChat from "../components/LiveChat";

export default function TechnicianPage() {
  const [liveChatQueue, setLiveChatQueue] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [schedule, setSchedule] = useState([]);
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: from === socket.id ? "You" : "Customer", text: message },
      ]);
    });

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("updateLiveChatQueue");
      socket.off("receiveMessage");
    };
  }, []);

  const handleAddAvailability = () => {
    if (selectedDate && selectedTime) {
      const date = selectedDate.toISOString().split("T")[0];
      const time = selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      console.log("Adding availability:", { date, time });
      setSchedule((prevSchedule) => [...prevSchedule, { date, time }]);
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
      setSelectedCustomer(customer);
      socket.emit("selectCustomer", customerId);
    } else {
      console.warn("Customer not found in queue.");
    }
  };

  const handleSendMessage = ({ text }) => {
    if (selectedCustomer) {
      console.log("Sending message to customer:", { to: selectedCustomer.id, text });
      socket.emit("sendMessage", { to: selectedCustomer.id, message: text });
      setMessages((prevMessages) => [...prevMessages, { sender: "You", text }]);
    } else {
      console.warn("No customer selected. Cannot send message.");
    }
  };

  console.log("TechnicianPage component is rendering...");

  return (
    <div className="technician-page">
      <Header />
      <h1>Technician Dashboard</h1>
      <p>Customers in Queue: {liveChatQueue.length}</p>
      <div className="technician-actions">
        <h2>Add Availability</h2>
        <div>
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
      <div className="queues">
        <h2>Customer Queue</h2>
        <ul>
          {liveChatQueue.map((customer, index) => (
            <li key={customer.id || index}>
              <strong>{customer.name}</strong> - {customer.issue || "No issue provided"}
              <button onClick={() => handleSelectCustomer(customer.id)}>Connect</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedCustomer && (
        <ChatInterface
          messages={messages}
          onSendMessage={({ text }) => {
            const newMessage = { sender: "You", text };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit("sendMessage", { to: selectedCustomer.id, message: text });
          }}
          suggestions={["Please elaborate.", "Can you clarify?", "What is the issue?"]}
          role="technician"
          inLiveChat={true} // Always in live chat for technicians
        />
      )}
      <h2>Technician Schedule</h2>
      <div className="schedule-actions">
        <button className="view-schedule-button" onClick={() => setShowSchedule(!showSchedule)}>
          {showSchedule ? "Hide Schedule" : "View Schedule"}
        </button>
      </div>
      {showSchedule && <TechnicianSchedule schedule={schedule} />}
      <Footer />
    </div>
  );
}