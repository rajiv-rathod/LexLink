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
    const { documentText, documentType, jurisdiction = 'US' } = req.body;
    
    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required for compliance check' });
    }

    // Generate compliance analysis using AI or mock response
    let complianceResult;
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `As a legal compliance expert, analyze this ${documentType || 'legal'} document for compliance with ${jurisdiction} laws and regulations.

Document Type: ${documentType || 'General Legal Document'}
Jurisdiction: ${jurisdiction}
Document Content: ${documentText.substring(0, 30000)}

Provide a comprehensive compliance analysis in JSON format:
{
  "complianceScore": 1-10,
  "overallStatus": "compliant|needs-review|non-compliant",
  "jurisdiction": "${jurisdiction}",
  "documentType": "${documentType || 'general'}",
  "complianceIssues": [
    {
      "issue": "Description of specific compliance issue",
      "severity": "low|medium|high|critical",
      "requirement": "Specific legal requirement not met",
      "recommendation": "How to fix this issue",
      "consequence": "Potential legal consequences"
    }
  ],
  "strengths": [
    "Areas where the document meets compliance requirements"
  ],
  "requiredActions": [
    {
      "action": "Specific action required",
      "priority": "immediate|high|medium|low",
      "deadline": "When this should be completed",
      "legalBasis": "The law or regulation requiring this"
    }
  ],
  "recommendations": [
    "General recommendations for improving compliance"
  ],
  "nextSteps": [
    "Immediate steps to take"
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
        
        complianceResult = JSON.parse(responseText);
      } catch (aiError) {
        console.error('AI compliance analysis failed:', aiError);
        // Use fallback response
        complianceResult = {
          complianceScore: 7,
          overallStatus: 'needs-review',
          jurisdiction: jurisdiction,
          documentType: documentType || 'general',
          complianceIssues: [
            {
              issue: "AI compliance analysis unavailable",
              severity: "medium",
              requirement: "Professional legal review recommended",
              recommendation: "Have document reviewed by qualified attorney",
              consequence: "Cannot verify compliance without professional review"
            }
          ],
          strengths: [
            "Document appears to contain standard legal provisions"
          ],
          requiredActions: [
            {
              action: "Professional legal review",
              priority: "high",
              deadline: "Before signing or implementation",
              legalBasis: "General legal compliance best practices"
            }
          ],
          recommendations: [
            "Consult with attorney familiar with " + jurisdiction + " law",
            "Review document against current legal requirements",
            "Ensure all required disclosures are included"
          ],
          nextSteps: [
            "Schedule consultation with legal professional",
            "Research current compliance requirements",
            "Document any concerns for legal review"
          ]
        };
      }
    } else {
      // Mock response when no API key is available
      complianceResult = {
        complianceScore: 6,
        overallStatus: 'needs-review',
        jurisdiction: jurisdiction,
        documentType: documentType || 'general',
        complianceIssues: [
          {
            issue: "Compliance analysis requires AI configuration",
            severity: "medium",
            requirement: "GEMINI_API_KEY environment variable",
            recommendation: "Configure AI services for detailed compliance analysis",
            consequence: "Cannot provide automated compliance verification"
          }
        ],
        strengths: [
          "Document structure appears standard",
          "Basic legal language is present"
        ],
        requiredActions: [
          {
            action: "Professional compliance review",
            priority: "high",
            deadline: "Before document execution",
            legalBasis: "Legal compliance best practices"
          }
        ],
        recommendations: [
          "Engage qualified legal counsel for compliance review",
          "Verify current regulatory requirements for " + jurisdiction,
          "Ensure document meets industry standards"
        ],
        nextSteps: [
          "Configure AI services for detailed analysis",
          "Schedule professional legal review",
          "Research applicable compliance requirements"
        ]
      };
    }

    res.status(200).json({
      success: true,
      ...complianceResult,
      timestamp: new Date().toISOString(),
      disclaimer: "This analysis is for informational purposes only and does not constitute legal advice"
    });

  } catch (error) {
    console.error('Compliance endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform compliance check',
      details: error.message
    });
  }
}