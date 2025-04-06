import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/RegistrationPage.css";
import "../styles/global.css";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "customer", // Default role
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registered User:", formData); // Simulate registration
    if (formData.role === "customer") {
      navigate("/home"); // Redirect to Customer Home Page
    } else {
      navigate("/technician"); // Redirect to Technician Dashboard
    }
  };

  return (
    <div className="registration-page">
      <Header />
      <h1>Register</h1>
      <form className="registration-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleInputChange}>
          <option value="customer">Customer</option>
          <option value="technician">Technician</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <Footer />
    </div>
  );
}
