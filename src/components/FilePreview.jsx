import React from "react";

const FilePreview = ({ metadata }) => {
  const { fileData } = metadata;
  if (!fileData) return null;

  return (
    <div className="file-preview">
      <p>
        <strong>File Name:</strong> {fileData.name}
      </p>
      <p>
        <strong>File Type:</strong> {fileData.type}
      </p>
      <p>
        <strong>File Size:</strong> {(fileData.size / 1024).toFixed(2)} KB
      </p>
      <a href={fileData.url} download={fileData.name} target="_blank" rel="noopener noreferrer">
        Download
      </a>
    </div>
  );
};

export default FilePreview;
