import React, { useState, useEffect } from "react";
import "../styles/global.css";

export default function DealerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await fetch("/api/dealer/customers");
        const technicianRes = await fetch("/api/dealer/technicians");

        if (!customerRes.ok || !technicianRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const customers = await customerRes.json();
        const technicians = await technicianRes.json();

        setCustomers(customers);
        setTechnicians(technicians);
      } catch (err) {
        console.error("Error fetching dealer data:", err);
        setError("Failed to load dealer data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dealer-dashboard">
      <h1>Dealer Dashboard</h1>
      <div className="dashboard-section">
        <h2>Customers</h2>
        <ul>
          {customers.map(customer => (
            <li key={customer.id} onClick={() => setSelectedCustomer(customer)}>
              {customer.name}
            </li>
          ))}
        </ul>
        {selectedCustomer && (
          <div>
            <h3>{selectedCustomer.name}'s Fleet</h3>
            {/* Display fleet and problems */}
          </div>
        )}
      </div>
      <div className="dashboard-section">
        <h2>Technicians</h2>
        <ul>
          {technicians.map(technician => (
            <li key={technician.id} onClick={() => setSelectedTechnician(technician)}>
              {technician.name}
            </li>
          ))}
        </ul>
        {selectedTechnician && (
          <div>
            <h3>{selectedTechnician.name}'s Stats</h3>
            {/* Display stats */}
          </div>
        )}
      </div>
    </div>
  );
}
