import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';
import { postFrontmatter } from '../src/content/schemas';
import { permalink } from '../src/content/urls';
import { extractFrontmatter, parseYaml } from '../src/content/yaml';

// content/blog를 파일에서 바로 읽는다 (astro:content 없이). 빌드와 같은 YAML 설정 · 스키마를 쓴다.
const BLOG = 'content/blog';
const read = (kind: 'posts' | 'drafts') =>
  readdirSync(path.join(BLOG, kind)).map((slug) => {
    const raw = readFileSync(path.join(BLOG, kind, slug, 'index.md'));
    const text = raw.toString('utf8');
    const fm = extractFrontmatter(text)!;
    const head = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)![0];
    return { slug, data: postFrontmatter.parse(parseYaml(fm)), body: raw.subarray(Buffer.byteLength(head)) };
  });

const allPosts = read('posts');
// Hexo에서 옮긴 뒤 이 저장소에서 새로 낸 글. 옛 주소 목록 · 본문 고정값과 상관없으므로 아래 이전 검사에서 뺀다.
const NEW_POSTS = ['Using-AI-Well'];
const posts = allPosts.filter((p) => !NEW_POSTS.includes(p.slug));
const drafts = read('drafts');
const fixture = (name: string) =>
  readFileSync(path.join('tests/fixtures', name), 'utf8').split('\n').filter(Boolean);

// 초안 중 일부는 로컬에만 둔다 (.git/info/exclude). 그래서 저장소에 있는 초안만 이름으로 본다.
const TRACKED_DRAFTS = ['IndexedDB-Transaction'];

test('41 posts and tracked drafts', () => {
  expect(posts).toHaveLength(41);
  for (const slug of NEW_POSTS) expect(allPosts.map((p) => p.slug)).toContain(slug);
  const slugs = drafts.map((d) => d.slug);
  expect(slugs.length).toBeGreaterThanOrEqual(TRACKED_DRAFTS.length);
  for (const slug of TRACKED_DRAFTS) expect(slugs).toContain(slug);
});

test('every post url is in hexo list', () => {
  const hexo = new Set(fixture('hexo-urls.txt'));
  const urls = posts.map((p) => permalink(p.slug, p.data.date));
  expect(urls.filter((u) => !hexo.has(u))).toEqual([]);
  expect(new Set(urls).size).toBe(41);
});

test('bodies unchanged', () => {
  const expected = Object.fromEntries(fixture('hexo-body-sha256.txt').map((l) => l.split(' ')));
  // 운영 글 41편 + 저장소에 있는 초안. 로컬에만 있는 초안은 고정값에 넣지 않는다.
  const checked = [...posts, ...drafts.filter((d) => TRACKED_DRAFTS.includes(d.slug))];
  for (const entry of checked) {
    expect(createHash('sha256').update(entry.body).digest('hex'), entry.slug).toBe(expected[entry.slug]);
  }
  expect(Object.keys(expected).sort()).toEqual(checked.map((e) => e.slug).sort());
  expect(Object.keys(expected)).toHaveLength(41 + TRACKED_DRAFTS.length);
});

test('covers exist', () => {
  expect(posts.filter((p) => p.data.cover)).toHaveLength(34);
  for (const p of allPosts.filter((p) => p.data.cover)) expect(existsSync(path.join(BLOG, 'images', p.data.cover!)), p.slug).toBe(true);
});
