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