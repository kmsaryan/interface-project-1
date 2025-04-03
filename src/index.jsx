//index.jsx is the entry point of the application. It is the first file that gets executed when the application is run. It is responsible for rendering the App component in the root element of the HTML document.

import React from "react";
import ReactDOM from "react-dom/client"; // Use ReactDOM.createRoot
import App from "./App";
import "./styles/ChatInterface.css";
import "./styles/Suggestions.css";
import "./styles/VideoCallButton.css";
import "./styles/TechnicianConnect.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);