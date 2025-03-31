import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import "./styles/fonts.css";
import TechnicianPage from "./pages/TechnicianPage";
import ChatPage from "./pages/ChatPage";

import "./styles/App.css";
import Header from "./components/Header";
import SignInPage from "./pages/SignInPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/home" element={<Home />} /> {/* Customer Home Page */}
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/technician" element={<TechnicianPage />} /> {/* Technician Page */}
        <Route path="/signin" element={<SignInPage />} />
        {/* Add a placeholder for registration */}
        <Route path="/register" element={<div>Registration Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;