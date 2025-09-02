import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function to parse FormData in Vercel serverless environment
async function parseFormData(req) {
  const contentType = req.headers['content-type'] || '';
  
  if (!contentType.includes('multipart/form-data')) {
    return null;
  }

  // For file uploads, we'll create a mock analysis since Vercel serverless
  // has limitations on file processing. In production, you'd use a library
  // like 'multiparty' or handle base64 encoded files
  return {
    file: {
      filename: 'uploaded_document.pdf',
      mimetype: 'application/pdf',
      size: 1024
    },
    mockContent: true
  };
}

// Helper function to detect document type from text
function detectDocumentType(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('lease') || lowerText.includes('rental') || lowerText.includes('tenant')) {
    return 'lease_agreement';
  } else if (lowerText.includes('employment') || lowerText.includes('employee') || lowerText.includes('position')) {
    return 'employment_contract';
  } else if (lowerText.includes('power of attorney') || lowerText.includes('attorney-in-fact')) {
    return 'power_of_attorney';
  } else if (lowerText.includes('will') || lowerText.includes('testament') || lowerText.includes('estate')) {
    return 'will_testament';
  } else if (lowerText.includes('contract') || lowerText.includes('agreement')) {
    return 'general_contract';
  } else if (lowerText.includes('privacy') || lowerText.includes('data') || lowerText.includes('gdpr')) {
    return 'privacy_policy';
  }
  
  return 'general_legal';
}

// Generate mock analysis for demonstration
function generateMockAnalysis(documentType = 'general_legal') {
  const analyses = {
    lease_agreement: {
      summary: "This is a residential lease agreement that establishes the rental terms between landlord and tenant.",
      keyTerms: [
        {
          term: "Monthly Rent",
          explanation: "The amount you must pay each month for the property",
          importance: "Late payment can result in fees and potential eviction"
        },
        {
          term: "Security Deposit",
          explanation: "Money held by landlord to cover potential damages",
          importance: "You can get this back if you meet all lease conditions"
        },
        {
          term: "Lease Term", 
          explanation: "How long the rental agreement lasts",
          importance: "Breaking early may result in penalties"
        }
      ],
      yourRights: [
        "Right to peaceful enjoyment of the property",
        "Right to have major repairs handled by the landlord",
        "Right to proper notice before landlord entry"
      ],
      yourObligations: [
        "Pay rent on time each month",
        "Maintain the property in good condition",
        "Follow all lease terms and building rules"
      ],
      riskAssessment: {
        overallRiskScore: 6,
        riskFactors: [
          {
            risk: "Late rent penalties",
            severity: "medium",
            explanation: "Consistent late payments could lead to eviction proceedings"
          }
        ]
      },
      redFlags: [
        "Review any clauses about automatic rent increases",
        "Check for unreasonable restrictions on property use"
      ],
      recommendations: [
        {
          action: "Set up automatic rent payments",
          priority: "high",
          reason: "Ensure you never miss payment deadlines"
        }
      ]
    },
    power_of_attorney: {
      summary: "This document grants someone else the legal authority to act on your behalf in specified matters.",
      keyTerms: [
        {
          term: "Principal",
          explanation: "The person granting the power (you)",
          importance: "You're giving away important legal rights"
        },
        {
          term: "Agent/Attorney-in-Fact",
          explanation: "The person receiving the authority to act for you",
          importance: "Choose someone you trust completely"
        },
        {
          term: "Durable Clause",
          explanation: "Whether the power remains valid if you become incapacitated",
          importance: "Critical for healthcare and financial decisions"
        }
      ],
      yourRights: [
        "Right to revoke the power at any time while competent",
        "Right to limit the scope of powers granted",
        "Right to require periodic reporting from your agent"
      ],
      yourObligations: [
        "Clearly communicate your wishes to your agent",
        "Keep the document safe and accessible",
        "Review and update periodically"
      ],
      riskAssessment: {
        overallRiskScore: 8,
        riskFactors: [
          {
            risk: "Agent misuse of authority",
            severity: "high",
            explanation: "Your agent could make decisions against your interests"
          }
        ]
      },
      redFlags: [
        "Overly broad powers without specific limitations",
        "No requirements for agent accountability"
      ],
      recommendations: [
        {
          action: "Limit powers to specific needs",
          priority: "high",
          reason: "Reduce risk of misuse"
        }
      ]
    }
  };

  return analyses[documentType] || analyses.lease_agreement;
}

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
    let text = '';
    let analysisType = 'legal';
    let documentType = 'general_legal';

    // Check if this is a file upload or text analysis
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await parseFormData(req);
      
      if (formData && formData.mockContent) {
        // For demonstration, use a comprehensive mock analysis
        const mockAnalysis = generateMockAnalysis('lease_agreement');
        
        return res.status(200).json({
          success: true,
          documentType: 'lease_agreement',
          documentLength: 2500,
          processingTime: new Date().toISOString(),
          ...mockAnalysis,
          note: "This is a demonstration analysis. Upload actual files to get AI-powered analysis of your documents."
        });
      }
    } else {
      // Handle JSON request with text content
      const body = req.body;
      text = body.text;
      analysisType = body.analysisType || 'general';
      
      if (!text) {
        return res.status(400).json({ error: 'Text or document is required' });
      }
      
      documentType = detectDocumentType(text);
    }

    // Try to use AI analysis if available
    if (process.env.GEMINI_API_KEY && text) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `As an expert legal analyst, analyze this ${documentType.replace('_', ' ')} document and provide a comprehensive assessment in JSON format.

Document Type: ${documentType}
Document Content: ${text.substring(0, 30000)}

Provide your analysis in this exact JSON structure:
{
  "documentType": "${documentType}",
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

Focus on practical implications and use language a non-lawyer can understand.`;

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
          const parsedResult = JSON.parse(responseText);
          return res.status(200).json({
            success: true,
            ...parsedResult,
            documentLength: text.length,
            processingTime: new Date().toISOString()
          });
        } catch (parseError) {
          console.warn('Failed to parse AI response, using fallback');
        }
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
      }
    }

    // Fallback to mock analysis
    const mockAnalysis = generateMockAnalysis(documentType);
    
    res.status(200).json({
      success: true,
      documentType: documentType,
      documentLength: text.length || 2500,
      processingTime: new Date().toISOString(),
      ...mockAnalysis,
      note: process.env.GEMINI_API_KEY ? 
        "AI analysis encountered an error, showing demonstration data" : 
        "Configure GEMINI_API_KEY environment variable for AI-powered analysis"
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
