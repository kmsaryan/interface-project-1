//Header.jsx is a functional component that renders the header of the application. It contains the logo, navigation links, and authentication buttons. The header is a common component that is used across multiple pages of the application.
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/images/volvo-alt.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Volvo Logo" />
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/technician">Technician</Link>
      </nav>
      <div className="auth-buttons">
        <Link to="/signin">
          <button className="sign-in">Sign In</button>
        </Link>
        <Link to="/register">
          <button className="register">Register</button>
        </Link>
      </div>
    </header>
  );
}