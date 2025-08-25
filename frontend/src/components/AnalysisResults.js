import React from 'react';

const AnalysisResults = ({ results }) => {
  const { document, contentAnalysis, insights, metadata } = results || {};
  if (!results) return null;

  return (
    <div className="results-card">
      <h2>Analysis Results</h2>

      <section>
        <h3>Document</h3>
        <ul>
          <li><strong>Filename:</strong> {document?.filename}</li>
          <li><strong>Type:</strong> {document?.type}</li>
          <li><strong>Size:</strong> {Math.round((document?.size || 0) / 1024)} KB</li>
          <li><strong>Uploaded:</strong> {new Date(document?.uploadDate).toLocaleString()}</li>
        </ul>
      </section>

      <section>
        <h3>Content</h3>
        <ul>
          <li><strong>Type Guess:</strong> {contentAnalysis?.docType}</li>
          <li><strong>Words:</strong> {contentAnalysis?.wordCount}</li>
          <li><strong>Lines:</strong> {contentAnalysis?.lineCount}</li>
          <li><strong>Personal Info:</strong> {contentAnalysis?.containsPersonalInfo ? 'Likely' : 'Not obvious'}</li>
          <li><strong>Dates Present:</strong> {contentAnalysis?.containsDates ? 'Yes' : 'No'}</li>
          <li><strong>Numbers Present:</strong> {contentAnalysis?.containsNumbers ? 'Yes' : 'No'}</li>
        </ul>
        <p><strong>Preview:</strong> {contentAnalysis?.preview}</p>
      </section>

      {insights && (
        <section>
          <h3>Insights</h3>
          <p>{insights.summary}</p>
          <ul>
            {insights.keyPoints?.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
        </section>
      )}

      {metadata && (
        <section>
          <h3>Metadata</h3>
          <ul>
            <li><strong>Analysis ID:</strong> {metadata.analysisId}</li>
            <li><strong>Model:</strong> {metadata.modelUsed}</li>
          </ul>
        </section>
      )}
    </div>
  );
};

export default AnalysisResults;
