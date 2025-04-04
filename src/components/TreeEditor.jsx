import React, { useEffect, useState } from "react";
import {
  fetchTreeList,
  fetchTree,
  createTree,
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
  const [treeList, setTreeList] = useState([]); // list of root nodes (problems)
  const [selectedTreeId, setSelectedTreeId] = useState(null); // currently selected tree

  useEffect(() => {
    const loadTreeList = async () => {
      const list = await fetchTreeList();
      setTreeList(list);
      if (list.length > 0 && !selectedTreeId) {
        setSelectedTreeId(list[0].id); // seleciona o primeiro automaticamente
      }
    };
    loadTreeList();
  }, []);
  
  useEffect(() => {
    if (selectedTreeId) {
      loadTree(selectedTreeId || treeData?.id);
    }
  }, [selectedTreeId]);

  const loadTree = async (treeId) => {
    const tree = await fetchTree(treeId);
    setTreeData(tree);
  };
  

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
        {node.children && node.children.map((child, idx) => (
          <div key={child.id}>
            <strong>↳ {child.response_label || `Response ${idx + 1}`}</strong>
            {renderNode(child, [...path, child.response_label || `Response ${idx + 1}`])}
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
    await loadTree(selectedTreeId || treeData?.id);
    setSelectedNode(null);
  };

  const handleDeleteNode = async () => {
    if (!selectedNode) return;
    const isRoot = selectedNode.parent_id === null;
    await deleteNode(selectedNode.id);
    if (isRoot) {
      const updatedTreeList = treeList.filter(tree => tree.id !== selectedNode.id);
      setTreeList(updatedTreeList);
      setTreeData(null);
      setSelectedTreeId(null);
    } else {
      await loadTree(treeData.id || treeData?.id);
    }
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

    await loadTree(selectedTreeId || treeData?.id);
    setSelectedNode(null);
  };

  const handleCreateNewTree = async () => {
    const question = prompt("Enter the main question or description for this problem:");
    if (!question) return;
    const newTree = await createTree(question);
    setTreeList([...treeList, newTree]);
    setSelectedTreeId(newTree.id);
  };

  return (
    <div style={{ padding: 20 }}>
    <h2>Decision Tree Editor</h2>

    {/* Select dropdown for trees */}
    <div style={{ marginBottom: 20 }}>
      <label>Select a problem tree: </label>
      <select
        value={selectedTreeId || ""}
        onChange={(e) => setSelectedTreeId(Number(e.target.value))}
      >
        <option value="" disabled>Select a tree</option>
        {treeList.map(tree => (
          <option key={tree.id} value={tree.id}>
            {tree.question || `Problem ${tree.id}`}
          </option>
        ))}
      </select>

      <button
        style={{ marginLeft: 10 }}
        onClick={handleCreateNewTree}
      >
        + New Problem Tree
      </button>
    </div>

    {/* Show tree if loaded */}
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
