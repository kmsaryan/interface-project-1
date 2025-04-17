import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import TechnicianPage from "./pages/TechnicianPage";
import LoginPage from "./pages/LoginPage"; // Updated import
import CustomerHome from "./pages/CustomerHome";
import Fleet from "./pages/Fleet";
import ChatPage from "./pages/ChatPage";
import LiveChat from "./pages/LiveChat";
import RegistrationPage from "./pages/RegistrationPage";
import LiveChatForm from "./pages/LiveChatForm"; // Updated import
import DealerDashboard from "./pages/DealerDashboard"; // Import DealerDashboard
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary
import "./styles/fonts.css";
import "./styles/App.css";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/chatpage" element={<ChatPage />} />
            <Route path="/livechat" element={<LiveChat />} />
            <Route path="/livechatform" element={<LiveChatForm />} />
            <Route path="/login" element={<LoginPage />} /> {/* Updated route */}

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
            <Route path="/dealer" element={<DealerDashboard />} /> {/* New route for dealer dashboard */}
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;