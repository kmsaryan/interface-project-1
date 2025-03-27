// TechnicianSchedule.jsx
import React from "react";

export default function TechnicianSchedule({ schedule, addAvailability }) {
  return (
    <div className="technician-schedule">
      <h2>Technician Availability</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const date = e.target.date.value;
          const time = e.target.time.value;
          addAvailability(date, time);
        }}
      >
        <input type="date" name="date" required />
        <input type="time" name="time" required />
        <button type="submit">Add Availability</button>
      </form>
      <ul>
        {schedule.map((slot, index) => (
          <li key={index}>
            {slot.date} at {slot.time}
          </li>
        ))}
      </ul>
    </div>
  );
}