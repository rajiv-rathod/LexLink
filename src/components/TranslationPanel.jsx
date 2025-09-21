import { useState } from 'react';
import { translateText } from '../services/api';
import LanguageSelector from './LanguageSelector';

const TranslationPanel = ({ documentText, documentSummary }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // Default to Hindi
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
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
