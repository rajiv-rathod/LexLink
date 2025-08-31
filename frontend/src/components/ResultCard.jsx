import { useState } from 'react';

// Risk level color mapping
const getRiskColor = (score) => {
  if (score <= 3) return 'text-green-400';
  if (score <= 6) return 'text-yellow-400';
  return 'text-red-400';
};

const getRiskBadge = (severity) => {
  const colors = {
    low: 'bg-green-500/20 text-green-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    high: 'bg-red-500/20 text-red-300'
  };
  return colors[severity] || 'bg-gray-500/20 text-gray-300';
};

const getPriorityIcon = (priority) => {
  const icons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  return icons[priority] || '⚪';
};

export default function ResultCard({ analysis }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullText, setShowFullText] = useState(false);

  if (!analysis) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'risks', label: 'Risk Analysis', icon: '⚠️' },
    { id: 'actions', label: 'Recommendations', icon: '💡' },
    { id: 'details', label: 'Details', icon: '📝' }
  ];

  return (
    <div className="card p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📑 Document Analysis</h2>
        {analysis.documentType && (
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
            {analysis.documentType.replace('_', ' ').toUpperCase()}
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📄 Summary
              </h3>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-200 leading-relaxed">
                  {analysis.summary || 'No summary available'}
                </p>
              </div>
            </div>

            {/* Your Rights & Obligations */}
            <div className="grid md:grid-cols-2 gap-6">
              {analysis.yourRights && analysis.yourRights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-400">
                    ✅ Your Rights
                  </h3>
                  <ul className="space-y-2">
                    {analysis.yourRights.map((right, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-400 mt-1">•</span>
                        <span className="text-gray-200">{right}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.yourObligations && analysis.yourObligations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-400">
                    📝 Your Obligations
                  </h3>
                  <ul className="space-y-2">
                    {analysis.yourObligations.map((obligation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-gray-200">{obligation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Key Terms */}
            {analysis.keyTerms && analysis.keyTerms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  🔑 Key Terms Explained
                </h3>
                <div className="space-y-3">
                  {analysis.keyTerms.map((term, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-300 mb-1">{term.term}</h4>
                      <p className="text-sm text-gray-200 mb-2">{term.explanation}</p>
                      <p className="text-xs text-gray-400 italic">{term.importance}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
            {/* Overall Risk Score */}
            {analysis.riskAssessment && (
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Overall Risk Assessment</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Risk Score:</span>
                    <span className={`text-2xl font-bold ${getRiskColor(analysis.riskAssessment.overallRiskScore)}`}>
                      {analysis.riskAssessment.overallRiskScore}/10
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      analysis.riskAssessment.overallRiskScore <= 3
                        ? 'bg-green-500'
                        : analysis.riskAssessment.overallRiskScore <= 6
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(analysis.riskAssessment.overallRiskScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {analysis.riskAssessment?.riskFactors && analysis.riskAssessment.riskFactors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Specific Risk Factors</h3>
                <div className="space-y-3">
                  {analysis.riskAssessment.riskFactors.map((risk, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-200">{risk.risk}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskBadge(risk.severity)}`}>
                          {risk.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{risk.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags */}
            {analysis.redFlags && analysis.redFlags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
                  🚩 Red Flags
                </h3>
                <div className="space-y-3">
                  {analysis.redFlags.map((flag, index) => (
                    <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-red-200">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getPriorityIcon(rec.priority)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-200">{rec.action}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              rec.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {rec.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {analysis.nextSteps && analysis.nextSteps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Next Steps</h3>
                <div className="space-y-2">
                  {analysis.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-3">
                      <span className="text-blue-400 font-bold text-sm">{index + 1}.</span>
                      <span className="text-gray-200 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* When to Seek Help */}
            {analysis.whenToSeekHelp && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-purple-400 flex items-center gap-2">
                  ⚖️ When to Seek Legal Help
                </h3>
                <p className="text-purple-200 text-sm">{analysis.whenToSeekHelp}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Processing Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-300 mb-1">Document Type</h4>
                <p className="text-sm text-gray-200">{analysis.documentType?.replace('_', ' ') || 'Unknown'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-300 mb-1">Document Size</h4>
                <p className="text-sm text-gray-200">{analysis.documentLength || 0} characters</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-300 mb-1">Processed</h4>
                <p className="text-sm text-gray-200">
                  {analysis.processingTime ? new Date(analysis.processingTime).toLocaleTimeString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Raw Response (for debugging) */}
            {analysis.rawResponse && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Raw AI Response</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-auto max-h-60">
                    {JSON.stringify(analysis, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
