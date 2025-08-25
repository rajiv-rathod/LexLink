import React from 'react';

const AnalysisResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="analysis-results">
      <h3>📊 Analysis Results</h3>
      
      <div className="result-section">
        <h4>Document Overview</h4>
        <p>{results.insights?.summary}</p>
      </div>

      <div className="result-section">
        <h4>Detailed Analysis</h4>
        <ul>
          {results.insights?.keyPoints?.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="result-section">
        <h4>Content Statistics</h4>
        <ul>
          <li>Words: {results.contentAnalysis?.wordCount}</li>
          <li>Characters: {results.contentAnalysis?.charCount}</li>
          <li>Lines: {results.contentAnalysis?.lineCount}</li>
          <li>Type: {results.contentAnalysis?.docType}</li>
        </ul>
      </div>

      <div className="result-section">
        <h4>Recommendations</h4>
        <ul>
          {results.insights?.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {results.contentAnalysis?.preview && (
        <div className="result-section">
          <h4>Content Preview</h4>
          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            maxHeight: '200px',
            overflow: 'auto',
            fontSize: '0.9em',
            lineHeight: '1.4'
          }}>
            {results.contentAnalysis.preview}
          </div>
        </div>
      )}

      <div className="metadata">
        <p>Document: <strong>{results.document?.filename}</strong></p>
        <p>Size: {(results.document?.size / 1024).toFixed(2)} KB</p>
        <p>Type: {results.document?.type}</p>
        <p>Analyzed on: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AnalysisResults;
