import React from 'react';

const AnalysisResults = ({ results }) => {
  return (
    <div className="analysis-results">
      <h2>Document Analysis</h2>
      
      <div className="summary-section">
        <h3>Summary</h3>
        <p>{results.summary || 'No summary available'}</p>
      </div>
      
      {results.keyPoints && (
        <div className="key-points">
          <h3>Key Points</h3>
          <ul>
            {results.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      
      {results.potentialRisks && (
        <div className="risks">
          <h3>Potential Risks</h3>
          <ul>
            {results.potentialRisks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </div>
      )}
      
      {results.recommendations && (
        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {results.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
