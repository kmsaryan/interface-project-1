// suggestions.jsx is a presentational component that displays a list of suggestions. It receives two props: suggestions and onSelectSuggestion. The suggestions prop is an array of strings that represent the suggestions to display. The onSelectSuggestion prop is a function that is called when a suggestion is clicked. It takes a single argument, which is the suggestion that was clicked.
import React from "react";
import PropTypes from "prop-types";
import "../styles/Suggestions.css";

export default function Suggestions({ suggestions, onSelectSuggestion }) {
  // Debugging log to check the props received
  console.log("Suggestions Component Props:", { suggestions, onSelectSuggestion });

  return (
    <div className="suggestions-container">
      <h3>Suggestions</h3>
      <ul className="suggestions-list">
        {(suggestions || []).map((suggestion, index) => {
          // Debugging log to check each suggestion being rendered
          console.log(`Rendering suggestion at index ${index}:`, suggestion);
          return (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => {
                console.log("Suggestion clicked:", suggestion); // Log the clicked suggestion
                onSelectSuggestion(suggestion);
              }}
            >
              {suggestion}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

Suggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectSuggestion: PropTypes.func.isRequired,
};

Suggestions.defaultProps = {
  suggestions: [], // Default to an empty array
};