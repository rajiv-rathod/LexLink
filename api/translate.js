const { Translate } = require('@google-cloud/translate').v2;

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
    const { text, targetLanguage = 'hi', sourceLanguage = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // For demo purposes, return a mock translation
    // In production, you would use Google Translate API with proper credentials
    const mockTranslations = {
      'hi': 'यह एक नमूना अनुवाद है।',
      'ta': 'இது ஒரு மாதிரி மொழிபெயர்ப்பு ஆகும்.',
      'te': 'ఇది ఒక నమూనా అనువాదం.',
      'bn': 'এটি একটি নমুনা অনুবাদ।',
      'mr': 'हे एक नमुना भाषांतर आहे।',
      'gu': 'આ એક નમૂનો અનુવાદ છે।',
      'kn': 'ಇದು ಒಂದು ಮಾದರಿ ಅನುವಾದವಾಗಿದೆ.',
      'es': 'Esta es una traducción de muestra.',
      'fr': 'Ceci est un exemple de traduction.',
      'de': 'Dies ist eine Beispielübersetzung.',
      'zh': '这是一个示例翻译。',
      'ja': 'これはサンプル翻訳です。'
    };

    const translatedText = mockTranslations[targetLanguage] || text;

    res.status(200).json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to translate text',
      details: error.message
    });
  }
}
