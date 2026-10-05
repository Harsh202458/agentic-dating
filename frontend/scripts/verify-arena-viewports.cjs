const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SIZES = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1280x610', width: 1280, height: 610 },
  { name: '390x844', width: 390, height: 844, isMobile: true }
];

const OUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

(async () => {
  console.log('Launching browser for viewport verification...');
  const browser = await chromium.launch({ channel: 'msedge' });

  for (const sz of SIZES) {
    console.log(`Testing viewport ${sz.name} (${sz.width}x${sz.height})...`);
    const page = await browser.newPage({
      viewport: { width: sz.width, height: sz.height },
      isMobile: !!sz.isMobile
    });

    try {
      await page.goto('http://localhost:3000/dates/1-14', { waitUntil: 'networkidle', timeout: 25000 });
      // Wait for avatars and content
      await page.waitForTimeout(2000);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      const hasHScroll = scrollWidth > innerWidth + 1;

      console.log(`Viewport ${sz.name}: scrollWidth=${scrollWidth}, innerWidth=${innerWidth}, hasHScroll=${hasHScroll}`);

      // Save screenshot
      const shotPath = path.join(OUT_DIR, `arena-${sz.name}.png`);
      await page.screenshot({ path: shotPath });
      console.log(`Saved screenshot to ${shotPath}`);
    } catch (e) {
      console.error(`Error on ${sz.name}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Viewport verification completed successfully.');
})();
