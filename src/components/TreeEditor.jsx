import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css"; // Import styles
import {
  fetchFullGraph,
  createTree,
  updateNode,
  deleteNode,
  addNode,
  addEdge,
  deleteEdge,
} from "../components/treeService";

const TreeEditor = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [responseLabel, setResponseLabel] = useState("Yes");
  const [loading, setLoading] = useState(true);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectLabel, setConnectLabel] = useState("");
  const [disconnectingFrom, setDisconnectingFrom] = useState(null);
  const [disconnectMode, setDisconnectMode] = useState(false);

  const loadTree = async () => {
    setLoading(true);
    const graph = await fetchFullGraph();
    setTreeData(graph);
    setLoading(false);
  };

  useEffect(() => {
    loadTree();
  }, []);

  useEffect(() => {
    const loadGraph = async () => {
      const graph = await fetchFullGraph();
      setTreeData(graph);
    };
    loadGraph();
  }, []);

  const renderNode = (node, path = []) => {
    if (!node) return null;
  
    return (
      <div
        key={path.join("-")}
        style={{ marginLeft: 20, borderLeft: "2px solid #ccc", paddingLeft: 10, marginTop: 10 }}
      >
        <p
          style={{
            cursor: "pointer",
            fontWeight: selectedNode?.id === node.id ? "bold" : "normal"
          }}
          onClick={() => handleSelectNode(node, path)}
        >
          {node.question ? `Q: ${node.question}` : `Solution: ${node.solution}`}
        </p>
  
        {node.solution && (
          <p style={{ margin: 0, fontStyle: "italic" }}>Solution: {node.solution}</p>
        )}
  
        {node.image_url && (
          <div>
            <img src={node.image_url} alt="" width={100} />
          </div>
        )}
  
        {/* Renderiza os filhos com labels de resposta */}
        {node.responses && Object.entries(node.responses).map(([label, child]) => (
          <div key={child.id}>
            <strong>↳ {label}</strong>
            {renderNode(child, [...path, label])}
          </div>
        ))}
      </div>
    );
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

  const newNode = await addNode({
    question: question || null,
    solution: solution || null,
    image_url: imageUrl || null,
  });

  await addEdge(selectedNode.id, newNode.id, responseLabel);
  await loadTree();
  setSelectedNode(null);
};


  const handleCreateNewTree = async () => {
    const question = prompt("Enter the main question or description for this problem:");
    if (!question) return;
    const newNode = await addNode({
      question: question || null,
      solution: solution || null,
      image_url: imageUrl || null,
    });
    await loadTree();
    setSelectedNode(newNode);
  };

  const handleConnectNodeClick = () => {
    if (!selectedNode) return;
    setConnectingFrom(selectedNode);
    setSelectedNode(null); // limpa a seleção atual para o próximo clique
  };

  const handleSelectNode = async (node) => {
    if (connectingFrom && connectLabel) {
      // Conecta
      await addEdge(connectingFrom.id, node.id, connectLabel);
      await loadTree();
      setConnectingFrom(null);
      setConnectLabel("");
      setSelectedNode(null);
      return;
    }
  
    if (disconnectMode && disconnectingFrom) {
      // Desconecta
      await deleteEdge(disconnectingFrom.id, node.id);
      await loadTree();
      setDisconnectingFrom(null);
      setDisconnectMode(false);
      setSelectedNode(null);
      return;
    }
  
    // Seleção normal
    setSelectedNode(node);
    setQuestion(node.question || "");
    setSolution(node.solution || "");
    setImageUrl(node.image_url || "");
    setResponseLabel("");
  };

  const handleDisconnectNodeClick = () => {
    if (!selectedNode) return;
    setDisconnectingFrom(selectedNode);
    setDisconnectMode(true);
    setSelectedNode(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Decision Tree Editor</h2>

      <button onClick={handleCreateNewTree}>+ Create New Root</button>

      {selectedNode && (
        <div className="edit-node-box">
          <h3 style={{color: "white"}}>Edit Node</h3>
          <label style={{color: "white"}}>Question:</label>
          <input className="edit-node-input-style oval-lg" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter question..."/><br />
          <label style={{color: "white"}}>Solution:</label>
          <input className="edit-node-input-style oval-lg" value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Enter solution..."/><br />
          <label style={{color: "white"}}>Image URL:</label>
          <input className="edit-node-input-style oval-lg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL..."/><br />
          <div className="edit-node-box-buttons">
            <div className="circle_black long"><button  onClick={handleSaveNode}>Save Changes</button></div>
            <div className="circle_black long"><button onClick={handleDeleteNode} style={{ color: "red" , fontWeight: "bolder"}}>Delete Node</button></div>
          </div>
          <h3 style={{color: "white"}}>Add a New Node</h3>
          <label style={{color: "white"}}>Response Label (e.g., Yes or No):</label>
          <input className="edit-node-input-style oval-lg" value={responseLabel} onChange={(e) => setResponseLabel(e.target.value)} placeholder="Label"/><br />
          <div className="edit-node-box-buttons">
          <div className="circle_black long"><button onClick={handleAddChildNode}>Add Child</button></div>
          </div>
          <h3 style={{color: "white"}}>Connect Node</h3>
          <label style={{color: "white"}}>Response Label for the Connection:</label>
          <input className="edit-node-input-style oval-lg" value={connectLabel} onChange={(e) => setConnectLabel(e.target.value)} placeholder="Label"/><br />
          <div className="edit-node-box-buttons">
          <div className="circle_black long"><button onClick={handleConnectNodeClick}>Start Connecting</button></div>                                  
          <div className="circle_black long"><button onClick={handleDisconnectNodeClick} style={{ color: "orange", fontWeight: "bolder" }}>
              Disconnect
            </button></div>
          </div>
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        treeData.map((root) => renderNode(root))
      )}

    </div>
  );
};

export default TreeEditor;
