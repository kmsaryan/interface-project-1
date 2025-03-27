//App.jsx is the main file that renders the Home component. It is the root component of the application and contains all the other components. The App component is a simple container component that renders the Home component.

import React from "react";
import Home from "./pages/Home";
import "./styles/App.css";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;