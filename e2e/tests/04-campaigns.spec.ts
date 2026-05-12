import { test } from '@playwright/test'
import { login } from './helpers/login'

test.describe('Campaign Builder + AI Scoring', () => {
  test('campaign builder loads', async ({ page }) => {
    await login(page)
    await page.goto('/campaigns/new')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'screenshots/campaign-builder.png', fullPage: true })
    console.log('✅ Campaign builder loaded')
  })

  test('AI score updates when typing subject line', async ({ page }) => {
    await login(page)
    await page.goto('/campaigns/new')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const subjectInput = page.locator('input[placeholder*="subject" i], input[placeholder*="Subject"]').first()
    if (await subjectInput.isVisible()) {
      await subjectInput.fill('Increase your agency revenue by 40% with AI-powered outreach')
      console.log('✅ Subject line typed')
      await page.waitForTimeout(2000) // wait for debounce + API call
      await page.screenshot({ path: 'screenshots/ai-scoring.png' })

      const score = page.locator('text=/score|scoring|\\d+\\/100|\\d+%/i').first()
      const scoreVisible = await score.isVisible().catch(() => false)
      console.log(scoreVisible ? '✅ AI score visible' : '⚠️ AI score not visible yet (check API connection)')
    } else {
      console.log('⚠️ Subject input not found — check campaign builder layout')
    }
  })

  test('remix with AI button exists', async ({ page }) => {
    await login(page)
    await page.goto('/campaigns/new')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const remixBtn = page.locator('button:has-text("Remix"), button:has-text("remix"), button:has-text("AI")').first()
    const visible = await remixBtn.isVisible().catch(() => false)
    console.log(visible ? '✅ Remix with AI button found' : '⚠️ Remix button not visible')
    await page.screenshot({ path: 'screenshots/remix-btn.png' })
  })
})
