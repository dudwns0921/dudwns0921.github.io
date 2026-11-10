// `pnpm build`가 내보낸 정적 파일(out/)을 잠시 띄워 이력서 PDF를 out/resume.pdf로 만든다.
// 이력서는 배포 단위로만 바뀌므로 운영에서는 이 정적 파일을 그대로 내려준다.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { launchOptions, renderPdf } from '../src/lib/render-pdf.mjs';

const root = process.cwd();
const outDir = path.join(root, 'out');
const output = path.join(outDir, 'resume.pdf');
const port = Number(process.env.PDF_PORT ?? 3100);
const origin = `http://127.0.0.1:${port}`;

if (!existsSync(outDir)) {
  throw new Error('out/ 폴더가 없습니다. 먼저 `pnpm build`를 실행하세요.');
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// GitHub Pages처럼 `/games` → `games.html`, `/` → `index.html`을 찾아 준다.
const resolveFile = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '');
  const base = path.join(outDir, path.normalize(clean));
  if (!base.startsWith(outDir)) return null;
  for (const candidate of [base, `${base}.html`, path.join(base, 'index.html')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
};

const server = createServer((req, res) => {
  const file = resolveFile(req.url ?? '/');
  if (!file) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': contentTypes[path.extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

let browser;
try {
  browser = await puppeteer.launch(launchOptions);
  const pdf = await renderPdf(browser, { origin });
  writeFileSync(output, pdf);
  console.log(`PDF 생성 완료: ${path.relative(root, output)} (${pdf.length} bytes)`);
} finally {
  await browser?.close();
  server.close();
}
