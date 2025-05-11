import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/database-manager.css";

const DatabaseManager = () => {
  const [tables, setTables] = useState([
    "conversations",
    "files",
    "issues",
    "machines",
    "technician_availability",
    "tickets",
    "tree_edges",
    "troubleshoot_tree",
    "users",
  ]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Updated endpoint map based on available routes that actually work
  const endpointMap = {
    "files": "/api/files",
    "tickets": "/api/tickets",
    "tree_edges": "/api/tree_edges",
    "troubleshoot_tree": "/api/tree",
    "machines": "/api/machines/8",
    "conversations": "/api/conversations", // Fixed endpoint
    "issues": "/api/issues/3",
    "technician_availability": "/schedule/mechanic/8",
    "users": "/api/users", // Updated endpoint
  };

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const retry = async (fn, maxRetries) => {
    try {
      return await fn();
    } catch (error) {
      if (maxRetries <= 0) throw error;
      console.log(`Retrying... Attempts left: ${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retry(fn, maxRetries - 1);
    }
  };

  const fetchTableData = async (table) => {
    setLoading(true);
    setError("");
    setData([]);
    setRetryCount(0);

    const problematicEndpoints = ["conversations", "issues", "technician_availability", "users"];
    if (problematicEndpoints.includes(table)) {
      console.log(`Skipping API call for known problematic endpoint: ${table}`);
      setError(`Unable to fetch data for ${table} - backend endpoint is currently unavailable.`);
      setLoading(false);
      return;
    }

    try {
      const endpoint = endpointMap[table] || `/api/${table}`;
      const fetchData = async () => {
        const response = await axios.get(`http://localhost:8001${endpoint}`);
        return response;
      };
      const response = await retry(fetchData, MAX_RETRIES).catch((err) => {
        throw err;
      });

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data && response.data.rows && Array.isArray(response.data.rows)) {
        setData(response.data.rows);
      } else if (response.data && response.data.schedule && Array.isArray(response.data.schedule)) {
        setData(response.data.schedule);
      } else if (response.data && typeof response.data === 'object') {
        if (table === 'db-test') {
          setData([{ timestamp: new Date().toISOString(), message: "Database connection test successful" }]);
        } else {
          setData([response.data]);
        }
      } else {
        setData([{ message: "Data received but in unexpected format" }]);
      }
    } catch (err) {
      console.error(`Failed to fetch ${table}:`, err);
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      if (newRetryCount > MAX_RETRIES) {
        if (err.message && err.message.includes("Network Error")) {
          setError(`Network error: The server appears to be offline or unreachable.`);
        } else if (err.response) {
          if (err.response.status === 404) {
            setError(`This table (${table}) is not available through the API.`);
          } else if (err.response.status === 500) {
            setError(`Server error when fetching ${table}. The server might have database connectivity issues.`);
          } else {
            setError(`Error fetching ${table}: ${err.response.status} ${err.response.statusText}`);
          }
        } else if (err.request) {
          setError(`No response received from the server. The backend might be down.`);
        } else {
          setError(`Error: ${err.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (value, key) => {
    if (value === null || value === undefined) {
      return 'null';
    }

    if (key === 'password') {
      return '[HIDDEN]';
    }

    if (typeof value === 'string' && 
        (key.includes('_at') || key === 'timestamp' || key.includes('date'))) {
      try {
        const date = new Date(value);
        if (!isNaN(date)) {
          return date.toLocaleString();
        }
      } catch (e) {}
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    if (typeof value === 'string' && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      return value.substring(0, 8) + '...';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value.toString();
  };

  const handleRetry = () => {
    if (selectedTable) {
      setRetryCount(0);
      fetchTableData(selectedTable);
    }
  };

  return (
    <div className="database-manager">
      <div className="sidebar">
        <h3>Tables</h3>
        <ul>
          {tables.map((table) => (
            <li
              key={table}
              className={selectedTable === table ? "active" : ""}
              onClick={() => setSelectedTable(table)}
            >
              {table}
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        {loading && <p className="loading">Loading...</p>}
        
        {error && (
          <div className="error-container">
            <p className="error">{error}</p>
            {!["conversations", "issues", "technician_availability", "users"].includes(selectedTable) && (
              <button className="retry-button" onClick={handleRetry}>
                Retry Connection
              </button>
            )}
          </div>
        )}
        
        {!loading && data.length > 0 && selectedTable && (
          <>
            <h2>{selectedTable} Table</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(row).map((key) => (
                        <td key={key}>{renderValue(row[key], key)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {!loading && data.length === 0 && !error && selectedTable && (
          <p>No data available for {selectedTable}</p>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;
