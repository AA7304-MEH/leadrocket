const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface SubjectLineAnalysis {
  score: number;
  feedback: string;
  suggestions: string[];
}

export async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 1000,
        response_mime_type: "application/json"
      }
    })
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      throw new Error('GEMINI_AUTH_ERROR');
    }
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export async function analyzeSubjectLine(subject: string): Promise<SubjectLineAnalysis> {
  const prompt = `Analyze this email subject line: "${subject}". 
  Provide a score (0-100), 1-sentence feedback, and 3 specific improvement suggestions.
  Return as JSON: { "score": number, "feedback": string, "suggestions": string[] }`;

  try {
    const response = await callGemini(prompt);
    return JSON.parse(response);
  } catch (err) {
    console.error('Gemini Analysis failed:', err);
    return {
      score: 70,
      feedback: "Analysis currently unavailable. Your subject line looks professional.",
      suggestions: ["Keep it under 60 characters", "Add a sense of urgency", "Avoid spam trigger words"]
    };
  }
}

export async function remixEmailBody(body: string): Promise<string> {
  const prompt = `Rewrite this email body to be more engaging, professional, and personalized for a B2B audience. 
  Keep the same core message but improve the flow and call to action:
  
  ${body}`;

  try {
    return await callGemini(prompt);
  } catch (err) {
    console.error('Gemini Remix failed:', err);
    return body; // Fallback to original
  }
}

export async function generateSubjectLines(name: string, company: string, focus: string): Promise<string[]> {
  const prompt = `Generate 5 highly engaging email subject lines for a campaign named "${name}" for the company "${company}" focusing on "${focus}".
  Return as a JSON array of strings: ["Subject 1", "Subject 2", ...]`;

  try {
    const response = await callGemini(prompt);
    return JSON.parse(response);
  } catch (err) {
    console.error('Gemini Suggestion failed:', err);
    return [
      "Quick question about " + company,
      "New growth strategy for " + company,
      "Regarding your outreach strategy",
      "Scaling " + company + " in 2024",
      "Ideas for " + name
    ];
  }
}
