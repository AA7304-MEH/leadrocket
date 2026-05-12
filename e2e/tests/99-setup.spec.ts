import { test } from '@playwright/test'

test('setup — create test account', async ({ page }) => {
  console.log('Navigating to homepage...')
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  console.log('Clicking Login button...')
  const loginBtn = page.getByRole('button', { name: 'Login' })
  await loginBtn.click()
  await page.waitForTimeout(2000)

  console.log('Switching to SIGN UP mode...')
  const signupBtn = page.locator('button:has-text("SIGN UP")')
  if (await signupBtn.isVisible()) {
    await signupBtn.click()
    await page.waitForTimeout(1000)
  }

  console.log('Filling signup form...')
  await page.locator('input[type="email"]').fill('testuser@leadrockets.dev')
  await page.locator('input[type="password"]').fill('TestPass123!')

  console.log('Submitting...')
  await page.locator('button[type="submit"]').click()

  await page.waitForTimeout(5000)
  console.log('Final URL:', page.url())
  await page.screenshot({ path: 'screenshots/signup-final.png' })
})
