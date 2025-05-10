import React, { useState } from "react";
import axios from "axios";
import "../styles/DBMSManagerPage.css";

const DBMSManagerPage = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleExecuteQuery = async () => {
    try {
      setError("");
      setResult(null);

      const response = await axios.post("http://localhost:5000/api/db/execute", {
        query,
      });

      if (response.status === 200) {
        setResult(response.data);
      }
    } catch (err) {
      console.error("[ERROR] Query execution failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to execute query.");
    }
  };

  return (
    <div className="dbms-manager-container">
      <h1>DBMS Manager</h1>
      <textarea
        placeholder="Enter your SQL query here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleExecuteQuery}>Execute Query</button>
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <h2>Query Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DBMSManagerPage;
