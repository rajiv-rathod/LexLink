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
    const { question, documentText } = req.body;
    
    if (!question || !documentText) {
      return res.status(400).json({ error: 'Question and document text are required' });
    }

    // Generate answer using AI or mock response
    let answer;
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Based on this legal document, answer the user's question in simple, practical terms:

Document: ${documentText.substring(0, 30000)}

Question: ${question}

Provide a JSON response with:
{
  "answer": "Direct answer to the question",
  "explanation": "Detailed explanation with context",
  "relevantClauses": "Which parts of the document relate to this question",
  "additionalConsiderations": "Other things the user should know",
  "followUpQuestions": ["Suggested related questions they might want to ask"]
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
        
        answer = JSON.parse(responseText);
      } catch (aiError) {
        console.error('AI answer generation failed:', aiError);
        // Use fallback response
        answer = {
          answer: "I can help answer questions about this document. However, the AI service is currently unavailable.",
          explanation: "Please ensure your question is specific to the content of the uploaded document.",
          relevantClauses: "Unable to identify specific clauses at this time",
          additionalConsiderations: "For detailed legal advice, please consult with a qualified attorney.",
          followUpQuestions: ["What are the key terms I should understand?", "What are my main obligations?", "What risks should I be aware of?"]
        };
      }
    } else {
      // Mock response when no API key is available
      answer = {
        answer: `Based on the document, regarding "${question}": This appears to relate to standard legal provisions. The specific answer depends on the context within your document.`,
        explanation: "This is a demo response. To get detailed AI-powered answers, please configure the GEMINI_API_KEY environment variable.",
        relevantClauses: "Multiple sections of the document may contain relevant information",
        additionalConsiderations: "Always consult with a qualified attorney for legal advice specific to your situation",
        followUpQuestions: [
          "What are the main risks in this document?",
          "What are my key obligations?",
          "Are there any red flags I should know about?",
          "What should I do before signing this document?"
        ]
      };
    }

    res.status(200).json({
      success: true,
      ...answer,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ask endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to answer question',
      details: error.message
    });
  }
}