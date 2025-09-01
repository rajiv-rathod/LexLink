import React, { useRef, useState } from 'react';
import { analyzeDocument } from '../services/api';

const FileUpload = ({ onAnalysisComplete, onError, isLoading, setIsLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const resetKeyRef = useRef(0); // force-reset input after each analysis

  const accept = '.pdf,.txt,.png,.jpg,.jpeg';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    onError?.('');
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
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!/^(application\/pdf|text\/plain|image\/(png|jpeg))$/.test(file.type)) {
      onError?.('Unsupported file type. Use PDF, TXT, PNG, or JPG.');
      return;
    }
    setSelectedFile(file);
    onError?.('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      onError?.('Please select a file to analyze.');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      onError?.('Unsupported file type. Please use PDF, TXT, PNG, or JPG files.');
      return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      onError?.('File size too large. Please use files smaller than 10MB.');
      return;
    }
    
    try {
      setIsLoading(true);
      onError?.(''); // Clear any previous errors
      
      const result = await analyzeDocument(selectedFile);
      onAnalysisComplete?.(result);
    } catch (err) {
      console.error(err);
      onError?.(err?.response?.data?.error || err.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
      // Reset input so the same file can be selected again on the next run
      setSelectedFile(null);
      resetKeyRef.current += 1;
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="upload-card">
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Drop a file here or click to choose</p>
        <input
          key={resetKeyRef.current}
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div className="file-meta">
          <strong>Selected:</strong> {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !selectedFile}
        className="analyze-btn"
      >
        {isLoading ? '⏳ Analyzing…' : '🔍 Analyze Document'}
      </button>
    </div>
  );
};

export default FileUpload;
