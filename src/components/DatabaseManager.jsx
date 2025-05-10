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
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const fetchTableData = async (table) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:5000/api/db/${table}`);
      console.log("[DEBUG] Fetched data:", response.data); // Log the response for debugging
      setData(response.data);
    } catch (err) {
      setError(`Failed to fetch data for table: ${table}`);
      console.error("[ERROR] Fetching table data failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/db/${selectedTable}/${id}`);
      fetchTableData(selectedTable); // Refresh data
    } catch (err) {
      setError("Failed to delete entry.");
      console.error(err);
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setEditData(row);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/db/${selectedTable}/${editingRow}`, editData);
      setEditingRow(null);
      fetchTableData(selectedTable); // Refresh data
    } catch (err) {
      setError("Failed to save changes.");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handleInputChange = (e, key) => {
    setEditData({ ...editData, [key]: e.target.value });
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
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && selectedTable && (
          <>
            <h2>{selectedTable} Table</h2>
            <table>
              <thead>
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    {Object.keys(row).map((key) => (
                      <td key={key}>
                        {editingRow === row.id ? (
                          <input
                            type="text"
                            value={editData[key] || ""}
                            onChange={(e) => handleInputChange(e, key)}
                          />
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                    <td>
                      {editingRow === row.id ? (
                        <>
                          <button onClick={handleSaveEdit}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(row)}>Edit</button>
                          <button onClick={() => handleDelete(row.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;