import React, { useEffect, useState } from "react";
import {
  fetchTree,
  updateNode,
  deleteNode,
  addNode,
} from "../components/treeService";

const TreeEditor = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [responseLabel, setResponseLabel] = useState("Yes");

  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    const raw = await fetchTree();
    const nested = buildNestedTree(raw);
    setTreeData(nested);
  };

  const buildNestedTree = (nodes) => {
    const lookup = {};
    const root = {};
  
    // Index nodes by ID
    nodes.forEach((node) => {
      lookup[node.id] = { ...node, children: {} };
    });
  
    // Link children to parents
    nodes.forEach((node) => {
      if (node.parent_id) {
        const parent = lookup[node.parent_id];
        if (parent) {
          parent.children[node.response_label] = lookup[node.id];
        }
      } else {
        Object.assign(root, lookup[node.id]); // top level (root)
      }
    });
  
    return root;
  };
  

  const renderNode = (node, path = []) => {
    if (!node) return null;
  
    return (
      <div
        key={path.join("-")}
        style={{ marginLeft: 20, borderLeft: "2px solid #ccc", paddingLeft: 10 }}
      >
        <p
          style={{ cursor: "pointer", fontWeight: selectedNode?.id === node.id ? "bold" : "normal" }}
          onClick={() => handleSelectNode(node, path)}
        >
          {node.question ? `Q: ${node.question}` : `Solution: ${node.solution}`}
        </p>
  
        {/* Render children with response label */}
        {node.children &&
          Object.entries(node.children).map(([label, child]) => (
            <div key={child.id}>
              <strong>↳ {label}</strong>
              {renderNode(child, [...path, label])}
            </div>
          ))}
      </div>
    );
  };
  
  

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setQuestion(node.question || "");
    setSolution(node.solution || "");
    setImageUrl(node.image_url || "");
    setResponseLabel("");
  };

  const handleSaveNode = async () => {
    if (!selectedNode) return;

    const updated = {
      question: question || null,
      solution: solution || null,
      image_url: imageUrl || null,
    };

    await updateNode(selectedNode.id, updated);
    await loadTree();
    setSelectedNode(null);
  };

  const handleDeleteNode = async () => {
    if (!selectedNode) return;
    await deleteNode(selectedNode.id);
    await loadTree();
    setSelectedNode(null);
  };

  const handleAddChildNode = async () => {
    if (!selectedNode || !responseLabel) return;

    await addNode({
      parent_id: selectedNode.id,
      response_label: responseLabel,
      question: question || null,
      solution: solution || null,
      image_url: imageUrl || null,
    });

    await loadTree();
    setSelectedNode(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Decision Tree Editor</h2>
      {treeData && renderNode(treeData)}

      {selectedNode && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid gray" }}>
          <h3>Edit Node</h3>
          <label>Question:</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} /><br />
          <label>Solution:</label>
          <input value={solution} onChange={(e) => setSolution(e.target.value)} /><br />
          <label>Image URL:</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /><br />

          <button onClick={handleSaveNode}>Save Changes</button>
          <button onClick={handleDeleteNode} style={{ color: "red" }}>Delete Node</button>

          <h3>Add Child Node</h3>
          <label>Response Label (e.g., Yes or No):</label>
          <input value={responseLabel} onChange={(e) => setResponseLabel(e.target.value)} /><br />
          <button onClick={handleAddChildNode}>Add Child</button>
        </div>
      )}
    </div>
  );
};

export default TreeEditor;
