import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Ensure this import is correct
import Loader from '../components/Loader'; // Ensure the Loader component is correctly imported
import '../styles/BotChatMessage.css'; // Ensure correct styles are imported

export default function BotChatMessage({ message }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  // Simulate the loading state for 1 second before showing the message
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Stop loading after 1 second
      setShow(true); // Show the message after the delay
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
          <Markdown>{message}</Markdown> // Render message with markdown if not loading
        )}
      </div>
    </div>
  );
}
