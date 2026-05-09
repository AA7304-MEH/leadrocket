import { Router } from 'express'
import { protect } from '../middleware/auth'
import { AIScoringService } from '../services/AIScoringService'

const router = Router()
const aiService = new AIScoringService()

router.post('/score-campaign', protect, async (req: any, res) => {
  try {
    const { subjectLine, body, targetIndustry, leadCount, sendTime } = req.body
    if (!subjectLine || !body) return res.status(400).json({ message: 'subjectLine and body required' })
    const score = await aiService.scoreCampaign({ subjectLine, body, targetIndustry, leadCount, sendTime })
    res.json({ success: true, data: score })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

router.post('/remix-campaign', protect, async (req: any, res) => {
  try {
    const { subjectLine, body, industry } = req.body
    const remixed = await aiService.remixCampaign(subjectLine, body, industry)
    res.json({ success: true, data: remixed })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

router.post('/generate-subjects', protect, async (req: any, res) => {
  try {
    const { context, industry } = req.body
    const subjects = await aiService.generateSubjectLines(context, industry)
    res.json({ success: true, data: subjects })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

export default router
