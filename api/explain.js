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
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Generate explanation using AI or mock response
    let explanation;
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `As a legal expert, explain this specific clause in simple terms:

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
        
        explanation = JSON.parse(responseText);
      } catch (aiError) {
        console.error('AI explanation failed:', aiError);
        // Use fallback response
        explanation = {
          plainEnglish: "This clause contains legal language that defines specific terms, conditions, or obligations in the document.",
          implications: "This affects your rights, responsibilities, or how the agreement works in practice.",
          risks: "Legal clauses can create obligations or limit your options. Review carefully to understand what you're agreeing to.",
          benefits: "Some clauses provide protections or clarify important terms that work in your favor.",
          redFlags: "AI service unavailable - please review this clause carefully with a legal professional.",
          commonScenarios: "This type of clause typically comes into play during specific situations outlined in the agreement."
        };
      }
    } else {
      // Mock response when no API key is available
      explanation = {
        plainEnglish: "This clause sets out specific legal terms and conditions. The exact meaning depends on the specific language used.",
        implications: "This affects your legal rights and obligations under the document. Understanding this clause is important for knowing what you're agreeing to.",
        risks: "Without understanding legal clauses, you might unknowingly agree to unfavorable terms or miss important protections.",
        benefits: "Well-written clauses can provide clarity and protect your interests when properly understood.",
        redFlags: "For a detailed analysis of this specific clause, please configure the GEMINI_API_KEY or consult with a legal professional.",
        commonScenarios: "Legal clauses typically become relevant during disputes, contract performance, or when specific conditions are triggered."
      };
    }

    res.status(200).json({
      success: true,
      originalText: text,
      ...explanation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Explain endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to explain clause',
      details: error.message
    });
  }
}