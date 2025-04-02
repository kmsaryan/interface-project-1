// TechnicianPage.jsx
import React from "react";
import TechnicianSchedule from "../components/TechnicianSchedule";
import "../styles/TechnicianPage.css";
import "../styles/Header.css";
import "../components/VideoCallButton";

export default function TechnicianPage() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  const user = userData ? JSON.parse(userData) : null;
  console.log(user);

  return (
    <div className="technician-page">
      <h1>Technician Dashboard</h1>
      {user ? (
        <TechnicianSchedule technicianId={user.id} token={token} />
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
