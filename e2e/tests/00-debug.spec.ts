import { test } from '@playwright/test'

test('debug — find login page selectors', async ({ page }) => {
  console.log('Navigating to homepage...')
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  console.log('Clicking Login button...')
  const loginBtn = page.getByRole('button', { name: 'Login' })
  await loginBtn.click()
  
  // Wait for navigation or modal
  await page.waitForTimeout(3000)
  
  const currentUrl = page.url()
  console.log(`Current URL after clicking Login: ${currentUrl}`)

  // Log all input fields found on the page
  const inputs = await page.locator('input').all()
  console.log(`Found ${inputs.length} input(s):`)
  for (const input of inputs) {
    const type = await input.getAttribute('type')
    const placeholder = await input.getAttribute('placeholder')
    const name = await input.getAttribute('name')
    const id = await input.getAttribute('id')
    console.log(`  input: type="${type}" placeholder="${placeholder}" name="${name}" id="${id}"`)
  }

  // Log all buttons
  const buttons = await page.locator('button').all()
  console.log(`Found ${buttons.length} button(s):`)
  for (const btn of buttons) {
    const text = await btn.innerText()
    const type = await btn.getAttribute('type')
    console.log(`  button: type="${type}" text="${text.trim()}"`)
  }

  await page.screenshot({ path: 'screenshots/debug-after-login-click.png', fullPage: true })
})
