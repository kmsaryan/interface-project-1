import React from 'react';
import TreeEditor from './components/TreeEditor';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome Admin</h2>
      <button onClick={handleLogout}>Logout</button>
      <TreeEditor />
    </div>
  );
};

export default AdminDashboard;
