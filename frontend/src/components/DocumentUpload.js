import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DocumentUpload = ({ onUpload, loading, error }) => {
  const [file, setFile] = useState(null);
  
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt']
    },
    multiple: false
  });
  
  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };
  
  return (
    <div className="upload-container">
      <h2>Upload Legal Document</h2>
      <p>Upload a PDF, image, or text file to analyze with AI</p>
      
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select a file</p>
        )}
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