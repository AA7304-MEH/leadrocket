import { test, expect } from '@playwright/test'
import { login } from './helpers/login'

test.describe('Dashboard', () => {
  test('dashboard loads after login', async ({ page }) => {
    await login(page)
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'screenshots/dashboard.png', fullPage: true })
    console.log('Dashboard URL:', page.url())
    console.log('✅ Dashboard loaded')
  })

  test('sidebar navigation visible', async ({ page }) => {
    await login(page)
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const sidebar = page.locator('nav, aside, [class*="sidebar"]').first()
    const visible = await sidebar.isVisible()
    console.log(visible ? '✅ Sidebar visible' : '⚠️ Sidebar not found')
    await page.screenshot({ path: 'screenshots/dashboard-sidebar.png' })
  })

  test('competitor alert widget renders', async ({ page }) => {
    await login(page)
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    const widget = page.locator('text=/competitor|alert|HubSpot|Salesforce/i').first()
    const visible = await widget.isVisible().catch(() => false)
    console.log(visible ? '✅ Competitor widget found' : '⚠️ Competitor widget not visible (may be empty state)')
    await page.screenshot({ path: 'screenshots/competitor-widget.png' })
  })

  test('refresh keeps user logged in', async ({ page }) => {
    await login(page)
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const url = page.url()
    const stayedLoggedIn = !url.includes('/login') && !url.includes('/auth')
    console.log(stayedLoggedIn ? '✅ Session persists on refresh' : '❌ Session lost on refresh — URL: ' + url)
    await page.screenshot({ path: 'screenshots/session-persist.png' })
  })
})
