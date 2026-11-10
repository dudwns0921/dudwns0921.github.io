// 이력서 페이지를 PDF로 렌더링한다.
// 빌드 스크립트(scripts/generate-pdf.mjs)와 개발용 API(src/app/api/pdf/route.ts)가 함께 쓴다.

export const launchOptions = {
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};

/**
 * @param {import('puppeteer').Browser} browser
 * @param {{ origin: string, assetPrefix?: string }} options
 *   assetPrefix: 빌드에 assetPrefix를 쓸 때만 넘긴다. 로컬 서버는 prefix 없이 서빙하므로 요청 경로를 되돌린다.
 */
export async function renderPdf(browser, { origin, assetPrefix }) {
  const page = await browser.newPage();
  try {
    // 화면 폭 800px 기준 레이아웃(경력 2열)으로 렌더링한다.
    await page.setViewport({ width: 800, height: 600 });

    if (assetPrefix) {
      const prefixed = origin + assetPrefix;
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const url = request.url();
        if (url.startsWith(prefixed)) {
          request.continue({ url: `${origin}/${url.slice(prefixed.length)}` });
        } else {
          request.continue();
        }
      });
    }

    await page.goto(`${origin}/`, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', bottom: '40px' },
    });
  } finally {
    await page.close();
  }
}
