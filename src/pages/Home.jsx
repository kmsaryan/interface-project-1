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

  return (
    <div className="home">
      <main className="main-content">
        <h1>VOLVO AI ASSISTANT</h1>
        <p>What is your problem?</p>


      </main>
    </div>
  );
}
