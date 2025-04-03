// src/pages/AdminDashboard.jsx
import React from "react";
import TreeEditor from "../components/TreeEditor";

const AdminDashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p>Manage your Troubleshooting Tree below:</p>
      <TreeEditor />
    </div>
  );
};

export default AdminDashboard;
