//index.jsx is the entry point of the application. It is the first file that gets executed when the application is run. It is responsible for rendering the App component in the root element of the HTML document.

import React from "react";
import ReactDOM from "react-dom";
import ChatPage from "./pages/ChatPage";

ReactDOM.render(
  <React.StrictMode>
    <ChatPage />
  </React.StrictMode>,
  document.getElementById("root")
);