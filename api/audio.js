export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, languageCode = 'en-US' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for audio generation' });
    }

    // Language code mapping for Web Speech API
    const speechLanguageCodes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'ur': 'ur-IN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA'
    };

    const mappedLanguageCode = speechLanguageCodes[languageCode] || languageCode;

    // Generate free audio response using Web Speech API instructions
    const audioResponse = {
      text: text,
      languageCode: mappedLanguageCode,
      audioContent: null, // Will be generated on frontend using Web Speech API
      service: 'web-speech-api',
      instructions: 'Use the Web Speech API in your browser to play this text',
      webSpeechCode: `
// Frontend JavaScript code to use:
const utterance = new SpeechSynthesisUtterance("${text.replace(/"/g, '\\"')}");
utterance.lang = "${mappedLanguageCode}";
utterance.rate = 0.9; // Slightly slower for legal content
utterance.pitch = 1.0;
utterance.volume = 1.0;

// Optional: Add event listeners
utterance.onstart = () => console.log('Speech started');
utterance.onend = () => console.log('Speech ended');
utterance.onerror = (e) => console.error('Speech error:', e);

// Play the audio
speechSynthesis.speak(utterance);`,
      
      // Additional instructions for better UX
      frontendInstructions: {
        setup: "Check if browser supports speechSynthesis API",
        usage: "Call speechSynthesis.speak(utterance) to play audio",
        fallback: "Show text content if speech synthesis is not available",
        bestPractices: [
          "Check speechSynthesis.speaking before starting new speech",
          "Provide pause/resume controls for longer text",
          "Handle interruptions gracefully",
          "Test across different browsers for voice availability"
        ]
      },
      
      supportedLanguages: Object.keys(speechLanguageCodes),
      browserCompatibility: {
        chrome: "Full support",
        firefox: "Good support",
        safari: "Good support", 
        edge: "Full support",
        mobile: "Varies by platform"
      }
    };

    res.status(200).json({
      success: true,
      ...audioResponse,
      timestamp: new Date().toISOString(),
      note: "This endpoint provides Web Speech API integration for free text-to-speech functionality"
    });

  } catch (error) {
    console.error('Audio endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate audio instructions',
      details: error.message
    });
  }
}