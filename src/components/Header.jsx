//Header.jsx is a functional component that renders the header of the application. It contains the logo, navigation links, and authentication buttons. The header is a common component that is used across multiple pages of the application.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/images/volvo-alt.svg";
import "../styles/global.css"; // Import global styles

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Volvo Logo" />
      </div>
      <button className="hamburger" onClick={toggleNav}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      
      <nav className={`nav ${isNavOpen ? "open" : ""}`}>
        <Link to="/register">Register</Link>
        <Link to="/signin">Sign In</Link>
        <Link to="/home">Customer Dashboard</Link>
        <Link to="/technician">Technician Dashboard</Link>
      </nav>

      {isNavOpen && (
        <div className="fullscreen-nav">
          <button className="close-btn" onClick={toggleNav}>×</button>
          <nav className="nav">
            <Link to="/register" onClick={toggleNav}>Register</Link>
            <Link to="/signin" onClick={toggleNav}>Sign In</Link>
            <Link to="/home" onClick={toggleNav}>Customer Dashboard</Link>
            <Link to="/technician" onClick={toggleNav}>Technician Dashboard</Link>
          </nav>
        </div>
      )}
    </header>
  );
}