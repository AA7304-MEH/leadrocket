import { prisma } from '../src/utils/prisma';

async function main() {
  // Find first user in database
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('❌ No users found. Create an account first then re-run this script.')
    return
  }
  console.log(`✅ Found user: ${user.email} (${user.id})`)

  // Find first lead belonging to that user
  const lead = await prisma.lead.findFirst({
    where: { userId: user.id }
  })
  if (!lead) {
    console.log('❌ No leads found for this user. Add a lead first then re-run.')
    return
  }
  console.log(`✅ Found lead: ${lead.contactName} at ${lead.companyName} (${lead.id})`)

  // Seed competitor insights
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      competitorInsights: JSON.stringify({
        detectedCompetitors: ['HubSpot'],
        mentionContext: 'The prospect mentioned they are currently evaluating HubSpot as an alternative.',
        counterStrategies: [
          'Highlight LeadRockets AI-powered scoring — HubSpot has no equivalent',
          'Emphasise lower price point and faster onboarding',
          'Offer free data migration from HubSpot'
        ],
        severity: 'high',
        detectedAt: new Date().toISOString()
      })
    }
  })

  console.log(`✅ Competitor insights seeded for lead: ${lead.id}`)
  console.log('🚀 Refresh your dashboard to see the CompetitorAlert widget populate.')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
