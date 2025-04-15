// /src/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "../styles/RegisterLogin.css";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Define navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("[DEBUG] Login successful:", response.data);

        // Store token and user role in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("user", JSON.stringify({
          id: response.data.user.id,
          role: response.data.user.role,
          name: email.split('@')[0] // Use email username as display name
        }));

        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event("authChange"));

        // Navigate based on role
        if (response.data.user.role === "dealer") {
          navigate("/dealer");
        } else if (response.data.user.role === "customer") {
          navigate("/customer_home");
        } else if (response.data.user.role === "technician") {
          navigate("/technician");
        }
      }
    } catch (error) {
      console.error("[ERROR] Login failed:", error.response?.data || error.message);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
