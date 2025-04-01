import React, { useState } from 'react';
import treeData from '../troubleshootTree.json';

const TreeNode = ({ node, path = [] }) => {
  const [expanded, setExpanded] = useState(true);

  if (!node) return null;

  const currentPath = path.join(' → ');

  return (
    <div style={{ marginLeft: 20 }}>
      {node.question && (
        <>
          <strong>{currentPath}</strong>
          <div>
            <p>Q: {node.question}</p>
            <button onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Hide' : 'Show'} Children
            </button>
            {expanded && (
              <>
                <TreeNode node={node.yes} path={[...path, 'Yes']} />
                <TreeNode node={node.no} path={[...path, 'No']} />
              </>
            )}
          </div>
        </>
      )}
      {node.solution && <p><strong>Solution:</strong> {node.solution}</p>}
    </div>
  );
};

const TreeEditor = () => {
  const [tree, setTree] = useState(treeData);

  return (
    <div>
      <h3>Troubleshooting Tree View</h3>
      <TreeNode node={tree} />
      <p style={{ fontStyle: 'italic' }}>
        (Editing functionality can be added here using a form builder UI)
      </p>
    </div>
  );
};

export default TreeEditor;
