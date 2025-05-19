// DealerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DealerDashboard.css";

export default function DealerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is dealer
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "dealer" && process.env.NODE_ENV !== "development") {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch users data from backend - using sample data for now due to endpoint issues
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Instead of trying to fetch from the server, use sample data for now
        // This is temporary until the API endpoint issues are resolved
        
        // Sample data to display
        const sampleData = {
          customers: [
            { id: 1, name: "Helena", email: "helena@gmail.com", role: "customer" },
            { id: 3, name: "John Doe", email: "johndoe@example.com", role: "customer" },
            { id: 4, name: "John Doe2", email: "johndoe2@example.com", role: "customer" }
          ],
          technicians: [
            { id: 2, name: "Juliano", email: "juliano@gmail.com", role: "technician" }
          ]
        };
        
        setCustomers(sampleData.customers);
        setTechnicians(sampleData.technicians);
        setLoading(false);
        
        // Comment out the actual API call for now
        /*
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/dealer/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Separate users by role
        const allUsers = response.data;
        const customersList = allUsers.filter(user => user.role === "customer");
        const techniciansList = allUsers.filter(user => user.role === "technician");
        
        setCustomers(customersList);
        setTechnicians(techniciansList);
        */
      } catch (err) {
        console.error("[ERROR] Fetching users failed:", err);
        setError(`Failed to load users data: ${err.message || "Unknown error"}`);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading dealer dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dealer-dashboard">
      <h1>Dealer Dashboard</h1>
      
      <div className="dashboard-section">
        <h2>Customers ({customers.length})</h2>
        <ul className="user-list">
          {customers.length > 0 ? (
            customers.map(customer => (
              <li key={customer.id} onClick={() => setSelectedCustomer(customer)} className={selectedCustomer?.id === customer.id ? "selected" : ""}>
                <div className="user-name">{customer.name}</div>
                <div className="user-email">{customer.email}</div>
              </li>
            ))
          ) : (
            <li className="empty-list">No customers found</li>
          )}
        </ul>
        
        {selectedCustomer && (
          <div className="user-details">
            <h3>{selectedCustomer.name}'s Details</h3>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>ID:</strong> {selectedCustomer.id}</p>
            
            <div className="placeholder-section">
              <h4>Fleet Management</h4>
              <div className="placeholder-feature">
                <p>Fleet details will be displayed here</p>
                <div className="placeholder-item">Vehicle 1 (Placeholder)</div>
                <div className="placeholder-item">Vehicle 2 (Placeholder)</div>
              </div>
            </div>
            
            <div className="placeholder-section">
              <h4>Service History</h4>
              <div className="placeholder-feature">
                <p>Service history will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="dashboard-section">
        <h2>Technicians ({technicians.length})</h2>
        <ul className="user-list">
          {technicians.length > 0 ? (
            technicians.map(technician => (
              <li key={technician.id} onClick={() => setSelectedTechnician(technician)} className={selectedTechnician?.id === technician.id ? "selected" : ""}>
                <div className="user-name">{technician.name}</div>
                <div className="user-email">{technician.email}</div>
              </li>
            ))
          ) : (
            <li className="empty-list">No technicians found</li>
          )}
        </ul>
        
        {selectedTechnician && (
          <div className="user-details">
            <h3>{selectedTechnician.name}'s Details</h3>
            <p><strong>Email:</strong> {selectedTechnician.email}</p>
            <p><strong>ID:</strong> {selectedTechnician.id}</p>
            
            <div className="placeholder-section">
              <h4>Technician Stats</h4>
              <div className="placeholder-feature">
                <p>Performance statistics will be displayed here</p>
                <div className="stats-placeholder">
                  <div className="stat-item">Tickets Resolved: <span>0</span></div>
                  <div className="stat-item">Average Resolution Time: <span>0 min</span></div>
                  <div className="stat-item">Customer Satisfaction: <span>N/A</span></div>
                </div>
              </div>
            </div>
            
            <div className="placeholder-section">
              <h4>Current Schedule</h4>
              <div className="placeholder-feature">
                <p>Upcoming appointments will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}