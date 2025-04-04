import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import socket from "../utils/socket";
import "../styles/Home.css";
import customerGif from "../assets/images/Customer.gif"; // Import customer GIF

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    issue: "",
    machine: "",
    priority: "Medium", // Default priority
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("joinLiveChatQueue", formData); // Add customer to live chat queue
    navigate("/livechat", { state: { role: "customer" } }); // Redirect to Live Chat Page with role
  };

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <h1>Customer Dashboard</h1>
        <p>Fill out the form below to start a live chat with a technician.</p>
        <img src={customerGif} alt="Customer GIF" className="customer-gif" />
        <form className="assistant-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="issue"
            placeholder="Describe your issue"
            value={formData.issue}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="machine"
            placeholder="Machine Type"
            value={formData.machine}
            onChange={handleInputChange}
            required
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button type="submit">Start Live Chat</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}