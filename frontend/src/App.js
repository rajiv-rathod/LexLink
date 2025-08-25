import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setError('');
    setIsLoading(false);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setAnalysisResult(null);
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setError('');
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <div className="upload-container">
          <h2 className="upload-title">Upload Legal Document</h2>
          <p className="upload-subtitle">Upload a PDF, image, or text file to analyze with AI</p>
          
          <FileUpload 
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {isLoading && !error && (
            <div className="loading">
              Analyzing your document
            </div>
          )}
        </div>

        {analysisResult && (
          <AnalysisResults results={analysisResult} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
