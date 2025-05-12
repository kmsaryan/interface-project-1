import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { api } from "../utils/api";
import "../styles/RegistrationPage.css";
import "../styles/global.css";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Make API call to backend using the centralized API utility
      const response = await axios.post(api.register, {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.status === 201) {
        console.log("User registered successfully:", response.data);

        // Store user data in localStorage
        localStorage.setItem("userRole", formData.role);
        localStorage.setItem("user", JSON.stringify({
          name: formData.username,
          role: formData.role
        }));

        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event("authChange"));

        // Role-based navigation
        if (formData.role === "customer") {
          navigate("/customer_home");
        } else if (formData.role === "technician") {
          navigate("/technician");
        } else if (formData.role === "dealer") {
          navigate("/dealer");
        }
      }
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
            <option value="dealer">Dealer</option> {/* Added dealer role */}
          </select>
        </div>

        <button type="submit">Register</button>
      </form>

    </div>
  );
}
