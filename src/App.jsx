import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import TechnicianPage from "./pages/TechnicianPage";
import "./styles/App.css";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/home" element={<Home />} /> {/* Customer Home Page */}
        <Route path="/technician" element={<TechnicianPage />} /> {/* Technician Page */}
      </Routes>
    </Router>
  );
}

export default App;