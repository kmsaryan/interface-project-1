//signInPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SignInPage.css";
import "../styles/fonts.css"; // Import fonts
import "../styles/global.css"; // Import global styles
export default function SignInPage() {
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    navigate("/home"); // Redirect to Customer Home Page
  };

  const handleTechnicianLogin = () => {
    navigate("/technician"); // Redirect to Technician Dashboard
  };

  const handleRegister = () => {
    navigate("/register"); // Redirect to Registration Page
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
      <p className="sign-in-instructions">
        Don't have an account?{" "}
        <button className="register-link" onClick={handleRegister}>
          Register Here
        </button>
      </p>
      <Footer />
    </div>
  );
}