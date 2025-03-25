import React from "react";
import "./VideoCallButton.css";

export default function VideoCallButton({ onClick }) {
  return (
    <button className="video-call-button" onClick={onClick}>
      Connect with Technician
    </button>
  );
}