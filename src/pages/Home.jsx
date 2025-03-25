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