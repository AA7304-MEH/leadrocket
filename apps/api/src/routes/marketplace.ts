import { Router } from 'express'
import { protect } from '../middleware/auth'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/marketplace — browse templates
router.get('/', protect, async (req: any, res) => {
  try {
    const { industry, type, price, sort = 'popular', search } = req.query
    const where: any = { isPublished: true, isApproved: true }
    if (industry) where.industry = industry
    if (type) where.campaignType = type
    if (price === 'free') where.price = 0
    if (price === 'paid') where.price = { gt: 0 }
    if (search) where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } }
    ]
    const orderBy: any = sort === 'popular' ? { useCount: 'desc' }
      : sort === 'rating' ? { rating: 'desc' }
      : { createdAt: 'desc' }

    const templates = await prisma.template.findMany({
      where, orderBy, take: 50,
      include: { author: { select: { id: true, name: true } }, _count: { select: { purchases: true } } }
    })
    res.json({ success: true, data: templates })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

// POST /api/marketplace/publish — submit template for review
router.post('/publish', protect, async (req: any, res) => {
  try {
    const { name, description, subjectLine, body, industry, campaignType, price, tags } = req.body
    const template = await prisma.template.create({
      data: {
        authorId: req.user.id, name, description, subjectLine,
        body, industry, campaignType, price: price ?? 0,
        tags: tags ?? [], isPublished: true, isApproved: false // needs review
      }
    })
    res.json({ success: true, data: template })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

// POST /api/marketplace/:id/use — use a free template or verify purchase
router.post('/:id/use', protect, async (req: any, res) => {
  try {
    const template = await prisma.template.findUnique({ where: { id: req.params.id } })
    if (!template) return res.status(404).json({ message: 'Template not found' })

    if (template.price > 0) {
      const purchased = await prisma.templatePurchase.findFirst({
        where: { templateId: template.id, buyerId: req.user.id }
      })
      if (!purchased) return res.status(403).json({ message: 'Purchase required' })
    }

    // Increment use count
    await prisma.template.update({
      where: { id: template.id },
      data: { useCount: { increment: 1 } }
    })
    res.json({ success: true, data: template })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

// POST /api/marketplace/:id/purchase — buy with Razorpay
router.post('/:id/purchase', protect, async (req: any, res) => {
  try {
    const template = await prisma.template.findUnique({ where: { id: req.params.id } })
    if (!template || template.price === 0) return res.status(400).json({ message: 'Invalid' })

    // Create Razorpay order
    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({ 
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock', 
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret' 
    })
    const order = await razorpay.orders.create({
      amount: Math.round(template.price * 100), // paise
      currency: 'INR',
      receipt: `tmpl_${template.id}_${req.user.id}`
    })
    res.json({ success: true, data: { orderId: order.id, amount: order.amount, templateId: template.id } })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

// POST /api/marketplace/:id/review — submit review
router.post('/:id/review', protect, async (req: any, res) => {
  try {
    const { rating, comment } = req.body
    await prisma.templateReview.create({
      data: { templateId: req.params.id, reviewerId: req.user.id, rating, comment }
    })
    // Update template avg rating
    const reviews = await prisma.templateReview.findMany({ where: { templateId: req.params.id } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await prisma.template.update({ where: { id: req.params.id }, data: { rating: avgRating, ratingCount: reviews.length } })
    res.json({ success: true })
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }) }
})

export default router
