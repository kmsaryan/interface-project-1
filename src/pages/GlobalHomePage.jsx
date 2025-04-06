import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GlobalHomePage.css"; // Page-specific styles
import "../styles/fonts.css"; // Import custom fonts
import "../styles/App.css"; // Import global styles
import technician1 from "../assets/images/Technicain1.jpeg";
import technician2 from "../assets/images/Technicain2.jpeg";
import excavatorB from "../assets/images/ExcavatersB.jpeg";
import excavatorC from "../assets/images/ExcavatersC.jpeg";

export default function GlobalHomePage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin"); // Redirect to Sign-In Page
  };

  const handleRegister = () => {
    navigate("/register"); // Redirect to Registration Page
  };

  return (
    <div className="global-home-page">
      <header className="global-header">
        <h1>Welcome to Volvo CE Chatbot</h1>
        <p>Navigate to the appropriate page using the menu above.</p>
      </header>
      <div className="slideshow">
        <div className="slideshow-images">
          <img src={technician1} alt="Technician 1" />
          <img src={technician2} alt="Technician 2" />
          <img src={excavatorB} alt="Excavator B" />
          <img src={excavatorC} alt="Excavator C" />
        </div>
      </div>
    </div>
  );
}
