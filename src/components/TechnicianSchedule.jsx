// TechnicianSchedule.jsx
import React from "react";

export default function TechnicianSchedule({ schedule }) {
  if (!schedule || schedule.length === 0) {
    return <p>No availability added yet.</p>;
  }

  return (
    <div className="technician-schedule">
      <h2>Technician Availability</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((slot, index) => (
            <tr key={index}>
              <td>{slot.date}</td>
              <td>{slot.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}