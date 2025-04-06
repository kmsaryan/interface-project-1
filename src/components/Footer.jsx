//Footer.jsx

import React from "react";
import "../styles/Footer.css"; // Import footer-specific styles
import "../styles/global.css"; // Import global styles

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>Contact and Locations</h4>
        <ul>
          <li>Our locations</li>
          <li>Press contacts</li>
          <li>Find your local dealer</li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Social Media</h4>
        <ul>
          <li>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>About Us</h4>
        <ul>
          <li>Company information</li>
          <li>What we believe in</li>
          <li>Career</li>
          <li>News and events</li>
        </ul>
      </div>
      <div className="footer-bottom">
        <span>© Copyright AB Volvo 2025</span>
        <span>
          <a href="https://www.volvogroup.com" target="_blank" rel="noopener noreferrer">
            volvogroup.com
          </a>{" "}
          | <a href="/privacy">Privacy</a> | <a href="/cookies">Cookies</a>
        </span>
      </div>
    </footer>
  );
}