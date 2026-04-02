import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface SubjectLineAnalysis {
  score: number;
  feedback: string;
  suggestions: string[];
}

export const analyzeSubjectLine = async (subject: string): Promise<SubjectLineAnalysis> => {
  if (!subject) return { score: 0, feedback: "Enter a subject line", suggestions: [] };
  
  try {
    const prompt = `You are an email marketing expert. Analyze this email subject line and return a JSON object with: 
    score (0-100 integer), 
    feedback (max 15 words), 
    suggestions (array of 2 short improvement tips). 
    Subject: ${subject}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean JSON response (handle potential markdown blocks)
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { score: 50, feedback: "AI score unavailable", suggestions: [] };
  }
};

export const remixEmailBody = async (body: string): Promise<string> => {
  if (!body) return "";
  
  try {
    const prompt = `Rewrite this marketing email to be more compelling, concise, and conversion-focused. Keep the same intent. 
    Return only the improved email body in HTML format. Don't include any other text.
    Original: ${body}`;

    const result = await model.generateContent(prompt);
    return result.response.text().replace(/```html|```/g, "").trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return body;
  }
};

export const generateSubjectLines = async (name: string, industry: string, goal: string): Promise<string[]> => {
  try {
    const prompt = `Generate 5 high-converting email subject lines for this campaign. 
    Return strictly as a JSON array of strings.
    Campaign context: ${name}, Industry: ${industry}, Goal: ${goal}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Quick question about your growth", "Ideas for LeadRockets"];
  }
};
