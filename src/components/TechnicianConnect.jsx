import React, { useState } from "react";
import "./TechnicianConnect.css";

export default function TechnicianConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  const handleConnect = () => {
    setIsConnecting(true);
    setConnectionStatus("Connecting to a technician...");

    // Simulate a connection process
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus("Connected to a technician!");
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