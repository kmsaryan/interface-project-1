import React, { useEffect, useState } from "react";
import troubleshootTree from "./troubleshootTree.json";

  // Recursive visual renderer
  export const TreeVisualizer = ({ node }) => {
    if (!node) return null;
  
    return (
      <li>
        <a href="#">{node.question || node.solution}</a>
        {node.yes || node.no ? (
          <ul>
            {node.yes && <TreeVisualizer node={node.yes} />}
            {node.no && <TreeVisualizer node={node.no} />}
          </ul>
        ) : null}
      </li>
    );
  };

const TreeEditor = () => {
  const [treeData, setTreeData] = useState(troubleshootTree);
  const [selectedNode, setSelectedNode] = useState(null);
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [editingPath, setEditingPath] = useState(null);

  useEffect(() => {
    setTreeData(troubleshootTree);
  }, []);

  const renderNode = (node, path = []) => (
    <div key={path.join("-")} style={{ marginLeft: 20, borderLeft: "1px solid #ccc", paddingLeft: 10 }}>
      <p
        style={{ cursor: "pointer", fontWeight: selectedNode === node ? "bold" : "normal" }}
        onClick={() => handleSelectNode(node, path)}
      >
        {node.question ? `Q: ${node.question}` : `Solution: ${node.solution}`}
      </p>
      {node.responses &&
        Object.entries(node.responses).map(([key, child]) => (
          <div key={key}>
            <strong>{key}</strong>
            {renderNode(child, [...path, key])}
          </div>
        ))}
    </div>
  );

  const handleSelectNode = (node, path) => {
    setSelectedNode(node);
    setQuestion(node.question || "");
    setSolution(node.solution || "");
    setEditingPath(path);
  };

  const handleSaveNode = () => {
    if (!editingPath) return;
    const updatedTree = JSON.parse(JSON.stringify(treeData));
    let current = updatedTree;
    for (let i = 0; i < editingPath.length; i++) {
      current = current.responses[editingPath[i]];
    }
    if (question) {
      current.question = question;
      delete current.solution;
      current.responses = current.responses || { Yes: {}, No: {} };
    } else if (solution) {
      current.solution = solution;
      delete current.question;
      delete current.responses;
    }
    setTreeData(updatedTree);
    setSelectedNode(null);
  };

  const handleDeleteNode = () => {
    if (!editingPath || editingPath.length === 0) return;
    const updatedTree = JSON.parse(JSON.stringify(treeData));
    let current = updatedTree;
    for (let i = 0; i < editingPath.length - 1; i++) {
      current = current.responses[editingPath[i]];
    }
    delete current.responses[editingPath[editingPath.length - 1]];
    setTreeData(updatedTree);
    setSelectedNode(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Decision Tree Editor</h2>
      {renderNode(treeData)}

      {selectedNode && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid gray" }}>
          <h3>Edit Node</h3>
          <label>Question:</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} /><br />
          <label>Solution:</label>
          <input value={solution} onChange={(e) => setSolution(e.target.value)} /><br />
          <button onClick={handleSaveNode}>Save</button>
          <button onClick={handleDeleteNode} style={{ color: "red" }}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default TreeEditor;
