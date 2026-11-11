import type { APIRoute } from 'astro';
import puppeteer, { type Browser } from 'puppeteer';
import { launchOptions, renderPdf } from '../../lib/render-pdf.mjs';

// 개발 서버 전용 (src/integrations/dev-pdf.ts가 dev에서만 붙인다).
// 운영에서는 빌드 때 만든 out/resume.pdf를 내려준다 (scripts/generate-pdf.mjs).
export const prerender = false;

// 브라우저는 요청마다 띄우지 않고 재사용한다.
let browserPromise: Promise<Browser> | null = null;

const getBrowser = () => {
  browserPromise ??= puppeteer
    .launch(launchOptions)
    .then((browser) => {
      browser.on('disconnected', () => {
        browserPromise = null;
      });
      return browser;
    })
    .catch((error) => {
      browserPromise = null;
      throw error;
    });
  return browserPromise;
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const pdf = await renderPdf(await getBrowser(), { origin: url.origin });
    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return Response.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
};
