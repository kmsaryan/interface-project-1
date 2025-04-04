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
        <Link to="/register">Register</Link>
        <Link to="/signin">Sign In</Link>
        <Link to="/home">Customer Dashboard</Link>
        <Link to="/technician">Technician Dashboard</Link>
      </nav>
    </header>
  );
}