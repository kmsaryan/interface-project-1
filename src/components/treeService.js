// /src/components/treeService.js
const API_BASE = 'http://localhost:5000/api/tree'; // ajuste se seu backend estiver em outra porta ou domínio

export const fetchTree = async () => {
  const response = await fetch(API_BASE);
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
