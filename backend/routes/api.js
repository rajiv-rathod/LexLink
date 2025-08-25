const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// Process document with Gemini AI
async function processWithGemini(text, task = 'summarize') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let prompt;
    switch(task) {
      case 'summarize':
        prompt = `Please analyze this legal document and provide a comprehensive yet simple summary in plain language that a non-lawyer can understand. Focus on the key terms, obligations, rights, and potential risks. Format the response in JSON with these fields: summary, keyPoints (array), potentialRisks (array), and recommendations (array). Document: ${text.substring(0, 30000)}`; // Limit text length
        break;
      case 'explain_clause':
        prompt = `Explain this legal clause in simple, plain language. Break down any complex terms and highlight any important implications or obligations: ${text}`;
        break;
      case 'qa':
        prompt = `Based on this legal document, answer the following question in simple terms: ${text}`;
        break;
      default:
        prompt = `Please analyze this legal document: ${text}`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw new Error('Failed to process document with AI');
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
    
    // Process with Gemini AI
    const result = await processWithGemini(text);
    
    // Try to parse JSON response, otherwise return as is
    try {
      const parsedResult = JSON.parse(result);
      res.json({...parsedResult, fullText: text.substring(0, 5000)}); // Return limited text for Q&A
    } catch (e) {
      res.json({ summary: result, fullText: text.substring(0, 5000) });
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
    res.json({ explanation });
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
    
    const qaText = `Document: ${documentText}\n\nQuestion: ${question}`;
    const answer = await processWithGemini(qaText, 'qa');
    res.json({ answer });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LexLink API is running' });
});

module.exports = router;