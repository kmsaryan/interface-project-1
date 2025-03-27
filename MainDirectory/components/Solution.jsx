// Solution.jsx

import React from "react";

export default function Solution({ steps }) {
  return (
    <div className="solution">
      <h2>Step-by-Step Repair</h2>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>
            <p>{step.text}</p>
            {step.image && <img src={step.image} alt={`Step ${index + 1}`} />}
          </li>
        ))}
      </ol>
    </div>
  );
}