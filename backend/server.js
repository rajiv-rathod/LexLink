const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists (in case you want to save later)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer with memory storage (so req.file.buffer is available)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
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
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
}

// Analyze text content
function analyzeContent(text, filename) {
  const wordCount = text.split(/\s+/).length;
  const charCount = text.length;
  const lineCount = text.split('\n').length;
  
  let docType = 'Unknown';
  if (text.toLowerCase().includes('resume') || text.toLowerCase().includes('cv') || 
      text.toLowerCase().includes('experience') || text.toLowerCase().includes('education')) {
    docType = 'Resume/CV';
  } else if (text.toLowerCase().includes('contract') || text.toLowerCase().includes('agreement') ||
             text.toLowerCase().includes('terms') || text.toLowerCase().includes('condition')) {
    docType = 'Contract';
  } else if (text.toLowerCase().includes('invoice') || text.toLowerCase().includes('bill') ||
             text.toLowerCase().includes('payment')) {
    docType = 'Invoice';
  }

  const containsPersonalInfo = text.toLowerCase().includes('email') || 
                              text.toLowerCase().includes('phone') ||
                              text.toLowerCase().includes('address');
  
  const containsDates = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(text);
  const containsNumbers = /\d+/.test(text);

  return {
    wordCount,
    charCount,
    lineCount,
    docType,
    containsPersonalInfo,
    containsDates,
    containsNumbers,
    preview: text.substring(0, 500) + (text.length > 500 ? '...' : '')
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LexLink backend is running!',
    timestamp: new Date().toISOString()
  });
});

// File upload and analysis endpoint
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    console.log('Request received for file upload');
    
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', req.file.originalname);

    let textContent = '';
    
    if (req.file.mimetype === 'application/pdf') {
      textContent = await extractTextFromPDF(req.file.buffer);
      console.log('PDF text extracted, length:', textContent.length);
    } else if (req.file.mimetype === 'text/plain') {
      textContent = req.file.buffer.toString('utf8');
    } else {
      textContent = 'Image content analysis requires OCR integration';
    }

    const analysis = analyzeContent(textContent, req.file.originalname);

    const analysisResult = {
      success: true,
      message: 'Document analyzed successfully!',
      document: {
        filename: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        uploadDate: new Date().toISOString()
      },
      contentAnalysis: analysis,
      insights: {
        summary: `This ${req.file.mimetype} document appears to be a ${analysis.docType}. It contains ${analysis.wordCount} words and ${analysis.lineCount} lines.`,
        keyPoints: [
          `Document type: ${analysis.docType}`,
          `Word count: ${analysis.wordCount} words`,
          `Character count: ${analysis.charCount} characters`,
          analysis.containsPersonalInfo ? 'Contains potential personal information' : 'No obvious personal information detected',
          analysis.containsDates ? 'Contains dates' : 'No dates detected',
          analysis.containsNumbers ? 'Contains numbers' : 'No numbers detected'
        ].filter(Boolean),
        recommendations: [
          analysis.containsPersonalInfo ? 'Review for sensitive personal information' : 'Document appears safe from obvious personal data',
          'Consider professional legal review for important documents',
          'Ensure proper storage and backup of legal documents'
        ].filter(Boolean)
      },
      metadata: {
        processingTime: "Real-time analysis",
        analysisId: Date.now().toString(36),
        modelUsed: "LexLink Content Analyzer v1.0"
      }
    };

    console.log('Sending real analysis result');
    res.json(analysisResult);

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to process document',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ LexLink server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
