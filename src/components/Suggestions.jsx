// suggestions.jsx is a presentational component that displays a list of suggestions. It receives two props: suggestions and onSelectSuggestion. The suggestions prop is an array of strings that represent the suggestions to display. The onSelectSuggestion prop is a function that is called when a suggestion is clicked. It takes a single argument, which is the suggestion that was clicked.
import React from "react";
import PropTypes from "prop-types";
import "../styles/Suggestions.css";

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