import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import Loader from '../components/Loader'; 
import '../styles/BotChatMessage.css';

export default function BotChatMessage({ message }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
      setShow(true);
    }, 1000);
  }, []);

  return (
    <div className={`react-chatbot-kit-chat-bot-message-container ${show ? 'fade-in' : ''}`}>
      <div className="react-chatbot-kit-chat-bot-message">
        {/* Show the loader while loading */}
        {loading ? (
          <div className="chatbot-loader-container">
            <Loader />
          </div>
        ) : (
          <Markdown>{message}</Markdown> 
        )}
      </div>
    </div>
  );
}