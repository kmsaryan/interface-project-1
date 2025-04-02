import React from "react";
import "../styles/CustomerPage.css";
import { Link } from "react-router-dom";

export default function CustomerHome() {
  return (
    <div className="customer-home-container">
      <main className="main-content">
        <h1 className="title">Volvo Assistant</h1>
        <div className="options-container">
          <Link to="/fleet" className="option-card">
            <h2>Manage My Fleet</h2>
            <p>View and manage your vehicles.</p>
          </Link>
          <Link to="/chatpage" className="option-card">
            <h2>Get Help</h2>
            <p>Find assistance for your vehicles.</p>
          </Link>
          <Link to="/services" className="option-card">
            <h2>Services</h2>
            <p>Explore maintenance and repair services.</p>
          </Link>
          <Link to="/reports" className="option-card">
            <h2>Reports</h2>
            <p>Check performance and diagnostics reports.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
