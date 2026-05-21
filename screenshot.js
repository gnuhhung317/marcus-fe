const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  // Set cookies
  await context.addCookies([
    {
      name: 'marcus_role',
      value: 'DEVELOPER',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'marcus_access_token',
      value: 'mock_token',
      domain: 'localhost',
      path: '/',
    }
  ]);
  
  const page = await context.newPage();
  
  // Set viewport
  await page.setViewportSize({ width: 1280, height: 1000 });
  
  // Navigate to dashboard
  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:3000/terminal/developer-dashboard');
  
  // Wait for network idle or some content to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'dashboard.png', fullPage: true });
  console.log('Screenshot saved to dashboard.png');
  
  await browser.close();
})();
