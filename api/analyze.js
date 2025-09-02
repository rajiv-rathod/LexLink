const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    const { text, analysisType = 'general' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let prompt = '';
    switch (analysisType) {
      case 'legal':
        prompt = `Analyze this legal document and provide insights about key terms, obligations, and potential risks: ${text}`;
        break;
      case 'contract':
        prompt = `Review this contract and summarize the main clauses, parties involved, and important dates: ${text}`;
        break;
      case 'compliance':
        prompt = `Check this document for compliance issues and regulatory requirements: ${text}`;
        break;
      default:
        prompt = `Provide a comprehensive analysis of this document: ${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    res.status(200).json({
      success: true,
      analysis: analysisText,
      type: analysisType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze document',
      details: error.message
    });
  }
}
