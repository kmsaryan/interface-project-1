//loginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    navigate("/chat"); // Redirect to the Home page (Customer)
  };

  const handleTechnicianLogin = () => {
    navigate("/technician"); // Redirect to the Technician page
  };

  return (
    <div className="login-page">
      <Header />
      <h1>Welcome to Volvo AI Assistant</h1>
      <div className="login-options">
        <button className="login-button" onClick={handleCustomerLogin}>
          Customer
        </button>
        <button className="login-button" onClick={handleTechnicianLogin}>
          Technician
        </button>
      </div>
      <p className="login-instructions">
        Please select your role to proceed.
      </p>
    </div>
  );
}
// need to add styles for the login page