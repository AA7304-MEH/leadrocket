import { Page } from '@playwright/test'

export const TEST_USER = {
  email: 'testuser@leadrockets.dev',
  password: 'TestPass123!',
}

export async function login(page: Page) {
  // Navigate to homepage first (direct /login returns 404)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)

  // Click the Login button from homepage to trigger client-side navigation
  const loginLink = page.locator('a[href*="login"], button:has-text("Login"), button:has-text("LOG IN"), a:has-text("Login"), a:has-text("Sign in")').first()
  if (await loginLink.isVisible()) {
    await loginLink.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  }

  // Use exact selectors from debug output
  // Email: type="email" placeholder="elon@mars.com"
  const emailInput = page.locator('input[type="email"][placeholder="elon@mars.com"]')
  await emailInput.waitFor({ state: 'visible', timeout: 15000 })
  await emailInput.fill(TEST_USER.email)

  // Password: type="password" placeholder="••••••••"
  const passwordInput = page.locator('input[type="password"]').first()
  await passwordInput.fill(TEST_USER.password)

  // Submit: button type="submit" text="SIGN IN →"
  const submitBtn = page.locator('button[type="submit"]:has-text("SIGN IN")')
  await submitBtn.click()

  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)

  console.log('After login URL:', page.url())
}

export async function signup(page: Page, email: string) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)

  // Click SIGN UP mode switcher
  const signupBtn = page.locator('button:has-text("SIGN UP")')
  if (await signupBtn.isVisible()) {
    await signupBtn.click()
    await page.waitForTimeout(500)
  }

  const emailInput = page.locator('input[type="email"][placeholder="elon@mars.com"]')
  await emailInput.waitFor({ state: 'visible', timeout: 15000 })
  await emailInput.fill(email)

  const passwordInput = page.locator('input[type="password"]').first()
  await passwordInput.fill('TestPass123!')

  // Submit button text may change to "SIGN UP →" in signup mode
  const submitBtn = page.locator('button[type="submit"]').first()
  await submitBtn.click()

  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)
  console.log('After signup URL:', page.url())
}
