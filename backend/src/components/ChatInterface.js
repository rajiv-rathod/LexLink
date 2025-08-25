import React, { useState } from 'react';

const ChatInterface = ({ onAskQuestion }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    const userMessage = message;
    setMessage('');
    
    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await onAskQuestion(userMessage);
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      setConversation(prev => [...prev, { type: 'ai', content: 'Sorry, I encountered an error processing your question.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <h3>Ask Questions About Your Document</h3>
      
      <div className="chat-messages">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about your document..."
          disabled={loading}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={loading || !message.trim()}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
