import React, { useState, useEffect } from "react";
import socket from "../utils/socket";
import "../styles/TechnicianPage.css";
import technicianGif from "../assets/images/Technician.gif"; // Import technician GIF
import "../styles/Notification.css"; // Import Notification styles
import "../styles/ChatWindow.css"; // Import ChatWindow styles
import "../styles/TechnicianPage.css"; // Import TechnicianPage styles
import "../styles/fonts.css"; // Import fonts
import { useNavigate } from "react-router-dom"; // Import useNavigate

// TechnicianPage component
const TechnicianPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeChatCustomerId, setActiveChatCustomerId] = useState(null); // Track active chat customer
  const [notification, setNotification] = useState(""); // Notification state
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    socket.on("updateLiveChatQueue", (queue) => {
      setCustomers(queue); // Update customer list dynamically
    });

    socket.on("customerConnected", (customer) => {
      setActiveChatCustomerId(customer.id); // Set active chat customer ID
      setNotification(`Connected to customer: ${customer.name}`);
    });

    socket.on("customerNotFound", ({ customerId }) => {
      setNotification(`Customer with ID ${customerId} is no longer available.`);
    });

    socket.on("customerAlreadyInChat", ({ customerId }) => {
      setNotification(`Customer with ID ${customerId} is already in an active chat.`);
    });

    socket.on("chatEnded", () => {
      setNotification("Chat has ended.");
      setActiveChatCustomerId(null); // Reset active chat customer ID
    });

    return () => {
      socket.off("updateLiveChatQueue");
      socket.off("customerConnected");
      socket.off("customerNotFound");
      socket.off("customerAlreadyInChat");
      socket.off("chatEnded");
    };
  }, []);

  const handleSelectCustomer = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    setSelectedCustomer(customer); // Display customer details
  };

  const handleStartChat = (customerId) => {
    if (!customerId) {
      setNotification("No customer selected for chat.");
      return;
    }
    socket.emit("selectCustomer", customerId); // Start chat with customer
    navigate("/livechat", { state: { role: "technician", customerId } }); // Redirect to Live Chat Page with role and customerId
  };

  const handleEndChat = (customerId) => {
    socket.emit("endChat", { customerId }); // Emit endChat event to server
    setActiveChatCustomerId(null); // Reset active chat customer ID
  };

  const handleDismissNotification = () => {
    setNotification(""); // Clear the notification
  };

  return (
    <div className="technician-page">
      <h1>Technician Dashboard</h1>
      <img src={technicianGif} alt="Technician GIF" className="technician-gif" />
      <div className="technician-layout">
        {/* Customer Queue */}
        <div className="customer-queue">
          <h2>Customer Queue</h2>
          {customers.map((customer) => (
            <div
              key={customer.id}
              className={`queue-item ${
                activeChatCustomerId === customer.id ? "in-chat" : ""
              }`}
            >
              <span>{customer.name}</span>
              <button
                onClick={() => handleSelectCustomer(customer.id)}
                disabled={activeChatCustomerId === customer.id}
              >
                {activeChatCustomerId === customer.id ? "In Chat" : "View"}
              </button>
              <span>{new Date(customer.joinedAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        {/* Customer Details */}
        <div className="customer-details">
          {selectedCustomer ? (
            <>
              <h2>Customer Details</h2>
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Issue:</strong> {selectedCustomer.issue}</p>
              <p><strong>Machine:</strong> {selectedCustomer.machine}</p>
              <button onClick={() => handleStartChat(selectedCustomer.id)}>Start Chat</button>
              <button onClick={() => handleEndChat(selectedCustomer.id)}>End Chat</button>
            </>
          ) : (
            <p>Select a customer to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianPage;
