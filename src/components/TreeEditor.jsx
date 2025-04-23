import React, { useEffect, useState } from "react";
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
  const [treeList, setTreeList] = useState([]); // list of root nodes (problems)
  const [selectedTreeId, setSelectedTreeId] = useState(null); // currently selected tree
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        treeData.map((root) => renderNode(root))
      )}

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
          <h3>Connect Node</h3>
          <label>Response Label for the Connection:</label>
          <input value={connectLabel} onChange={(e) => setConnectLabel(e.target.value)} /><br />
          <button onClick={handleConnectNodeClick}>Start Connecting</button>                                  
          <button onClick={handleDisconnectNodeClick} style={{ color: "orange" }}>
            Disconnect from Another Node
          </button>
        </div>
      )}
    </div>
  );
};

export default TreeEditor;
