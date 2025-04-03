//index.jsx is the entry point of the application. It is the first file that gets executed when the application is run. It is responsible for rendering the App component in the root element of the HTML document.

import React from "react";
import ReactDOM from "react-dom/client"; // Use ReactDOM.createRoot
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/ChatInterface.css";
import "./styles/Suggestions.css";
import "./styles/VideoCallButton.css";
import "./styles/TechnicianConnect.css";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create root
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  </React.StrictMode>
);