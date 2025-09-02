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

    // Mock translations for different languages
    const mockTranslations = {
      'hi': 'यह एक कानूनी दस्तावेज़ विश्लेषण है जो मुख्य शर्तों और जोखिमों की पहचान करता है।',
      'ta': 'இது முக்கிய நிபந்தனைகள் மற்றும் அபாயங்களை அடையாளம் காணும் ஒரு சட்ட ஆவண பகுப்பாய்வு ஆகும்.',
      'te': 'ఇది ముఖ్య నిబంధనలు మరియు ప్రమాదాలను గుర్తించే ఒక చట్టపరమైన పత్రం విశ్లేషణ.',
      'bn': 'এটি একটি আইনি নথি বিশ্লেষণ যা মূল শর্তাবলী এবং ঝুঁকি চিহ্নিত করে।',
      'mr': 'हे एक कायदेशीर दस्तऐवज विश्लेषण आहे जे मुख्य अटी आणि जोखीम ओळखते।',
      'gu': 'આ એક કાનૂની દસ્તાવેજ વિશ્લેષણ છે જે મુખ્ય શરતો અને જોખમોને ઓળખે છે.',
      'kn': 'ಇದು ಮುಖ್ಯ ನಿಯಮಗಳು ಮತ್ತು ಅಪಾಯಗಳನ್ನು ಗುರುತಿಸುವ ಕಾನೂನು ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆಯಾಗಿದೆ.',
      'es': 'Este es un análisis de documento legal que identifica términos clave y riesgos.',
      'fr': 'Il s\'agit d\'une analyse de document juridique qui identifie les termes clés et les risques.',
      'de': 'Dies ist eine Analyse eines Rechtsdokuments, die Schlüsselbegriffe und Risiken identifiziert.',
      'zh': '这是一个法律文件分析，识别关键条款和风险。',
      'ja': 'これは主要な条項とリスクを特定する法的文書分析です。'
    };

    const translatedText = mockTranslations[targetLanguage] || `[${targetLanguage.toUpperCase()}] ${text}`;

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
