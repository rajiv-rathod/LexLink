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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Supported languages with Indian regional languages and international languages
    const SUPPORTED_LANGUAGES = {
      // English & European
      'en': { name: 'English', voice: 'en-US-Wavenet-D' },
      'es': { name: 'Spanish (Español)', voice: 'es-ES-Wavenet-B' },
      'fr': { name: 'French (Français)', voice: 'fr-FR-Wavenet-A' },
      'de': { name: 'German (Deutsch)', voice: 'de-DE-Wavenet-A' },
      'it': { name: 'Italian (Italiano)', voice: 'it-IT-Wavenet-A' },
      'pt': { name: 'Portuguese (Português)', voice: 'pt-BR-Wavenet-A' },
      'ru': { name: 'Russian (Русский)', voice: 'ru-RU-Wavenet-A' },
      'nl': { name: 'Dutch (Nederlands)', voice: 'nl-NL-Wavenet-A' },
      
      // Indian Languages
      'hi': { name: 'Hindi (हिन्दी)', voice: 'hi-IN-Wavenet-A' },
      'bn': { name: 'Bengali (বাংলা)', voice: 'bn-IN-Wavenet-A' },
      'te': { name: 'Telugu (తెలుగు)', voice: 'te-IN-Standard-A' },
      'mr': { name: 'Marathi (मराठी)', voice: 'mr-IN-Wavenet-A' },
      'ta': { name: 'Tamil (தமிழ்)', voice: 'ta-IN-Wavenet-A' },
      'ur': { name: 'Urdu (اردو)', voice: 'ur-IN-Wavenet-A' },
      'gu': { name: 'Gujarati (ગુજરાતી)', voice: 'gu-IN-Wavenet-A' },
      'kn': { name: 'Kannada (ಕನ್ನಡ)', voice: 'kn-IN-Wavenet-A' },
      'ml': { name: 'Malayalam (മലയാളം)', voice: 'ml-IN-Wavenet-A' },
      'pa': { name: 'Punjabi (ਪੰਜਾਬੀ)', voice: 'pa-IN-Wavenet-A' },
      'or': { name: 'Odia (ଓଡ଼ିଆ)', voice: 'or-IN-Standard-A' },
      'as': { name: 'Assamese (অসমীয়া)', voice: 'as-IN-Standard-A' },
      
      // Other Asian Languages
      'zh': { name: 'Chinese (中文)', voice: 'zh-CN-Wavenet-A' },
      'ja': { name: 'Japanese (日本語)', voice: 'ja-JP-Wavenet-A' },
      'ko': { name: 'Korean (한국어)', voice: 'ko-KR-Wavenet-A' },
      'th': { name: 'Thai (ไทย)', voice: 'th-TH-Standard-A' },
      'vi': { name: 'Vietnamese (Tiếng Việt)', voice: 'vi-VN-Wavenet-A' },
      'ar': { name: 'Arabic (العربية)', voice: 'ar-XA-Wavenet-A' }
    };

    res.status(200).json({
      success: true,
      languages: SUPPORTED_LANGUAGES,
      total: Object.keys(SUPPORTED_LANGUAGES).length,
      categories: {
        european: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'],
        indian: ['hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml', 'pa', 'or', 'as'],
        asian: ['zh', 'ja', 'ko', 'th', 'vi'],
        other: ['ar']
      },
      features: {
        translation: true,
        textToSpeech: true,
        webSpeechAPI: true,
        aiPowered: Boolean(process.env.GEMINI_API_KEY)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Languages endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve supported languages',
      details: error.message
    });
  }
}