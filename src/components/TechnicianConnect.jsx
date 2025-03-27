// TechnicianConnect.jsx is a new component that displays a button to connect to a technician. When the button is clicked, it simulates a connection process and displays a message indicating the connection status. This component can be used in the ChatInterface component to provide users with the option to connect to a technician for assistance.
// The TechnicianConnect component is a functional component that uses the useState hook to manage the connection status and connection process. It displays a button that, when clicked, simulates a connection process and updates the connection status message accordingly.
import React, { useState } from "react";
import "../styles/TechnicianConnect.css";

export default function TechnicianConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  const handleConnect = () => {
    setIsConnecting(true);
    setConnectionStatus("Connecting to a technician...");

    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus(
        <>
          Connected to a technician! <br />
          <a
            href="https://meet.google.com/brs-udei-ufr" // Replace with your actual Meet link
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the call here
          </a>
        </>
      );
    }, 3000); // Simulate a 3-second connection time
  };


  return (
    <div className="technician-connect">
      <h2>Need Assistance?</h2>
      <p>If you're having trouble, we can connect you to a technician.</p>
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect to Technician"}
      </button>
      {connectionStatus && <p>{connectionStatus}</p>}
    </div>
  );
}