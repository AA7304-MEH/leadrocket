import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('loads correctly with hero content', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/LeadRockets/i)
    console.log('✅ Title: ' + await page.title())
  })

  test('has working CTA button', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const cta = page.locator('a[href*="signup"], a[href*="login"], button:has-text("Start"), button:has-text("Get Started"), button:has-text("Try")').first()
    await expect(cta).toBeVisible()
    console.log('✅ CTA button visible')
  })

  test('pricing section visible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const pricing = page.locator('text=/starter|pro|agency|pricing/i').first()
    await expect(pricing).toBeVisible()
    console.log('✅ Pricing section found')
  })

  test('page screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'screenshots/landing.png', fullPage: true })
    console.log('📸 Landing page screenshot saved')
  })
})
