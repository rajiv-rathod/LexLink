import React, { useCallback, useState } from 'react';

const DocumentUpload = ({ onUpload, loading, error }) => {
  const [file, setFile] = useState(null);
  
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };
  
  return (
    <div className="upload-container">
      <h2>Upload Legal Document</h2>
      <p>Upload a PDF, image, or text file to analyze with AI</p>
      
      <div className="file-input-container">
        <input 
          type="file" 
          onChange={handleFileSelect}
          accept=".pdf,.jpg,.jpeg,.png,.txt"
        />
      </div>
      
      {file && (
        <div className="file-info">
          <p>Selected file: {file.name}</p>
          <button 
            onClick={handleUpload} 
            disabled={loading}
            className="upload-button"
          >
            {loading ? 'Analyzing...' : 'Analyze Document'}
          </button>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DocumentUpload;
