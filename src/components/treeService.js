// /src/components/treeService.js
const API_BASE = 'http://localhost:5000/api/tree'; // ajuste se seu backend estiver em outra porta ou domínio

export const fetchTreeList = async () => {
    const response = await fetch(`${API_BASE}/trees`);
    return response.json();
};

export const fetchTree = async (rootId) => {
    const response = await fetch(`${API_BASE}/tree/${rootId}`);
    return response.json();
};

export const createTree = async (question) => {
    const response = await fetch(`${API_BASE}/trees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    return response.json();
};

export const addNode = async (node) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(node),
  });
  return response.json();
};

export const updateNode = async (id, updatedNode) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNode),
  });
  return response.json();
};

export const deleteNode = async (id) => {
  await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
};

export const findMainIssueByKeyword = async (keyword) => {
  const response = await fetch(`${API_BASE}/match?keyword=${encodeURIComponent(keyword)}`);
  if (!response.ok) {
    throw new Error('No matching issue found');
  }
  return response.json();
};

export const findResponseWithKeywordAndParentId = async (parentId, responseText) => {
  const url = `${API_BASE}/match-response?parent_id=${encodeURIComponent(parentId)}&response=${encodeURIComponent(responseText)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No matching response found');
  }
  return response.json();
};

export const fetchFullGraph = async () => {
  const response = await fetch(`${API_BASE}/graph`);
  return response.json();
};

export const addEdge = async (parent_id, child_id, response_label) => {
  const response = await fetch(`${API_BASE}/edges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parent_id, child_id, response_label }),
  });
  return response.json();
};

export const deleteEdge = async (parent_id, child_id) => {
  await fetch(`${API_BASE}/edges`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parent_id, child_id }),
  });
}
