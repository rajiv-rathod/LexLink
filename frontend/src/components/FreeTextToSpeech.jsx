import React, { useState } from 'react';

const FreeTextToSpeech = ({ text, language = 'en-US' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech not supported in this browser');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = language;
      
      // Configure speech parameters
      utterance.rate = 0.9;  // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setError('');
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        setError(`Speech error: ${event.error}`);
      };

      // Find and use the best voice for the language
      const voices = speechSynthesis.getVoices();
      const bestVoice = voices.find(voice => 
        voice.lang.startsWith(language.split('-')[0])
      );
      
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      speechSynthesis.speak(utterance);
    } catch (err) {
      setError('Failed to start speech synthesis');
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isPlaying ? stopSpeech : speakText}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          isPlaying 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        disabled={!text}
      >
        {isPlaying ? (
          <div className="flex items-center gap-1">
            <span>⏹️</span>
            <span>Stop</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span>🔊</span>
            <span>Listen</span>
          </div>
        )}
      </button>
      
      {error && (
        <span className="text-red-400 text-xs">{error}</span>
      )}
      
      {isPlaying && (
        <span className="text-blue-400 text-xs animate-pulse">Speaking...</span>
      )}
    </div>
  );
};

export default FreeTextToSpeech;
