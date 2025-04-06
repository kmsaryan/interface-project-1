import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import socket from "../utils/socket";
import "../styles/global.css";
import "../styles/TechnicianPage.css";
import technicianGif from "../assets/images/Technician.gif"; // Import technician GIF
import { useNavigate } from "react-router-dom";
import UserList from "../components/UserList";
import ChatList from "../components/ChatList";
import "../styles/global.css"; // Import global styles

const TechnicianPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeChatCustomerId, setActiveChatCustomerId] = useState(null);
  const [notification, setNotification] = useState("");
  const [users, setUsers] = useState([]);
  const [activeChats, setActiveChats] = useState([]); // Track active chats
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updateLiveChatQueue", (queue) => {
      console.log("[DEBUG] Received liveChatQueue:", queue); // Debugging log
      setCustomers(queue);
    });

    socket.on("customerConnected", (customer) => {
      setActiveChatCustomerId(customer.id);
      setNotification(`Connected to customer: ${customer.name}`);
    });

    socket.on("customerNotFound", ({ customerId }) => {
      setNotification(`Customer with ID ${customerId} is no longer available.`);
    });

    socket.on("customerAlreadyInChat", ({ customerId }) => {
      setNotification(`Customer with ID ${customerId} is already in an active chat.`);
    });

    socket.on("chatEnded", ({ customerId }) => {
      setNotification("Chat has ended.");
      setActiveChats((prevChats) => prevChats.filter((chat) => chat.id !== customerId));
      setActiveChatCustomerId(null);
      setSelectedCustomer(null); // Clear selected customer on chat end
    });

    socket.on("updateUserStatus", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off("updateLiveChatQueue");
      socket.off("customerConnected");
      socket.off("customerNotFound");
      socket.off("customerAlreadyInChat");
      socket.off("chatEnded");
      socket.off("updateUserStatus");
    };
  }, []);

  const handleSelectCustomer = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer); // Update selected customer
      setActiveChatCustomerId(null); // Clear active chat if viewing details
    } else {
      setNotification("No customer selected for chat.");
    }
  };

  const handleStartChat = (customerId) => {
    if (!customerId) {
      setNotification("No customer selected for chat.");
      return;
    }
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      socket.emit("selectCustomer", customerId);
      setActiveChats((prevChats) => [...prevChats, customer]); // Add to active chats
      setSelectedCustomer(null); // Clear selected customer details
      navigate("/livechat", { state: { role: "technician", customerId, name: customer.name, queue: customers } }); // Navigate to LiveChat
    } else {
      setNotification("Customer not found in the queue.");
    }
  };

  const handleEndChat = (customerId) => {
    const confirmEnd = window.confirm("Are you sure you want to end this chat?");
    if (confirmEnd) {
      socket.emit("endChat", { customerId });
      setActiveChats((prevChats) => prevChats.filter((chat) => chat.id !== customerId)); // Remove from active chats
      setActiveChatCustomerId(null); // Clear active chat
      setSelectedCustomer(null); // Clear selected customer details
      setNotification("Chat ended. Redirecting to home...");
      setTimeout(() => navigate("/technician"), 2000); // Redirect after 2 seconds
    }
  };

  const handleEscalateChat = (customerId) => {
    const confirmEscalate = window.confirm("Are you sure you want to escalate this chat?");
    if (confirmEscalate) {
      const escalationDetails = { customerId, technicianId: socket.id, escalationType: "Supervisor" };
      socket.emit("escalateChat", escalationDetails);
      alert("Chat escalated to a supervisor.");
    }
  };

  const handleDismissNotification = () => {
    setNotification("");
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!customer || !customer.name) {
      console.warn("[WARN] Invalid customer object:", customer);
      return false; // Exclude invalid customers
    }
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "All" || customer.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const technicians = users.filter((user) => user.role === "technician"); // Define technicians
  const customersList = users.filter((user) => user.role === "customer"); // Define customers

  return (
    <div className="container technician-page">
      <h1>Technician Dashboard</h1>
      <img src={technicianGif} alt="Technician GIF" className="technician-gif" />
      <div className="technician-layout">
        {/* Left Column */}
        <div>
          <div className="customer-queue">
            <h2>Customer Queue</h2>
            <div className="queue-filters">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`queue-item ${
                  activeChatCustomerId === customer.id ? "in-chat" : ""
                }`}
              >
                <span>{customer.name || "Unknown"}</span> {/* Fallback for missing name */}
                <span className={`priority ${customer.priority?.toLowerCase() || "medium"}`}>
                  {customer.priority || "Medium"} {/* Fallback for missing priority */}
                </span>
                <span className="time-elapsed">
                  {customer.joinedAt
                    ? `${Math.floor((Date.now() - customer.joinedAt) / 60000)} min ago`
                    : "N/A"}
                </span>
                <button
                  onClick={() => handleSelectCustomer(customer.id)}
                  disabled={activeChatCustomerId === customer.id}
                >
                  {activeChatCustomerId === customer.id ? "In Chat" : "View"}
                </button>
              </div>
            ))}
          </div>
          <div className="customer-details">
            <h2>Customer Details</h2>
            {selectedCustomer ? (
              <>
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>Issue:</strong> {selectedCustomer.issue}</p>
                <p><strong>Machine:</strong> {selectedCustomer.machine}</p>
                <div className="button-group">
                  <button onClick={() => handleStartChat(selectedCustomer.id)}>Start Chat</button>
                  <button onClick={() => handleEndChat(selectedCustomer.id)}>End Chat</button>
                  <button onClick={() => handleEscalateChat(selectedCustomer.id)}>Escalate</button>
                </div>
              </>
            ) : (
              <p>Select a customer to view details.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="online-users">
            <h2>Online Users</h2>
            <div className="dashboard-layout">
              <div className="card">
                <h2>Online Technicians</h2>
                <UserList users={technicians} />
              </div>
              <div className="card">
                <h2>Online Customers</h2>
                <UserList users={customersList} />
              </div>
              <div className="card">
                <h2>Active Chats</h2>
                <ChatList chats={activeChats} onSelectChat={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="active-chats">
        <h2>Active Chats</h2>
        {activeChats.map((chat) => (
          <div key={chat.id} className="chat-item">
            <span>{chat.name}</span>
            <button onClick={() => setSelectedCustomer(chat)}>View Chat</button>
          </div>
        ))}
      </div>

      {/* Notification */}
      {notification && (
        <div className="notification">
          <span>{notification}</span>
          <button className="dismiss-button" onClick={handleDismissNotification}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default TechnicianPage;