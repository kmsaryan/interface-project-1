// Suggestions.jsx
import React from "react";
import "../styles/Suggestions.css";

export default function Suggestions({ suggestions = [], onSelectSuggestion }) {
  return (
    <div className="suggestions">
      <h3>Suggestions:</h3>
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => onSelectSuggestion(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}