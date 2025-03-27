//Header.jsx is a functional component that renders the header of the application. It contains the logo, navigation links, and authentication buttons. The header is a common component that is used across multiple pages of the application.
import React from "react";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <nav className="nav">
        <a href="#products">Products</a>
        <a href="#solutions">Solutions</a>
        <a href="#community">Community</a>
        <a href="#resources">Resources</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
        <a href="#link">Link</a>
      </nav>
      <div className="auth-buttons">
        <button className="sign-in">Sign In</button>
        <button className="register">Register</button>
      </div>
    </header>
  );
}