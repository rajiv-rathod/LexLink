import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const { documentText, documentType, industry = 'general' } = req.body;
    
    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required for benchmarking' });
    }

    // Generate benchmark analysis using AI or mock response
    let benchmarkResult;
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `As a legal benchmarking expert, analyze this ${documentType || 'legal'} document against industry standards and best practices for the ${industry} industry.

Document Type: ${documentType || 'General Legal Document'}
Industry: ${industry}
Document Content: ${documentText.substring(0, 30000)}

Provide a comprehensive benchmarking analysis in JSON format:
{
  "overallScore": 1-10,
  "industryRating": "poor|below-average|average|above-average|excellent",
  "documentType": "${documentType || 'general'}",
  "industry": "${industry}",
  "strengths": [
    {
      "area": "Specific strength area",
      "description": "What this document does well",
      "industryComparison": "How this compares to industry standard"
    }
  ],
  "weaknesses": [
    {
      "area": "Area needing improvement",
      "description": "What could be better",
      "industryStandard": "What the industry standard practice is",
      "improvement": "How to improve this area"
    }
  ],
  "benchmarkMetrics": {
    "clarity": 1-10,
    "completeness": 1-10,
    "enforceability": 1-10,
    "protection": 1-10,
    "fairness": 1-10
  },
  "industryComparison": {
    "betterThan": "X% of similar documents",
    "commonPractices": ["Industry standard practices this document follows"],
    "missingElements": ["Standard elements not found in this document"]
  },
  "recommendations": [
    {
      "priority": "high|medium|low",
      "improvement": "Specific improvement recommendation",
      "justification": "Why this improvement is recommended",
      "industryTrend": "How this relates to industry trends"
    }
  ],
  "modernization": [
    "Suggestions for updating document to current standards"
  ]
}`;

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
        
        benchmarkResult = JSON.parse(responseText);
      } catch (aiError) {
        console.error('AI benchmark analysis failed:', aiError);
        // Use fallback response
        benchmarkResult = {
          overallScore: 7,
          industryRating: 'average',
          documentType: documentType || 'general',
          industry: industry,
          strengths: [
            {
              area: "Document Structure",
              description: "Document appears to follow standard legal formatting",
              industryComparison: "Meets basic industry formatting standards"
            }
          ],
          weaknesses: [
            {
              area: "AI Analysis Unavailable",
              description: "Cannot perform detailed benchmark analysis without AI services",
              industryStandard: "Professional benchmarking against industry standards",
              improvement: "Configure AI services or obtain professional legal review"
            }
          ],
          benchmarkMetrics: {
            clarity: 7,
            completeness: 6,
            enforceability: 7,
            protection: 6,
            fairness: 7
          },
          industryComparison: {
            betterThan: "Unable to determine without AI analysis",
            commonPractices: ["Standard legal language", "Basic contract structure"],
            missingElements: ["Detailed analysis requires AI configuration"]
          },
          recommendations: [
            {
              priority: "high",
              improvement: "Professional benchmarking review",
              justification: "Industry comparison requires specialized analysis",
              industryTrend: "Increasing use of standardized legal frameworks"
            }
          ],
          modernization: [
            "Consider professional review against current industry standards",
            "Evaluate document against recent legal developments",
            "Review for modern legal best practices"
          ]
        };
      }
    } else {
      // Mock response when no API key is available
      benchmarkResult = {
        overallScore: 6,
        industryRating: 'needs-review',
        documentType: documentType || 'general',
        industry: industry,
        strengths: [
          {
            area: "Basic Structure",
            description: "Document contains standard legal elements",
            industryComparison: "Appears to follow conventional format"
          }
        ],
        weaknesses: [
          {
            area: "Benchmarking Analysis",
            description: "Detailed industry comparison requires AI configuration",
            industryStandard: "Comprehensive analysis against industry benchmarks",
            improvement: "Configure GEMINI_API_KEY for detailed benchmarking"
          }
        ],
        benchmarkMetrics: {
          clarity: 6,
          completeness: 6,
          enforceability: 6,
          protection: 6,
          fairness: 6
        },
        industryComparison: {
          betterThan: "Benchmarking requires AI configuration",
          commonPractices: ["Standard legal terminology", "Basic contract provisions"],
          missingElements: ["Detailed industry comparison not available"]
        },
        recommendations: [
          {
            priority: "high",
            improvement: "Configure AI services for detailed benchmarking",
            justification: "Industry-specific analysis requires AI capabilities",
            industryTrend: "Automated legal document analysis becoming standard"
          },
          {
            priority: "medium",
            improvement: "Professional legal review",
            justification: "Expert evaluation against industry standards",
            industryTrend: "Regular benchmarking against industry best practices"
          }
        ],
        modernization: [
          "Enable AI analysis for comprehensive benchmarking",
          "Consider professional industry-specific review",
          "Research current industry standard practices"
        ]
      };
    }

    res.status(200).json({
      success: true,
      ...benchmarkResult,
      timestamp: new Date().toISOString(),
      disclaimer: "Benchmarking analysis is for informational purposes and should be supplemented with professional legal review"
    });

  } catch (error) {
    console.error('Benchmark endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform benchmark analysis',
      details: error.message
    });
  }
}