import React from "react";
import { Routes, Route } from "react-router-dom";
import GlobalHomePage from "./pages/GlobalHomePage"; // Import GlobalHomePage
import Home from "./pages/Home";
import TechnicianPage from "./pages/TechnicianPage";
import LiveChat from "./pages/LiveChat";
import SignInPage from "./pages/SignInPage";
import RegistrationPage from "./pages/RegistrationPage";
import "./styles/fonts.css";
import "./styles/App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobalHomePage />} /> {/* Default Landing Page */}
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/technician" element={<TechnicianPage />} />
      <Route path="/livechat" element={<LiveChat />} />
    </Routes>
  );
}

export default App;