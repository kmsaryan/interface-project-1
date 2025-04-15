import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/icons/volvo_logo.png";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }
    };

    // Update user on component mount
    updateUser();

    // Listen for storage events (from other tabs)
    window.addEventListener("storage", updateUser);
    
    // Listen for custom auth change events (within the same tab)
    window.addEventListener("authChange", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("authChange", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"));
    
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Volvo Logo" />
      </div>
      <nav className="nav">
        <Link to="/">HOME</Link>
        <Link to="/chat">NEWS & MEDIA</Link>
        <Link to="/news">NEWS</Link>
        {user && user.role === "customer" && <Link to="/customer_home">MY SERVICES</Link>}
        {user && user.role === "technician" && <Link to="/technician">MY DASHBOARD</Link>}
        {user && user.role === "dealer" && <Link to="/dealer">MY DASHBOARD</Link>}
        {user && user.role === "admin" && <Link to="/admin">ADMIN DASHBOARD</Link>}
      </nav>
      <div className="auth-buttons">
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button className="logout" onClick={handleLogout}>Sign Out</button>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="login">Login</button>
            </Link>
            <Link to="/register">
              <button className="register">Register</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}