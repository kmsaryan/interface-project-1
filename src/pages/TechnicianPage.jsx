//TechnicianPage.jsx
import React from "react";
import TechnicianSchedule from "../components/TechnicianSchedule";
import "../styles/TechnicianPage.css";
import "../styles/Header.css";
import "../components/VideoCallButton";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TechnicianPage() {
  return (
    <div className="technician-page">
      <h1>Technician Dashboard</h1>
      <div className="technician-actions">
        <button className="video-call-button">Attend Video Call</button>
        <button className="live-chat-button">Answer Live Chat</button>
      </div>
      <TechnicianSchedule />
    </div>
  );
}