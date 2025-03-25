//VideoCallButton.jsx

import React from "react";
import "../styles/VideoCallButton.css"; // Corrected path

export default function VideoCallButton({ onClick }) {
  return (
    <button className="main-button" onClick={onClick}>
      Connect with Technician
    </button>
  );
}