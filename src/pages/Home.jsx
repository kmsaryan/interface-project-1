//Home.jsx
//Home.jsx is a functional component that represents the home page of the application. It contains the main content of the application, including the ChatInterface, Suggestions, VideoCallButton, and TechnicianConnect components. The Home component is a simple container component that renders the child components in a specific layout.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../components/ChatInterface";
import TechnicianConnect from "../components/TechnicianConnect";
import TechnicianSchedule from "../components/TechnicianSchedule";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

export default function Home({ onSubmitIssue = () => {} }) {
  const [technicianSchedule, setTechnicianSchedule] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to the chat page
    navigate("/chat");
  };

  const addAvailability = (date, time) => {
    setTechnicianSchedule([...technicianSchedule, { date, time }]);
  };

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <h1>VOLVO AI ASSISTANT</h1>
        <p>What is your problem?</p>
        <form className="assistant-form" onSubmit={handleSubmit}>
          <ChatInterface />
        </form>
        <TechnicianConnect technicianSchedule={technicianSchedule} />
        <TechnicianSchedule
          schedule={technicianSchedule}
          addAvailability={addAvailability}
        />
      </main>
      <Footer />
    </div>
  );
}