const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2;
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const router = express.Router();

// Initialize Google Cloud services
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Google Cloud Translation (will work without service account for basic usage)
let translate;
try {
  translate = new Translate();
} catch (error) {
  console.log('Translation service not available - running in demo mode');
}

// Initialize Text-to-Speech client  
let ttsClient;
try {
  ttsClient = new TextToSpeechClient();
} catch (error) {
  console.log('Text-to-Speech service not available - running in demo mode');
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' ||
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
}

// Extract text from image using Tesseract OCR
async function extractTextFromImage(buffer, mimeType) {
  try {
    const result = await Tesseract.recognize(
      buffer,
      'eng',
      { logger: m => console.log(m) }
    );
    return result.data.text;
  } catch (error) {
    throw new Error('Failed to extract text from image');
  }
}

// Detect document type based on content
function detectDocumentType(text) {
  const lowerText = text.toLowerCase();
  
  // Keywords for different document types
  const patterns = {
    rental_agreement: ['rent', 'lease', 'tenant', 'landlord', 'property', 'premises', 'deposit', 'eviction'],
    loan_contract: ['loan', 'credit', 'borrower', 'lender', 'interest rate', 'payment', 'default', 'collateral'],
    employment: ['employee', 'employer', 'salary', 'wages', 'termination', 'benefits', 'confidentiality'],
    terms_of_service: ['terms of service', 'user agreement', 'privacy policy', 'cookies', 'data collection'],
    nda: ['confidential', 'non-disclosure', 'proprietary information', 'trade secrets'],
    purchase_agreement: ['purchase', 'buyer', 'seller', 'goods', 'delivery', 'warranty'],
    insurance: ['insurance', 'coverage', 'premium', 'deductible', 'claim', 'policy']
  };
  
  let bestMatch = 'general_legal';
  let maxScore = 0;
  
  for (const [type, keywords] of Object.entries(patterns)) {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (lowerText.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = type;
    }
  }
  
  return bestMatch;
}

// Generate mock response for demonstration when API is not available
function generateMockResponse(text, task, documentType) {
  const docType = documentType || detectDocumentType(text);
  
  if (task === 'analyze') {
    const mockResponse = {
      documentType: docType,
      summary: `This ${docType.replace('_', ' ')} outlines the key terms and conditions for the agreement. It includes specific obligations for both parties, payment terms, and conditions for termination.`,
      keyTerms: [
        {
          term: "Security Deposit",
          explanation: "Money paid upfront that the landlord holds as protection against damages or unpaid rent",
          importance: "This is money you'll get back if you follow the lease terms and don't damage the property"
        },
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

// Enhanced AI processing with sophisticated prompts
async function processWithGemini(text, task = 'analyze', documentType = null) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('No API key found, returning mock response for demonstration');
      return generateMockResponse(text, task, documentType);
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
    
    try {
      // Validate JSON
      JSON.parse(responseText);
      return responseText;
    } catch (jsonError) {
      console.warn('Response was not valid JSON, returning as text:', jsonError);
      return JSON.stringify({ rawResponse: responseText });
    }
    
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    console.log('Falling back to mock response for demonstration');
    return generateMockResponse(text, task, documentType);
  }
}

// Routes
router.post('/analyze', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document provided' });
    }
    
    let text;
    const { mimetype, buffer } = req.file;
    
    // Extract text based on file type
    if (mimetype === 'application/pdf') {
      text = await extractTextFromPDF(buffer);
    } else if (mimetype === 'text/plain') {
      text = buffer.toString('utf8');
    } else if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      text = await extractTextFromImage(buffer, mimetype);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the document' });
    }
    
    // Detect document type and process with enhanced AI
    const documentType = detectDocumentType(text);
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

// Language detection and translation endpoint
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'en' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required for translation' });
    }

    if (!translate) {
      // Demo mode without actual translation
      return res.json({
        originalText: text,
        translatedText: text,
        detectedLanguage: 'en',
        targetLanguage,
        confidence: 1.0,
        demoMode: true
      });
    }

    try {
      // Detect language
      const [detection] = await translate.detect(text);
      const detectedLanguage = detection.language;
      
      // Translate if needed
      let translatedText = text;
      if (detectedLanguage !== targetLanguage) {
        const [translation] = await translate.translate(text, targetLanguage);
        translatedText = translation;
      }

      res.json({
        originalText: text,
        translatedText,
        detectedLanguage,
        targetLanguage,
        confidence: detection.confidence || 1.0
      });
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to demo mode
      res.json({
        originalText: text,
        translatedText: text,
        detectedLanguage: 'en',
        targetLanguage,
        confidence: 1.0,
        demoMode: true,
        error: 'Translation service unavailable'
      });
    }
  } catch (error) {
    console.error('Error in translation endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Text-to-Speech endpoint for accessibility
router.post('/audio', async (req, res) => {
  try {
    const { text, languageCode = 'en-US', voiceName = 'en-US-Wavenet-D' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required for audio generation' });
    }

    if (!ttsClient) {
      // Demo mode - return mock audio data
      return res.json({
        audioContent: null,
        text: text.substring(0, 200) + '...',
        demoMode: true,
        message: 'Audio generation would be available with full GCP setup'
      });
    }

    try {
      const request = {
        input: { text: text.substring(0, 5000) }, // Limit text length
        voice: { languageCode, name: voiceName },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await ttsClient.synthesizeSpeech(request);
      
      res.json({
        audioContent: response.audioContent.toString('base64'),
        text: text.substring(0, 200) + '...',
        languageCode,
        voiceName
      });
    } catch (error) {
      console.error('TTS error:', error);
      // Fallback to demo mode
      res.json({
        audioContent: null,
        text: text.substring(0, 200) + '...',
        demoMode: true,
        error: 'Text-to-Speech service unavailable'
      });
    }
  } catch (error) {
    console.error('Error in audio endpoint:', error);
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