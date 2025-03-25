import React from "react";
import PropTypes from "prop-types";
import "./Suggestions.css";

export default function Suggestions({ suggestions, onSelectSuggestion }) {
  return (
    <div className="suggestions-container">
      <h3>Suggestions</h3>
      <ul className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="suggestion-item" onClick={() => onSelectSuggestion(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}

Suggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectSuggestion: PropTypes.func.isRequired,
};