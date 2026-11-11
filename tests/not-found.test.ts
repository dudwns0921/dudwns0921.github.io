import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { redirectTarget } from '../src/lib/redirects';

// 404 리다이렉트는 테마의 head 슬롯에 실려 나간다. 테마가 슬롯을 빠뜨리면 조용히 사라지므로 빌드 결과를 본다.
// 빌드 전(out/404.html이 없을 때)에는 건너뛴다. scripts/check-site.mjs의 '404 redirect'도 같은 것을 본다.
const built = existsSync('out/404.html');

test.runIf(built)('404.html carries the redirect script in <head>', () => {
  const html = readFileSync('out/404.html', 'utf8');
  const head = html.split(/<\/head>/i)[0];
  const scripts = [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const redirect = scripts.find((code) => code.includes('location.replace'));
  expect(redirect).toBeDefined();
  // 같은 규칙(src/lib/redirects.ts)이 번들되어 있다: /my-resume 접두어 · 페이지네이션 · nf-ready 표시.
  expect(redirect).toContain('/my-resume');
  expect(redirect).toContain('page');
  expect(redirect).toContain('nf-ready');
  expect(head).toContain('html:not(.nf-ready)');
  // 규칙 자체가 살아 있는지도 한 번 본다.
  expect(redirectTarget('/my-resume/')).toBe('/');
});
