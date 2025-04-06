import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GlobalHomePage from "./pages/GlobalHomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import TechnicianPage from "./pages/TechnicianPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CustomerHome from "./pages/CustomerHome";
import Fleet from "./pages/Fleet";
import ChatPage from "./pages/ChatPage";
import LiveChat from "./pages/LiveChat";
import SignInPage from "./pages/SignInPage";
import RegistrationPage from "./pages/RegistrationPage";
import LiveChatForm from "./pages/LiveChatForm"; // Updated import
import "./styles/fonts.css";
import "./styles/App.css";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<GlobalHomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/livechat" element={<LiveChat />} />
          <Route path="/livechatform" element={<LiveChatForm />} /> {/* Updated route */}

          {/* Customer Routes */}
          <Route path="/customer_home" element={<CustomerHome />} />

          {/* Technician Routes */}
          <Route path="/technician" element={<TechnicianPage />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
