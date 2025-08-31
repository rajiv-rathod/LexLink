import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function ChatInterface({ analysis }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { type: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          documentText: JSON.stringify(analysis)
        })
      });

      if (!response.ok) throw new Error('Failed to get answer');
      
      const data = await response.json();
      
      const aiMessage = {
        type: 'ai',
        content: data.answer || data.explanation || 'I apologize, but I couldn\'t provide an answer.',
        data: data,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const suggestedQuestions = [
    "What are the main risks in this document?",
    "What should I be most careful about?",
    "Can I terminate this agreement early?",
    "What are my financial obligations?",
    "What happens if I don't comply?",
    "Are there any hidden fees or costs?",
    "What are my rights under this agreement?",
    "Is this document fair and balanced?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  if (!analysis) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">💬</span>
        <h2 className="text-2xl font-bold">Ask Questions About Your Document</h2>
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Suggested Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/10 hover:border-white/20"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : message.type === 'error'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-white/10 text-gray-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">
                  {message.type === 'user' ? '👤' : message.type === 'error' ? '❌' : '🤖'}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {/* Enhanced AI response data */}
                  {message.type === 'ai' && message.data && (
                    <div className="mt-3 space-y-2">
                      {message.data.relevantClauses && (
                        <div className="text-xs bg-white/5 rounded-lg p-2">
                          <strong>Relevant sections:</strong> {message.data.relevantClauses}
                        </div>
                      )}
                      
                      {message.data.additionalConsiderations && (
                        <div className="text-xs bg-blue-500/10 rounded-lg p-2">
                          <strong>Also consider:</strong> {message.data.additionalConsiderations}
                        </div>
                      )}
                      
                      {message.data.followUpQuestions && message.data.followUpQuestions.length > 0 && (
                        <div className="text-xs">
                          <strong>Related questions you might ask:</strong>
                          <ul className="mt-1 space-y-1">
                            {message.data.followUpQuestions.map((q, i) => (
                              <li key={i}>
                                <button
                                  onClick={() => handleSuggestedQuestion(q)}
                                  className="text-indigo-300 hover:text-indigo-200 underline"
                                >
                                  {q}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-4 rounded-2xl max-w-[80%]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your document..."
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:bg-white/15"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}