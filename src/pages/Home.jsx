import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../components/ChatInterface";
import TechnicianConnect from "../components/TechnicianConnect";
import TechnicianSchedule from "../components/TechnicianSchedule";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../react-chatbot-kit";
import config from "../components/chatbotConfig";
import MessageParser from "../components/MessageParser";
import ActionProvider from "../components/ActionProvider";
import "../styles/Home.css";

export default function Home({ onSubmitIssue = () => {} }) {
  const [technicianSchedule, setTechnicianSchedule] = useState([]);
  const [showBot, toggleBot] = useState(false); // state for toggling chatbot
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <button type="submit">Submit</button>
        </form>
        <TechnicianConnect technicianSchedule={technicianSchedule} />
        <TechnicianSchedule
          schedule={technicianSchedule}
          addAvailability={addAvailability}
        />

        {/* Conditionally render the chatbot */}
        {showBot && (
          <div className="app-chatbot-container">
            <Chatbot
              config={config}
              messageParser={MessageParser}  // Use your existing MessageParser
              actionProvider={ActionProvider} // Use your existing ActionProvider
            />
          </div>
        )}

        {/* Chatbot toggle button */}
        <button
          className="app-chatbot-button"
          onClick={() => toggleBot((prev) => !prev)} // Toggle visibility of chatbot
        >
          <div>Bot</div>
          <svg viewBox="0 0 640 512" className="app-chatbot-button-icon">
            <path d="M192,408h64V360H192ZM576,192H544a95.99975,95.99975,0,0,0-96-96H344V24a24,24,0,0,0-48,0V96H192a95.99975,95.99975,0,0,0-96,96H64a47.99987,47.99987,0,0,0-48,48V368a47.99987,47.99987,0,0,0,48,48H96a95.99975,95.99975,0,0,0,96,96H448a95.99975,95.99975,0,0,0,96-96h32a47.99987,47.99987,0,0,0,48-48V240A47.99987,47.99987,0,0,0,576,192ZM96,368H64V240H96Zm400,48a48.14061,48.14061,0,0,1-48,48H192a48.14061,48.14061,0,0,1-48-48V192a47.99987,47.99987,0,0,1,48-48H448a47.99987,47.99987,0,0,1,48,48Zm80-48H544V240h32ZM240,208a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,240,208Zm160,0a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,400,208ZM384,408h64V360H384Zm-96,0h64V360H288Z"></path>
          </svg>
        </button>
      </main>
      <Footer />
    </div>
  );
}
