//signInPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/SignInPage.css";

export default function SignInPage() {
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    navigate("/home");
  };

  const handleTechnicianLogin = () => {
    navigate("/technician");
  };

  return (
    <div className="sign-in-page">
      <Header />
      <h1>Sign In</h1>
      <div className="login-options">
        <button className="login-button" onClick={handleCustomerLogin}>
          Customer
        </button>
        <button className="login-button" onClick={handleTechnicianLogin}>
          Technician
        </button>
      </div>
    </div>
  );
}