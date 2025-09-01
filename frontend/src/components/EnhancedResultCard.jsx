import { useState, useEffect } from "react";
import { translateText, generateAudio, checkCompliance, benchmarkDocument } from "../services/api";

export default function EnhancedResultCard({ analysis }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [translation, setTranslation] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState({});
  const [language, setLanguage] = useState('en');

  // Available languages for translation
  const languages = [
    { code: 'en', name: '🇺🇸 English' },
    { code: 'es', name: '🇪🇸 Spanish' },
    { code: 'fr', name: '🇫🇷 French' },
    { code: 'de', name: '🇩🇪 German' },
    { code: 'zh', name: '🇨🇳 Chinese' },
    { code: 'ja', name: '🇯🇵 Japanese' },
    { code: 'ko', name: '🇰🇷 Korean' },
    { code: 'pt', name: '🇵🇹 Portuguese' },
    { code: 'it', name: '🇮🇹 Italian' },
    { code: 'ru', name: '🇷🇺 Russian' },
    { code: 'ar', name: '🇸🇦 Arabic' },
    { code: 'hi', name: '🇮🇳 Hindi' }
  ];

  const handleTranslate = async (targetLang) => {
    setLoading(prev => ({ ...prev, translate: true }));
    try {
      const result = await translateText(analysis.summary, targetLang);
      setTranslation(result);
      setLanguage(targetLang);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setLoading(prev => ({ ...prev, translate: false }));
    }
  };

  const handleGenerateAudio = async () => {
    setLoading(prev => ({ ...prev, audio: true }));
    try {
      const textToRead = `Document Summary: ${analysis.summary}. 
        Key Rights: ${analysis.yourRights?.join(', ')}. 
        Key Obligations: ${analysis.yourObligations?.join(', ')}.`;
      
      const result = await generateAudio(textToRead);
      setAudioData(result);
    } catch (error) {
      console.error('Audio generation error:', error);
    } finally {
      setLoading(prev => ({ ...prev, audio: false }));
    }
  };

  const handleCheckCompliance = async () => {
    setLoading(prev => ({ ...prev, compliance: true }));
    try {
      // Create document text from analysis
      const docText = `Summary: ${analysis.summary}
        Rights: ${analysis.yourRights?.join(', ')}
        Obligations: ${analysis.yourObligations?.join(', ')}
        Key Terms: ${analysis.keyTerms?.map(t => `${t.term}: ${t.explanation}`).join(', ')}`;
      
      const result = await checkCompliance(docText, analysis.documentType);
      setCompliance(result);
    } catch (error) {
      console.error('Compliance check error:', error);
    } finally {
      setLoading(prev => ({ ...prev, compliance: false }));
    }
  };

  const handleBenchmark = async () => {
    setLoading(prev => ({ ...prev, benchmark: true }));
    try {
      // Create document text from analysis
      const docText = `Summary: ${analysis.summary}
        Rights: ${analysis.yourRights?.join(', ')}
        Obligations: ${analysis.yourObligations?.join(', ')}
        Risk Score: ${analysis.riskAssessment?.overallRiskScore}`;
      
      const result = await benchmarkDocument(docText, analysis.documentType);
      setBenchmark(result);
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setLoading(prev => ({ ...prev, benchmark: false }));
    }
  };

  const playAudio = () => {
    if (audioData?.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${audioData.audioContent}`);
      audio.play().catch(err => console.error('Audio playback error:', err));
    }
  };

  const tabs = [
    { id: "overview", label: "📋 Overview", icon: "📋" },
    { id: "risk", label: "⚠️ Risk Analysis", icon: "⚠️" },
    { id: "recommendations", label: "💡 Recommendations", icon: "💡" },
    { id: "compliance", label: "✅ Compliance", icon: "✅" },
    { id: "benchmark", label: "📊 Benchmark", icon: "📊" },
    { id: "accessibility", label: "♿ Accessibility", icon: "♿" },
    { id: "details", label: "📝 Details", icon: "📝" }
  ];

  return (
    <div className="analysis-container">
      {/* Header */}
      <div className="analysis-header">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          📑 Document Analysis
        </h2>
        <div className="document-type">
          {analysis.documentType?.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="enhanced-toolbar">
        <div className="language-selector">
          <label>🌐 Language:</label>
          <select 
            value={language} 
            onChange={(e) => handleTranslate(e.target.value)}
            disabled={loading.translate}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          {loading.translate && <span className="loading-spinner">⏳</span>}
        </div>

        <button 
          onClick={handleGenerateAudio}
          disabled={loading.audio}
          className="toolbar-btn"
        >
          {loading.audio ? '⏳' : '🔊'} Audio Summary
        </button>

        <button 
          onClick={handleCheckCompliance}
          disabled={loading.compliance}
          className="toolbar-btn"
        >
          {loading.compliance ? '⏳' : '✅'} Check Compliance
        </button>

        <button 
          onClick={handleBenchmark}
          disabled={loading.benchmark}
          className="toolbar-btn"
        >
          {loading.benchmark ? '⏳' : '📊'} Benchmark
        </button>
      </div>

      {/* Translation Notice */}
      {translation && translation.demoMode && (
        <div className="demo-notice">
          🌟 Translation powered by Google Cloud (Demo Mode)
        </div>
      )}

      {/* Audio Player */}
      {audioData && (
        <div className="audio-player">
          <div className="audio-controls">
            <button onClick={playAudio} disabled={!audioData.audioContent}>
              {audioData.audioContent ? '▶️ Play Audio Summary' : '🎵 Audio Demo Mode'}
            </button>
            {audioData.demoMode && (
              <span className="demo-text">
                🌟 Text-to-Speech powered by Google Cloud (Demo Mode)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label.replace(/^[^\\s]+ /, '')}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-content">
            <div className="summary-section">
              <h3>📄 Summary</h3>
              <p>{translation?.translatedText || analysis.summary}</p>
            </div>

            <div className="rights-obligations">
              <div className="rights">
                <h3>✅ Your Rights</h3>
                <ul>
                  {analysis.yourRights?.map((right, index) => (
                    <li key={index}>
                      <span>•</span>
                      <span>{right}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="obligations">
                <h3>📝 Your Obligations</h3>
                <ul>
                  {analysis.yourObligations?.map((obligation, index) => (
                    <li key={index}>
                      <span>•</span>
                      <span>{obligation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="key-terms">
              <h3>🔑 Key Terms Explained</h3>
              <div className="terms-grid">
                {analysis.keyTerms?.map((term, index) => (
                  <div key={index} className="term-card">
                    <h4>{term.term}</h4>
                    <p>{term.explanation}</p>
                    <div className="importance">{term.importance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "risk" && analysis.riskAssessment && (
          <div className="risk-content">
            <div className="risk-score">
              <h3>🎯 Overall Risk Score</h3>
              <div className={`score-badge score-${analysis.riskAssessment.overallRiskScore <= 3 ? 'low' : analysis.riskAssessment.overallRiskScore <= 7 ? 'medium' : 'high'}`}>
                {analysis.riskAssessment.overallRiskScore}/10
              </div>
            </div>

            <div className="risk-factors">
              <h3>⚠️ Risk Factors</h3>
              {analysis.riskAssessment.riskFactors?.map((risk, index) => (
                <div key={index} className={`risk-item ${risk.severity}`}>
                  <div className="risk-header">
                    <span className={`severity-badge ${risk.severity}`}>
                      {risk.severity.toUpperCase()}
                    </span>
                    <h4>{risk.risk}</h4>
                  </div>
                  <p>{risk.explanation}</p>
                </div>
              ))}
            </div>

            {analysis.redFlags && (
              <div className="red-flags">
                <h3>🚩 Red Flags</h3>
                <ul>
                  {analysis.redFlags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "recommendations" && analysis.recommendations && (
          <div className="recommendations-content">
            <h3>💡 Recommendations</h3>
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className={`recommendation ${rec.priority}`}>
                <div className="rec-header">
                  <span className={`priority-badge ${rec.priority}`}>
                    {rec.priority?.toUpperCase() || 'MEDIUM'}
                  </span>
                  <h4>{rec.action}</h4>
                </div>
                <p>{rec.reason}</p>
              </div>
            ))}

            {analysis.nextSteps && (
              <div className="next-steps">
                <h3>🎯 Next Steps</h3>
                <ol>
                  {analysis.nextSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {activeTab === "compliance" && (
          <div className="compliance-content">
            {!compliance ? (
              <div className="get-started">
                <h3>✅ Compliance Analysis</h3>
                <p>Get a detailed compliance check against current regulations and industry standards.</p>
                <button 
                  onClick={handleCheckCompliance} 
                  disabled={loading.compliance}
                  className="btn btn-primary"
                >
                  {loading.compliance ? '⏳ Checking...' : '✅ Run Compliance Check'}
                </button>
              </div>
            ) : (
              <div className="compliance-results">
                <div className="compliance-score">
                  <h3>📊 Compliance Score</h3>
                  <div className={`score-badge score-${compliance.complianceScore <= 3 ? 'low' : compliance.complianceScore <= 7 ? 'medium' : 'high'}`}>
                    {compliance.complianceScore}/10
                  </div>
                  <div className={`status-badge ${compliance.overallStatus}`}>
                    {compliance.overallStatus?.replace('-', ' ').toUpperCase()}
                  </div>
                </div>

                {compliance.regulatoryIssues && (
                  <div className="regulatory-issues">
                    <h3>⚖️ Regulatory Issues</h3>
                    {compliance.regulatoryIssues.map((issue, index) => (
                      <div key={index} className={`issue ${issue.severity}`}>
                        <h4>{issue.regulation}</h4>
                        <p><strong>Issue:</strong> {issue.issue}</p>
                        <p><strong>Recommendation:</strong> {issue.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {compliance.recommendations && (
                  <div className="compliance-recommendations">
                    <h3>🎯 Action Items</h3>
                    {compliance.recommendations.immediate && (
                      <div className="immediate">
                        <h4>🔥 Immediate (Critical)</h4>
                        <ul>
                          {compliance.recommendations.immediate.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "benchmark" && (
          <div className="benchmark-content">
            {!benchmark ? (
              <div className="get-started">
                <h3>📊 Industry Benchmark</h3>
                <p>Compare your document against industry standards and market norms.</p>
                <button 
                  onClick={handleBenchmark} 
                  disabled={loading.benchmark}
                  className="btn btn-primary"
                >
                  {loading.benchmark ? '⏳ Analyzing...' : '📊 Run Benchmark Analysis'}
                </button>
              </div>
            ) : (
              <div className="benchmark-results">
                <div className="overall-rating">
                  <h3>🏆 Overall Rating</h3>
                  <div className={`score-badge score-${benchmark.overallRating <= 3 ? 'low' : benchmark.overallRating <= 7 ? 'medium' : 'high'}`}>
                    {benchmark.overallRating}/10
                  </div>
                </div>

                {benchmark.industryComparison && (
                  <div className="industry-comparison">
                    <h3>📈 Industry Comparison</h3>
                    <div className="comparison-stats">
                      <div className="stat">
                        <label>Percentile Ranking:</label>
                        <span>{benchmark.industryComparison.percentile}</span>
                      </div>
                      <div className="summary">
                        {benchmark.industryComparison.summary}
                      </div>
                    </div>
                  </div>
                )}

                {benchmark.fairnessScore && (
                  <div className="fairness-score">
                    <h3>⚖️ Fairness Analysis</h3>
                    <div className="fairness-grid">
                      <div className="fairness-item">
                        <label>Overall Fairness:</label>
                        <span className="score">{benchmark.fairnessScore.overall}/10</span>
                      </div>
                      <div className="fairness-item">
                        <label>Balance:</label>
                        <span className={`balance ${benchmark.fairnessScore.balance}`}>
                          {benchmark.fairnessScore.balance?.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {benchmark.unusualClauses && (
                  <div className="unusual-clauses">
                    <h3>🔍 Unusual Clauses</h3>
                    {benchmark.unusualClauses.map((clause, index) => (
                      <div key={index} className={`clause ${clause.impact}`}>
                        <h4>{clause.clause}</h4>
                        <div className="clause-meta">
                          <span className={`rarity ${clause.rarity}`}>{clause.rarity}</span>
                          <span className={`impact ${clause.impact}`}>{clause.impact}</span>
                        </div>
                        <p>{clause.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "accessibility" && (
          <div className="accessibility-content">
            <h3>♿ Accessibility Features</h3>
            <div className="accessibility-tools">
              <div className="tool-card">
                <h4>🔊 Audio Summary</h4>
                <p>Listen to your document analysis with text-to-speech technology.</p>
                <button 
                  onClick={handleGenerateAudio}
                  disabled={loading.audio}
                  className="btn btn-secondary"
                >
                  {loading.audio ? '⏳ Generating...' : '🔊 Generate Audio'}
                </button>
                {audioData && (
                  <div className="audio-result">
                    {audioData.audioContent ? (
                      <button onClick={playAudio} className="btn btn-primary">
                        ▶️ Play Audio Summary
                      </button>
                    ) : (
                      <div className="demo-mode">
                        🎵 Audio generation powered by Google Cloud Text-to-Speech (Demo Mode)
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="tool-card">
                <h4>🌐 Multi-Language Support</h4>
                <p>Translate your document analysis into multiple languages.</p>
                <div className="language-grid">
                  {languages.slice(0, 6).map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleTranslate(lang.code)}
                      className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                      disabled={loading.translate}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
                {translation && (
                  <div className="translation-result">
                    <h5>Translated Summary:</h5>
                    <p>{translation.translatedText}</p>
                    {translation.demoMode && (
                      <div className="demo-mode">
                        🌟 Translation powered by Google Cloud (Demo Mode)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="details-content">
            <h3>📝 Technical Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Document Type:</label>
                <span>{analysis.documentType}</span>
              </div>
              <div className="detail-item">
                <label>Document Length:</label>
                <span>{analysis.documentLength} characters</span>
              </div>
              <div className="detail-item">
                <label>Processing Time:</label>
                <span>{new Date(analysis.processingTime).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Analysis Engine:</label>
                <span>🤖 Google Gemini AI + GCP Services</span>
              </div>
            </div>

            <div className="gcp-services">
              <h4>🌟 Powered by Google Cloud Platform</h4>
              <div className="services-grid">
                <div className="service">
                  <span>🤖</span>
                  <div>
                    <strong>Gemini AI</strong>
                    <p>Advanced document analysis</p>
                  </div>
                </div>
                <div className="service">
                  <span>🌐</span>
                  <div>
                    <strong>Translation API</strong>
                    <p>Multi-language support</p>
                  </div>
                </div>
                <div className="service">
                  <span>🔊</span>
                  <div>
                    <strong>Text-to-Speech</strong>
                    <p>Audio accessibility</p>
                  </div>
                </div>
                <div className="service">
                  <span>✅</span>
                  <div>
                    <strong>AI Platform</strong>
                    <p>Compliance checking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}