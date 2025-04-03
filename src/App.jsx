import { Navigate } from 'react-router-dom';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Home from "./pages/Home";
import Layout from "./components/Layout";
import TechnicianPage from "./pages/TechnicianPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CustomerHome from "./pages/CustomerHome";
import "./styles/App.css";
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin');
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home Page */}
          <Route path="/customer_home" element={<CustomerHome />} /> {/* Customer Home */}
          <Route path="/register" element={<RegisterPage />} /> {/* Register Page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
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
          <Route path="/signin" element={<LoginPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
