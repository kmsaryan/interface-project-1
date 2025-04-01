import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import TechnicianPage from "./pages/TechnicianPage";
import SignInPage from "./pages/SignInPage";
import "./styles/fonts.css";
import "./styles/App.css";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/home" element={<Home />} /> {/* Customer Home Page */}
        <Route path="/chat" element={<ChatPage />} /> {/* Route to ChatPage */}
        <Route path="/technician" element={<TechnicianPage />} /> {/* Technician Page */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<div>Registration Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;