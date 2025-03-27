//Home.jsx
//Home.jsx is a functional component that represents the home page of the application. It contains the main content of the application, including the ChatInterface, Suggestions, VideoCallButton, and TechnicianConnect components. The Home component is a simple container component that renders the child components in a specific layout.
import React, { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import Suggestions from "../components/Suggestions";
import VideoCallButton from "../components/VideoCallButton";
import TechnicianConnect from "../components/TechnicianConnect";
import TechnicianSchedule from "../components/TechnicianSchedule";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

export default function Home({ onSubmitIssue }) {
  const [problem, setProblem] = useState("");
  const [image, setImage] = useState(null);
  const [technicianSchedule, setTechnicianSchedule] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitIssue({ problem, image });
  };

  const addAvailability = (date, time) => {
    setTechnicianSchedule([...technicianSchedule, { date, time }]);
  };

  return (
    <div className="home">
      <main className="main-content">
        <h1>VOLVO AI ASSISTANT</h1>
        <p>What is your problem?</p>
        <form className="assistant-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe your problem here..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <ChatInterface />
          <Suggestions />
          <VideoCallButton />
          <TechnicianConnect technicianSchedule={technicianSchedule} />
          <button type="submit">Submit</button>
        </form>
        <TechnicianSchedule
          schedule={technicianSchedule}
          addAvailability={addAvailability}
        />
      </main>
      <Footer />
    </div>
  );
}
