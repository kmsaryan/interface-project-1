import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TechnicianPage from "./pages/TechnicianPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";


import "./styles/App.css";
import Header from "./components/Header";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Login Page */}
        <Route path="/register" element={<RegisterPage />} /> {/* Register page route */}
        <Route path="/login" element={<LoginPage />} /> {/* Customer Home Page */}
        <Route path="/technician" element={<TechnicianPage />} /> {/* Technician Page */}
      </Routes>
    </Router>
  );
}

export default App;