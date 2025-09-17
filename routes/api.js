const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
// Removed Google Cloud dependencies - using free alternatives
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const router = express.Router();

// Initialize Google Cloud services
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, text, and image files are allowed.'));
    }
  }
});

// Error handler for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
};

// Text extraction functions
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

async function extractTextFromImage(buffer, mimetype) {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    return text;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to extract text from image');
  }
}

// Document type detection
function detectDocumentType(text) {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('lease') || textLower.includes('rental') || textLower.includes('tenant')) {
    return 'lease_agreement';
  } else if (textLower.includes('employment') || textLower.includes('employee') || textLower.includes('employer')) {
    return 'employment_contract';
  } else if (textLower.includes('nda') || textLower.includes('non-disclosure') || textLower.includes('confidential')) {
    return 'nda';
  } else if (textLower.includes('service') || textLower.includes('provider') || textLower.includes('client')) {
    return 'service_agreement';
  } else if (textLower.includes('purchase') || textLower.includes('sale') || textLower.includes('buyer') || textLower.includes('seller')) {
    return 'purchase_agreement';
  } else if (textLower.includes('loan') || textLower.includes('credit') || textLower.includes('borrower')) {
    return 'loan_agreement';
  } else {
    return 'legal_document';
  }
}

// Generate mock responses for demonstration
function generateMockResponse(text, task, documentType) {
  if (task === 'analyze' && documentType === 'lease_agreement') {
    const mockResponse = {
      documentType: "lease_agreement",
      summary: "This is a residential lease agreement for a one-bedroom apartment with monthly rent of $1,500. The lease includes standard terms but has some strict policies around pets and late payments that tenants should be aware of.",
      keyTerms: [
        {
          term: "Late Fees", 
          explanation: "Extra charges applied when rent is paid after the due date",
          importance: "These can add up quickly and affect your credit if unpaid"
        }
      ],
      yourRights: [
        "Right to peaceful enjoyment of the property",
        "Right to have major repairs handled by the landlord", 
        "Right to get your security deposit back if you meet lease terms"
      ],
      yourObligations: [
        "Pay rent on time ($1,500 monthly by the 1st)",
        "Provide 30 days notice before moving out",
        "Handle minor repairs under $100",
        "No pets without written permission"
      ],
      riskAssessment: {
        overallRiskScore: 6,
        riskFactors: [
          {
            risk: "Immediate lease termination for lease violations",
            severity: "high",
            explanation: "The landlord can terminate your lease with just 3 days notice for non-payment or violations, which could leave you homeless quickly"
          },
          {
            risk: "No pet policy strictly enforced",
            severity: "medium",
            explanation: "Unauthorized pets result in immediate termination, no warnings given"
          },
          {
            risk: "High late fees",
            severity: "medium", 
            explanation: "$50 late fee after just 5 days could add up to significant costs over time"
          }
        ]
      },
      redFlags: [
        "Very short 3-day notice for lease termination seems harsh",
        "No grace period for late payments - fees start immediately after 5 days",
        "Immediate termination for pets with no warning period"
      ],
      recommendations: [
        {
          action: "Set up automatic rent payments",
          priority: "high",
          reason: "Late fees start quickly and lease can be terminated for non-payment"
        },
        {
          action: "Document existing damages before moving in",
          priority: "high",
          reason: "Protect your security deposit by having proof of pre-existing issues"
        },
        {
          action: "Get renter's insurance",
          priority: "medium",
          reason: "Protect your belongings since landlord insurance won't cover your property"
        }
      ],
      nextSteps: [
        "Read the lease carefully before signing",
        "Take photos of the property condition", 
        "Set up automatic rent payments",
        "Ask about any unclear terms before signing"
      ],
      whenToSeekHelp: "Consider consulting a tenant's rights lawyer if you're unclear about any terms, if the landlord tries to change terms after signing, or if you face eviction proceedings."
    };
    
    return JSON.stringify(mockResponse);
  }
  
  // Return simple mock for other tasks
  return JSON.stringify({
    response: "Mock response for demonstration purposes. Please configure GEMINI_API_KEY for full functionality."
  });
}

// Free translation function using Gemini AI as translator
async function translateTextFree(text, targetLanguage) {
  try {
    // If we don't have Gemini API key, return mock response
    if (!process.env.GEMINI_API_KEY) {
      return {
        originalText: text,
        translatedText: `[MOCK TRANSLATION to ${targetLanguage}] ${text}`,
        service: 'mock',
        confidence: 1.0
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, no explanations:

Text to translate: ${text}

Translated text:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    return {
      originalText: text,
      translatedText: translatedText,
      service: 'gemini-ai',
      confidence: 0.9
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to mock response
    return {
      originalText: text,
      translatedText: `[TRANSLATION ERROR - showing original] ${text}`,
      service: 'fallback',
      confidence: 0.1
    };
  }
}

// Free audio response function for Web Speech API
function generateFreeAudioResponse(text, languageCode) {
  return {
    text: text,
    languageCode: languageCode,
    audioContent: null, // Will be generated on frontend using Web Speech API
    service: 'web-speech-api',
    instructions: 'Use the Web Speech API in your browser to play this text',
    webSpeechCode: `
// Frontend JavaScript code to use:
const utterance = new SpeechSynthesisUtterance("${text.replace(/"/g, '\\"')}");
utterance.lang = "${languageCode}";
speechSynthesis.speak(utterance);
    `
  };
}

// Enhanced AI processing with sophisticated prompts
async function processWithGemini(text, task = 'analyze', documentType = null) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('No API key found, returning mock response for demonstration');
      return generateMockResponse(text, task, documentType);
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const docType = documentType || detectDocumentType(text);
    const limitedText = text.substring(0, 30000); // Limit text length for API
    
    let prompt;
    switch(task) {
      case 'analyze':
        prompt = `As an expert legal analyst, analyze this ${docType.replace('_', ' ')} document and provide a comprehensive assessment in JSON format.

Document Type: ${docType}
Document Content: ${limitedText}

Provide your analysis in this exact JSON structure:
{
  "documentType": "${docType}",
  "summary": "A clear 2-3 sentence summary in plain English",
  "keyTerms": [
    {
      "term": "Legal term or concept",
      "explanation": "Simple explanation in everyday language",
      "importance": "Why this matters to the user"
    }
  ],
  "yourRights": [
    "List of rights the user has"
  ],
  "yourObligations": [
    "List of things the user must do"
  ],
  "riskAssessment": {
    "overallRiskScore": 1-10,
    "riskFactors": [
      {
        "risk": "Description of specific risk",
        "severity": "low|medium|high",
        "explanation": "Why this is risky and potential consequences"
      }
    ]
  },
  "redFlags": [
    "Specific concerning clauses or terms that need attention"
  ],
  "recommendations": [
    {
      "action": "Specific action to take",
      "priority": "high|medium|low",
      "reason": "Why this action is recommended"
    }
  ],
  "nextSteps": [
    "Immediate actions the user should consider"
  ],
  "whenToSeekHelp": "Specific situations when legal consultation is recommended"
}

Focus on practical implications and use language a non-lawyer can understand. Be specific about risks and actionable in recommendations.`;
        break;
        
      case 'explain_clause':
        prompt = `As a legal expert, explain this specific clause in simple terms:

"${text}"

Provide a JSON response with:
{
  "plainEnglish": "What this clause means in everyday language",
  "implications": "What this means for the user specifically",
  "risks": "Potential risks or downsides",
  "benefits": "Potential benefits or protections",
  "redFlags": "Any concerning aspects",
  "commonScenarios": "Real-world examples of when this might matter"
}`;
        break;
        
      case 'qa':
        prompt = `Based on this legal document, answer the user's question in simple, practical terms:

Document: ${limitedText}

Question: ${text}

Provide a JSON response with:
{
  "answer": "Direct answer to the question",
  "explanation": "Detailed explanation with context",
  "relevantClauses": "Which parts of the document relate to this question",
  "additionalConsiderations": "Other things the user should know",
  "followUpQuestions": ["Suggested related questions they might want to ask"]
}`;
        break;
        
      default:
        prompt = `Analyze this legal document and provide a basic summary: ${limitedText}`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean up response to ensure valid JSON
    responseText = responseText.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
    
    // Try to extract JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }
    
    try {
      // Validate JSON
      JSON.parse(responseText);
      return responseText;
    } catch (jsonError) {
      console.warn('Response was not valid JSON, returning as text:', jsonError);
      console.log('Original response:', responseText);
      return JSON.stringify({ rawResponse: responseText });
    }
    
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    console.log('Falling back to mock response for demonstration');
    return generateMockResponse(text, task, documentType);
  }
}

// Routes
router.post('/analyze', upload.single('document'), handleUploadError, async (req, res) => {
  try {
    console.log('Received analyze request');
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No document provided' });
    }
    
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    let text;
    const { mimetype, buffer } = req.file;
    
    // Extract text based on file type
    if (mimetype === 'application/pdf') {
      console.log('Processing PDF file');
      text = await extractTextFromPDF(buffer);
    } else if (mimetype === 'text/plain') {
      console.log('Processing text file');
      text = buffer.toString('utf8');
    } else if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      console.log('Processing image file');
      text = await extractTextFromImage(buffer, mimetype);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    
    if (!text || text.trim().length === 0) {
      console.log('No text extracted from document');
      return res.status(400).json({ error: 'No text could be extracted from the document' });
    }
    
    console.log('Extracted text length:', text.length);
    
    // Detect document type and process with enhanced AI
    const documentType = detectDocumentType(text);
    console.log('Detected document type:', documentType);
    
    const result = await processWithGemini(text, 'analyze', documentType);
    
    // Parse and return structured response
    try {
      const parsedResult = JSON.parse(result);
      res.json({
        ...parsedResult,
        documentLength: text.length,
        processingTime: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to parse AI response as JSON, returning raw text');
      res.json({ 
        summary: result, 
        documentType,
        documentLength: text.length,
        processingTime: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/explain', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    
    const explanation = await processWithGemini(text, 'explain_clause');
    
    try {
      const parsedExplanation = JSON.parse(explanation);
      res.json(parsedExplanation);
    } catch (e) {
      res.json({ explanation });
    }
  } catch (error) {
    console.error('Error explaining clause:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { question, documentText } = req.body;
    
    if (!question || !documentText) {
      return res.status(400).json({ error: 'Question and document text are required' });
    }
    
    const qaText = `Question: ${question}\n\nDocument: ${documentText}`;
    const answer = await processWithGemini(qaText, 'qa');
    
    try {
      const parsedAnswer = JSON.parse(answer);
      res.json(parsedAnswer);
    } catch (e) {
      res.json({ answer });
    }
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== NEW GCP-POWERED FEATURES =====

// Supported languages with Indian regional languages
const SUPPORTED_LANGUAGES = {
  // English & European
  'en': { name: 'English', voice: 'en-US-Wavenet-D' },
  'es': { name: 'Spanish', voice: 'es-ES-Wavenet-A' },
  'fr': { name: 'French', voice: 'fr-FR-Wavenet-A' },
  'de': { name: 'German', voice: 'de-DE-Wavenet-A' },
  'it': { name: 'Italian', voice: 'it-IT-Wavenet-A' },
  'pt': { name: 'Portuguese', voice: 'pt-BR-Wavenet-A' },
  'ru': { name: 'Russian', voice: 'ru-RU-Wavenet-A' },
  
  // Indian Regional Languages
  'hi': { name: 'Hindi (हिंदी)', voice: 'hi-IN-Wavenet-A' },
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

// Get supported languages endpoint
router.get('/languages', (req, res) => {
  res.json({
    languages: SUPPORTED_LANGUAGES,
    total: Object.keys(SUPPORTED_LANGUAGES).length
  });
});

// Language detection and translation endpoint (FREE VERSION)
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'en' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required for translation' });
    }

    // Map target language to supported codes
    const languageMap = {
      'hi': 'hi',      // Hindi
      'bn': 'bn',      // Bengali  
      'te': 'te',      // Telugu
      'mr': 'mr',      // Marathi
      'ta': 'ta',      // Tamil
      'gu': 'gu',      // Gujarati
      'kn': 'kn',      // Kannada
      'ml': 'ml',      // Malayalam
      'pa': 'pa',      // Punjabi
      'or': 'or',      // Odia
      'as': 'as',      // Assamese
      'ur': 'ur',      // Urdu
      'ne': 'ne',      // Nepali
      'es': 'es',      // Spanish
      'fr': 'fr',      // French
      'de': 'de',      // German
      'it': 'it',      // Italian
      'pt': 'pt',      // Portuguese
      'ru': 'ru',      // Russian
      'ja': 'ja',      // Japanese
      'ko': 'ko',      // Korean
      'zh': 'zh-cn',   // Chinese
      'ar': 'ar',      // Arabic
      'en': 'en'       // English
    };

    const mappedLanguage = languageMap[targetLanguage] || targetLanguage;

    try {
      const result = await translateTextFree(text, mappedLanguage);
      res.json({
        originalText: result.originalText,
        translatedText: result.translatedText,
        targetLanguage: mappedLanguage,
        service: result.service,
        supportedLanguages: Object.keys(languageMap),
        isFree: true
      });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ 
        error: 'Translation failed',
        fallback: text,
        message: 'Using original text as fallback'
      });
    }
  } catch (error) {
    console.error('Translation endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Text-to-Speech endpoint (FREE VERSION using Web Speech API)
router.post('/audio', async (req, res) => {
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
    const audioResponse = generateFreeAudioResponse(text, mappedLanguageCode);

    res.json({
      ...audioResponse,
      isFree: true,
      instructions: 'Audio will be generated using browser Web Speech API',
      supportedLanguages: Object.keys(speechLanguageCodes)
    });

  } catch (error) {
    console.error('Audio generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Document compliance check endpoint
router.post('/compliance', async (req, res) => {
  try {
    const { documentText, documentType, jurisdiction = 'US' } = req.body;
    
    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required for compliance check' });
    }

    // Enhanced prompt for compliance checking
    const compliancePrompt = `As a legal compliance expert, analyze this ${documentType || 'legal document'} for compliance with ${jurisdiction} regulations and industry standards.

Document Content: ${documentText.substring(0, 10000)}

Provide a detailed compliance analysis in JSON format:
{
  "complianceScore": 1-10,
  "overallStatus": "compliant|non-compliant|needs-review",
  "regulatoryIssues": [
    {
      "regulation": "Specific regulation name",
      "issue": "Description of compliance issue",
      "severity": "critical|high|medium|low",
      "recommendation": "How to fix this issue"
    }
  ],
  "industryStandards": {
    "score": 1-10,
    "comparison": "How this document compares to industry standards",
    "improvements": ["List of suggested improvements"]
  },
  "legalRisks": [
    {
      "risk": "Description of legal risk",
      "likelihood": "high|medium|low", 
      "impact": "severe|moderate|minor",
      "mitigation": "How to reduce this risk"
    }
  ],
  "recommendations": {
    "immediate": ["Critical actions needed now"],
    "shortTerm": ["Actions needed within 30 days"],
    "longTerm": ["Strategic improvements for future"]
  }
}`;

    const complianceResult = await processWithGemini(compliancePrompt, 'compliance_check');
    
    try {
      const parsedResult = JSON.parse(complianceResult);
      res.json(parsedResult);
    } catch (e) {
      res.json({ 
        complianceScore: 7,
        overallStatus: 'needs-review',
        rawResponse: complianceResult,
        error: 'Could not parse compliance analysis'
      });
    }
  } catch (error) {
    console.error('Error in compliance check:', error);
    res.status(500).json({ error: error.message });
  }
});

// Document benchmarking endpoint
router.post('/benchmark', async (req, res) => {
  try {
    const { documentText, documentType, industry = 'general' } = req.body;
    
    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required for benchmarking' });
    }

    // Enhanced prompt for document benchmarking
    const benchmarkPrompt = `As a legal document analyst, compare this ${documentType || 'legal document'} against industry standards and typical documents in the ${industry} sector.

Document Content: ${documentText.substring(0, 10000)}

Provide a comprehensive benchmark analysis in JSON format:
{
  "overallRating": 1-10,
  "industryComparison": {
    "score": 1-10,
    "percentile": "What percentile this document ranks in (e.g., 75th percentile)",
    "summary": "How this compares to typical industry documents"
  },
  "fairnessScore": {
    "overall": 1-10,
    "toTenant": 1-10,
    "toLandlord": 1-10,
    "balance": "balanced|favors-landlord|favors-tenant"
  },
  "marketStandards": {
    "rentAmount": "above-market|market-rate|below-market",
    "securityDeposit": "standard|high|low",
    "leaseTerm": "typical|long|short",
    "policies": "strict|standard|lenient"
  },
  "unusualClauses": [
    {
      "clause": "Description of unusual clause",
      "rarity": "very-rare|uncommon|somewhat-common",
      "impact": "positive|negative|neutral",
      "explanation": "Why this is unusual and what it means"
    }
  ],
  "improvements": [
    {
      "area": "What could be improved",
      "current": "How it is now", 
      "suggested": "How it should be",
      "benefit": "Why this improvement helps"
    }
  ],
  "redFlags": [
    "List of concerning provisions that are unusual or unfair"
  ]
}`;

    const benchmarkResult = await processWithGemini(benchmarkPrompt, 'benchmark');
    
    try {
      const parsedResult = JSON.parse(benchmarkResult);
      res.json(parsedResult);
    } catch (e) {
      res.json({ 
        overallRating: 6,
        rawResponse: benchmarkResult,
        error: 'Could not parse benchmark analysis'
      });
    }
  } catch (error) {
    console.error('Error in benchmark analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LexLink API is running' });
});

module.exports = router;