import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

// 빌드 뒤 out/을 본다 (pnpm build 다음에 돌린다). 빌드 전(out/index.html이 없을 때)에는 건너뛴다.
// 배포 워크플로는 빌드 전에 테스트를 돌리므로, 빌드 결과는 scripts/check-site.mjs도 따로 본다.
const built = existsSync('out/index.html');
// 초안 일부는 로컬에만 있으므로 이름을 고정하지 않고 지금 폴더에 있는 것을 본다.
const DRAFTS = 'content/blog/drafts';
const draftSlugs = existsSync(DRAFTS) ? readdirSync(DRAFTS).filter((n) => statSync(path.join(DRAFTS, n)).isDirectory()) : [];

// 운영 글 수 (Hexo에서 옮긴 41편 + 그 뒤에 낸 글). 글을 낼 때마다 고치지 않도록 폴더를 센다.
const POSTS = 'content/blog/posts';
const postCount = readdirSync(POSTS).filter((n) => statSync(path.join(POSTS, n)).isDirectory()).length;

test.runIf(built)('search index has every post and no drafts', () => {
  expect(postCount).toBeGreaterThanOrEqual(41);
  const raw = readFileSync('out/blog/search.json', 'utf8');
  const index = JSON.parse(raw) as { title: string; url: string; date: string; tags: string[]; categories: string[]; excerpt: string }[];
  expect(index).toHaveLength(postCount);
  expect(index[0]).toEqual(
    expect.objectContaining({ url: expect.stringMatching(/^\/blog\/\d{4}\/\d{2}\/\d{2}\/[A-Za-z0-9-]+\/$/), date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) }),
  );
  for (const slug of draftSlugs) expect(index.some((e) => e.url.split('/').includes(slug)), slug).toBe(false);
  expect(raw).not.toContain('/blog/drafts/');
});

test.runIf(built)('rss has 20 items with absolute links', () => {
  const xml = readFileSync('out/blog/rss.xml', 'utf8');
  const links = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((m) => m[1]);
  expect(links).toHaveLength(20);
  for (const link of links) expect(link.startsWith('https://elioground.com/blog/')).toBe(true);
  for (const slug of draftSlugs) expect(links.some((l) => l.split('/').includes(slug)), slug).toBe(false);
  expect(xml).not.toContain('/blog/drafts/');
});

test.runIf(built)('rss pubDate is the post date read as KST', () => {
  const xml = readFileSync('out/blog/rss.xml', 'utf8');
  const index = JSON.parse(readFileSync('out/blog/search.json', 'utf8')) as { url: string; date: string }[];
  const items = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)];
  for (const [item, link] of items) {
    const pubDate = new Date(item.match(/<pubDate>([^<]+)<\/pubDate>/)![1]);
    // 주소의 날짜(벽시계)는 그대로이고, pubDate를 한국 시간으로 바꾼 날짜가 주소의 날짜와 같다.
    const kstDay = new Date(pubDate.getTime() + 9 * 3600_000).toISOString().slice(0, 10);
    const urlDay = link.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//)!.slice(1).join('-');
    expect(kstDay, link).toBe(urlDay);
    expect(index.find((e) => link.endsWith(e.url))?.date, link).toBe(urlDay);
  }
});
