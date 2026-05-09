import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export class AIScoringService {

  async scoreCampaign(campaign: {
    subjectLine: string
    body: string
    targetIndustry: string
    leadCount: number
    sendTime?: string
  }): Promise<{
    overallScore: number
    subjectScore: number
    bodyScore: number
    timingScore: number
    audienceScore: number
    suggestions: string[]
    predictedOpenRate: number
    predictedReplyRate: number
  }> {
    const prompt = `You are an expert email marketing analyst with 10+ years experience.
Analyze this outreach campaign and return a JSON scoring object.

CAMPAIGN DETAILS:
Subject Line: "${campaign.subjectLine}"
Email Body: "${campaign.body}"
Target Industry: "${campaign.targetIndustry}"
Lead Count: ${campaign.leadCount}
Send Time: ${campaign.sendTime ?? 'Not specified'}

Score each dimension 0-100 and provide specific improvement suggestions.
Return ONLY valid JSON, no markdown:
{
  "overallScore": ,
  "subjectScore": <0-100, clarity + curiosity + personalization>,
  "bodyScore": <0-100, value prop + CTA + length + tone>,
  "timingScore": <0-100, based on send time, 9-11am Tue-Thu = 100>,
  "audienceScore": <0-100, relevance to ${campaign.targetIndustry}>,
  "suggestions": [<3-5 specific actionable improvement tips>],
  "predictedOpenRate": ,
  "predictedReplyRate": 
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()

    try {
      return JSON.parse(clean)
    } catch {
      // Fallback if JSON parse fails
      return {
        overallScore: 70, subjectScore: 70, bodyScore: 70,
        timingScore: 70, audienceScore: 70,
        suggestions: ['Unable to parse AI response. Please try again.'],
        predictedOpenRate: 0.28, predictedReplyRate: 0.06
      }
    }
  }

  async remixCampaign(subjectLine: string, body: string, industry: string): Promise<{
    subjectLine: string
    body: string
    improvements: string[]
  }> {
    const prompt = `You are an expert copywriter. Rewrite this email campaign to maximize open and reply rates for the ${industry} industry.

Original Subject: "${subjectLine}"
Original Body: "${body}"

Return ONLY valid JSON:
{
  "subjectLine": "",
  "body": "",
  "improvements": ["", ...]
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(text)
  }

  async generateSubjectLines(campaignContext: string, industry: string): Promise<string[]> {
    const prompt = `Generate 5 high-converting email subject lines for a ${industry} outreach campaign.
Context: ${campaignContext}
Return ONLY a JSON array of strings: ["subject1", "subject2", ...]`

    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json|```/g, '').trim()
    try { return JSON.parse(text) }
    catch { return ['Unable to generate. Please try again.'] }
  }
}
