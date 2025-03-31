//Troubleshoot.jsx
import React from "react";

export default function Troubleshoot({ issue }) {
  const predefinedIssues = {
    "engine noise": "Check the engine oil level and refill if necessary.",
    "flat tire": "Replace the tire with the spare one.",
  };

  const solution = predefinedIssues[issue.problem.toLowerCase()] || "No solution found.";

  return (
    <div className="troubleshoot">
      <h2>Solution</h2>
      <p>{solution}</p>
      {issue.image && <img src={URL.createObjectURL(issue.image)} alt="Uploaded problem" />}
    </div>
  );
}