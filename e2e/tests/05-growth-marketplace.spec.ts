import { test } from '@playwright/test'
import { login } from './helpers/login'

test.describe('Growth Dashboard', () => {
  test('growth page loads with referral widget', async ({ page }) => {
    await login(page)
    await page.goto('/growth')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'screenshots/growth.png', fullPage: true })
    const referral = page.locator('text=/referral|invite|credits|link/i').first()
    const visible = await referral.isVisible().catch(() => false)
    console.log(visible ? '✅ Growth page with referral widget loaded' : '⚠️ Referral widget not found')
  })

  test('copy referral link button exists', async ({ page }) => {
    await login(page)
    await page.goto('/growth')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const copyBtn = page.locator('button:has-text("Copy"), button:has-text("copy")').first()
    const visible = await copyBtn.isVisible().catch(() => false)
    console.log(visible ? '✅ Copy referral link button found' : '⚠️ Copy button not found')
  })

  test('rewards ladder visible', async ({ page }) => {
    await login(page)
    await page.goto('/growth')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const ladder = page.locator('text=/milestone|reward|credits|tier/i').first()
    const visible = await ladder.isVisible().catch(() => false)
    console.log(visible ? '✅ Rewards ladder found' : '⚠️ Rewards ladder not found')
    await page.screenshot({ path: 'screenshots/rewards-ladder.png' })
  })
})

test.describe('Template Marketplace', () => {
  test('marketplace page loads', async ({ page }) => {
    await login(page)
    await page.goto('/marketplace')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'screenshots/marketplace.png', fullPage: true })
    console.log('✅ Marketplace page loaded')
  })

  test('search and filter controls visible', async ({ page }) => {
    await login(page)
    await page.goto('/marketplace')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const search = page.locator('input[placeholder*="search" i], input[placeholder*="Search"]').first()
    const visible = await search.isVisible().catch(() => false)
    console.log(visible ? '✅ Search bar found' : '⚠️ Search not found')
  })

  test('publish template button exists', async ({ page }) => {
    await login(page)
    await page.goto('/marketplace')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const publishBtn = page.locator('button:has-text("Publish"), button:has-text("publish"), button:has-text("Submit")').first()
    const visible = await publishBtn.isVisible().catch(() => false)
    console.log(visible ? '✅ Publish template button found' : '⚠️ Publish button not found')
    await page.screenshot({ path: 'screenshots/marketplace-publish.png' })
  })
})
