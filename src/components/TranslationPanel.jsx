import { useState } from 'react';
import { translateText, generateAudio } from '../services/api';
import LanguageSelector from './LanguageSelector';

const TranslationPanel = ({ documentText, documentSummary }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // Default to Hindi
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!documentSummary && !documentText) {
      setError('No document text available for translation');
      return;
    }

    const textToTranslate = documentSummary || documentText.substring(0, 1000);
    
    setIsTranslating(true);
    setError('');
    
    try {
      const result = await translateText(textToTranslate, selectedLanguage);
      setTranslatedText(result.translatedText);
      
      if (result.demoMode) {
        setError('Translation service in demo mode. Full translation requires Google Cloud setup.');
      }
    } catch (err) {
      setError(err.message || 'Translation failed');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateAudio = async () => {
    const textForAudio = translatedText || documentSummary || documentText.substring(0, 500);
    
    if (!textForAudio) {
      setError('No text available for audio generation');
      return;
    }

    setIsGeneratingAudio(true);
    setError('');
    
    try {
      const result = await generateAudio(textForAudio, selectedLanguage);
      
      if (result.audioContent) {
        // Create audio blob from base64
        const audioBlob = new Blob(
          [Uint8Array.from(atob(result.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } else if (result.demoMode) {
        setError('Audio generation in demo mode. Full TTS requires Google Cloud setup.');
      }
    } catch (err) {
      setError(err.message || 'Audio generation failed');
      console.error('Audio generation error:', err);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xl">🌍</span>
        <h3 className="text-xl font-bold">Translation & Voice</h3>
      </div>

      {/* Language Selector */}
      <LanguageSelector 
        currentLanguage={selectedLanguage} 
        onLanguageChange={setSelectedLanguage} 
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="btn btn-secondary flex items-center gap-2"
        >
          {isTranslating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Translating...</span>
            </>
          ) : (
            <>
              <span>🔤</span>
              <span>Translate Summary</span>
            </>
          )}
        </button>

        <button
          onClick={handleGenerateAudio}
          disabled={isGeneratingAudio || (!translatedText && !documentSummary)}
          className="btn btn-secondary flex items-center gap-2"
        >
          {isGeneratingAudio ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>🔊</span>
              <span>Generate Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Translated Text */}
      {translatedText && (
        <div className="space-y-3">
          <h4 className="font-semibold text-indigo-300">Translated Summary:</h4>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-200 leading-relaxed">{translatedText}</p>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <div className="space-y-3">
          <h4 className="font-semibold text-indigo-300">Audio Playback:</h4>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <p className="text-sm text-gray-400 mt-2">
              🎵 Audio generated in {selectedLanguage.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {/* Feature Info */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
        <h4 className="font-semibold text-indigo-300 mb-2">🌟 Supported Indian Languages:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
          <div>• Hindi (हिंदी)</div>
          <div>• Bengali (বাংলা)</div>
          <div>• Telugu (తెలుగు)</div>
          <div>• Tamil (தமிழ்)</div>
          <div>• Marathi (मराठी)</div>
          <div>• Gujarati (ગુજરાતી)</div>
          <div>• Kannada (ಕನ್ನಡ)</div>
          <div>• Malayalam (മലയാളം)</div>
          <div>• Punjabi (ਪੰਜਾਬੀ)</div>
          <div>• Urdu (اردو)</div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPanel;
