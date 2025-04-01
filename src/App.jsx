import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import TechnicianPage from "./pages/TechnicianPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CustomerHome from "./pages/CustomerHome";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home Page */}
          <Route path="/customer_home" element={<CustomerHome />} /> {/* Customer Home */}
          <Route path="/register" element={<RegisterPage />} /> {/* Register Page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
          <Route path="/technician" element={<TechnicianPage />} /> {/* Technician Page */}
          <Route path="/signin" element={<LoginPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
