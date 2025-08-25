import React, { useState } from 'react';

const FileUpload = ({ onAnalysisComplete, onError, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || 
          file.type.startsWith('image/') || 
          file.type === 'text/plain') {
        setSelectedFile(file);
        onError('');
      } else {
        onError('Please upload a PDF, image, or text file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      onError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      console.log('Sending file to backend...');
      
      // Use the correct backend URL
      const response = await fetch('https://humble-space-cod-jv7vqw7v7x9h5gx9-3001.app.github.dev/api/analyze', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Analysis result received:', result);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis error:', error);
      onError(error.message || 'Failed to analyze document. Please check if backend is running.');
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`drag-drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.txt,.text"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {selectedFile ? (
          <div className="file-selected">
            <p>✅ <strong>{selectedFile.name}</strong></p>
            <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            <p>Type: {selectedFile.type}</p>
            <button onClick={handleClearFile} className="clear-btn">
              Change File
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <p>📁 Upload Legal Document</p>
            <p>Drag & drop a file here, or click to select a file</p>
            <p className="file-types">Supports: PDF, JPG, PNG, TXT files</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <button 
          onClick={handleAnalyze} 
          disabled={isLoading}
          className="analyze-btn"
        >
          {isLoading ? '⏳ Analyzing Document...' : '🔍 Analyze Document'}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
