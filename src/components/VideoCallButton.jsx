//VideoCallButton.jsx

import React from "react";
import "../styles/VideoCallButton.css";

export default function VideoCallButton() {
  const videoCallLink = "https://meet.google.com/example-link";

  return (
    <div className="video-call">
      <button
        className="main-button"
        onClick={() => window.open(videoCallLink, "_blank")}
      >
        Connect with Technician via Video Call
      </button>
    </div>
  );
}