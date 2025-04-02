import { Navigate } from 'react-router-dom';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import "./styles/fonts.css";
import TechnicianPage from "./pages/TechnicianPage";
import ChatPage from "./pages/ChatPage";

import "./styles/App.css";
import Header from "./components/Header";
import SignInPage from "./pages/SignInPage";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin');
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/home" element={<Home />} /> {/* Customer Home Page */}
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* Admin Login */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />  {/* Admin Page */}
        <Route path="/technician" element={<TechnicianPage />} /> {/* Technician Page */}
        <Route path="/signin" element={<SignInPage />} />
        {/* Add a placeholder for registration */}
        <Route path="/register" element={<div>Registration Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;