import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TechnicianSchedule.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = Array.from({ length: 31 }, (_, i) => {
  const hours = Math.floor((i + 10) / 2).toString().padStart(2, "0"); // Start from 5:00 (index shift)
  const minutes = (i % 2 === 0) ? "00" : "30";
  return `${hours}:${minutes}`;
});

export default function TechnicianSchedule({ technicianId, token }) {
  const [schedule, setSchedule] = useState(new Map());

  useEffect(() => {
    if (technicianId && token) fetchSchedule();
  }, [technicianId, token]);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/schedule/mechanic/${technicianId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log(response.data);
  
      const slotMap = new Map();
      response.data.schedule.forEach(s => {
        // Convert "HH:MM:SS" to "HH:MM"
        const formattedTime = s.time_slot.substring(0, 5);
        slotMap.set(`${s.day_of_week}-${formattedTime}`, s.status);
      });
  
      setSchedule(slotMap);
    } catch (err) {
      console.error("Error fetching schedule:", err);
    }
  };
  

  const toggleSlot = async (day, time) => {
    const key = `${day}-${time}`;
    const slotStatus = schedule.get(key);
  
    try {
      if (slotStatus !== undefined) {
        console.log(slotStatus);
        // If the slot exists, toggle its status
        const newStatus = !slotStatus; // Flip the current status (true -> false, false -> true)
        await axios.put("http://localhost:5000/schedule/update", { day_of_week: day, time_slot: time, status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedule(prev => new Map(prev).set(key, newStatus));
      } else {
        // If the slot does not exist, create it as available (true)
        await axios.post("http://localhost:5000/schedule/add", { day_of_week: day, time_slot: time }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedule(prev => new Map(prev).set(key, true)); // New slots are added as available
      }
    } catch (err) {
      console.error("Error updating schedule:", err);
    }
  };
  

  return (
    <div className="schedule-board">
      <h2>Manage Your Weekly Schedule</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Time</th>
            {daysOfWeek.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time => (
            <tr key={time}>
              <td>{time}</td>
              {daysOfWeek.map(day => {
                const key = `${day}-${time}`;
                const slotStatus = schedule.get(key); // true = green, false or undefined = red

                return (
                  <td
                    key={key}
                    className={slotStatus === true ? "available-slot" : "busy-slot"}
                    onClick={() => toggleSlot(day, time)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}