import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { type Browser } from 'puppeteer';
import { launchOptions, renderPdf } from '@/lib/render-pdf.mjs';

// 개발 서버 전용. 운영에서는 빌드 때 만든 public/resume.pdf를 내려준다 (scripts/generate-pdf.mjs).

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

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const pdf = await renderPdf(await getBrowser(), { origin: req.nextUrl.origin });
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
