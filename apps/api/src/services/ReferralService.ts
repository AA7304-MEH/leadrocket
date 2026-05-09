import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class ReferralService {

  // Called when new user signs up with a referral code
  async processReferralSignup(referralCode: string, newUserId: string, newUserEmail: string) {
    const referrer = await prisma.user.findUnique({ where: { referralCode } })
    if (!referrer || referrer.id === newUserId) return

    // Create referral record
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredEmail: newUserEmail,
        referredUserId: newUserId,
        status: 'converted',
        creditsAwarded: 500,
        convertedAt: new Date()
      }
    })

    // Award 500 credits to referrer
    await this.awardCredits(referrer.id, 500, 'referral_signup',
      `${newUserEmail} signed up using your referral link`)

    // Award 100 bonus credits to new user
    await this.awardCredits(newUserId, 100, 'bonus',
      'Welcome bonus for joining via referral')

    // Check tier rewards
    await this.checkTierRewards(referrer.id)
  }

  async awardCredits(userId: string, amount: number, type: string, description: string) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { aiCredits: { increment: amount } }
      }),
      prisma.creditTransaction.create({
        data: { userId, amount, type, description }
      })
    ])
  }

  async spendCredits(userId: string, amount: number, description: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.aiCredits < amount) return false

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { aiCredits: { decrement: amount } }
      }),
      prisma.creditTransaction.create({
        data: { userId, amount: -amount, type: 'campaign_run', description }
      })
    ])
    return true
  }

  async checkTierRewards(userId: string) {
    const referralCount = await prisma.referral.count({
      where: { referrerId: userId, status: 'converted' }
    })

    // Tier rewards
    const tiers: Record<number, { credits: number, description: string }> = {
      3:  { credits: 1000, description: '3 referrals milestone — bonus 1,000 credits' },
      5:  { credits: 2500, description: '5 referrals milestone — bonus 2,500 credits' },
      10: { credits: 5000, description: '10 referrals milestone — Founding Member bonus' },
    }

    if (tiers[referralCount]) {
      await this.awardCredits(userId, tiers[referralCount].credits,
        'referral_upgrade', tiers[referralCount].description)
    }
  }

  async getReferralStats(userId: string) {
    const [referrals, transactions, user] = await Promise.all([
      prisma.referral.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.creditTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { aiCredits: true, referralCode: true }
      })
    ])

    return {
      referralCode: user?.referralCode,
      referralLink: `${process.env.FRONTEND_URL}/signup?ref=${user?.referralCode}`,
      totalReferrals: referrals.length,
      convertedReferrals: referrals.filter(r => r.status === 'converted').length,
      totalCreditsEarned: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
      currentCredits: user?.aiCredits ?? 0,
      referrals,
      recentTransactions: transactions
    }
  }
}
