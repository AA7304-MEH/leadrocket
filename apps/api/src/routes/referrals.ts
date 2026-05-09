import { Router } from 'express'
import { protect } from '../middleware/auth'
import { ReferralService } from '../services/ReferralService'
import { PrismaClient } from '@prisma/client'

const router = Router()
const referralService = new ReferralService()
const prisma = new PrismaClient()

router.get('/stats', protect, async (req: any, res) => {
  try {
    const stats = await referralService.getReferralStats(req.user.id)
    res.json({ success: true, data: stats })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

router.get('/leaderboard', protect, async (req: any, res) => {
  try {
    const leaderboard = await prisma.user.findMany({
      select: { id: true, name: true, _count: { select: { referrals: true } }, aiCredits: true },
      orderBy: { referrals: { _count: 'desc' } },
      take: 10
    })
    res.json({ success: true, data: leaderboard })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

export default router
