import React from "react";
import ReactDOM from "react-dom/client";  // Notice the new import path
import App from "./App";

// Create a root using the new API
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app inside StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
