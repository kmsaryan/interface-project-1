import { useEffect, useState } from "react";
import "../styles/FleetPage.css";

export default function FleetPage() {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setError("User not found");
      return;
    }

    const userId = user.id;
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    fetch(`${backendUrl}/api/machines/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMachines(data);
        } else {
          setError("No machines found for this user.");
        }
      })
      .catch((err) => {
        setError("Error fetching machines: " + err.message);
        console.error("Error fetching machines:", err);
      });
  }, []);

  return (
    <div className="fleet-container">
      <h1 className="fleet-title">Manage my fleet</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="fleet-grid">
        {machines.map((machine) => (
          <div key={machine.id} className="fleet-card">
            <img
              src={machine.url || "https://via.placeholder.com/100"}
              alt={machine.model}
              className="fleet-image"
            />
            <div className="fleet-info">
              <h1 className="fleet-name">{machine.model}</h1>
              <h3 className="fleet-number">{machine.serial_number}</h3>

              <a href={`/fleet/${machine.machine_id}`} className="fleet-button">
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
