//Footer.jsx

import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>Use cases</h4>
        <ul>
          <li>UI design</li>
          <li>UX design</li>
          <li>Wireframing</li>
          <li>Diagramming</li>
          <li>Brainstorming</li>
          <li>Online whiteboard</li>
          <li>Team collaboration</li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Explore</h4>
        <ul>
          <li>Design</li>
          <li>Prototyping</li>
          <li>Development features</li>
          <li>Design systems</li>
          <li>Collaboration features</li>
          <li>Design process</li>
          <li>FigJam</li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Resources</h4>
        <ul>
          <li>Blog</li>
          <li>Best practices</li>
          <li>Colors</li>
          <li>Color wheel</li>
          <li>Support</li>
          <li>Developers</li>
          <li>Resource library</li>
        </ul>
      </div>
    </footer>
  );
}