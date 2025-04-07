import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <h2> Register </h2>
        <form className="registration-form" onSubmit={handleRegister}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>

    </div>
  );
}
