// /src/pages/LoginPage.jsx

import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginPage.css";
import Header from "../components/Header";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
  
      if (response.data.user.role === "customer") {
        window.location.href = "/customer_home";
      } else {
        window.location.href = "/technician_home";
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };
  
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
