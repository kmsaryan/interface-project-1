//Home.jsx
//Home.jsx is a functional component that represents the home page of the application. It contains the main content of the application, including the ChatInterface, Suggestions, VideoCallButton, and TechnicianConnect components. The Home component is a simple container component that renders the child components in a specific layout.
import React from "react";
import ChatInterface from "../components/ChatInterface";
import Suggestions from "../components/Suggestions";
import VideoCallButton from "../components/VideoCallButton";
import TechnicianConnect from "../components/TechnicianConnect";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Support Interface</h1>
      <ChatInterface />
      <Suggestions />
      <VideoCallButton />
      <TechnicianConnect />
    </div>
  );
}