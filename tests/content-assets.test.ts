import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';
import { syncContentAssets } from '../src/integrations/content-assets';

const fixture = (posts: Record<string, string>, drafts: Record<string, string> = {}) => {
  const root = mkdtempSync(path.join(tmpdir(), 'assets-'));
  const write = (kind: string, slug: string, frontmatter: string, files: string[]) => {
    const dir = path.join(root, 'content', 'blog', kind, slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, 'index.md'), `---\ntitle: t\n${frontmatter}\n---\nbody\n`);
    for (const f of files) writeFileSync(path.join(dir, f), 'x');
  };
  for (const [slug, fm] of Object.entries(posts)) write('posts', slug, fm, ['a.png']);
  for (const [slug, fm] of Object.entries(drafts)) write('drafts', slug, fm, ['d.png']);
  mkdirSync(path.join(root, 'content', 'blog', 'images'), { recursive: true });
  writeFileSync(path.join(root, 'content', 'blog', 'images', 'cover.png'), 'x');
  mkdirSync(path.join(root, 'content', 'games', 'keros'), { recursive: true });
  writeFileSync(path.join(root, 'content', 'games', 'keros', 'banner.jpg'), 'x');
  return root;
};

test('copies post assets to permalink folders', () => {
  const root = fixture({ 'My-Post': 'date: 2026-09-08 14:00:00' }, { 'My-Draft': 'date: 2026-10-02 12:00:00' });
  syncContentAssets({ root, includeDrafts: false });
  expect(existsSync(path.join(root, 'public/blog/2026/09/08/My-Post/a.png'))).toBe(true);
  expect(existsSync(path.join(root, 'public/blog/2026/09/08/My-Post/index.md'))).toBe(false);
  expect(existsSync(path.join(root, 'public/blog/img/cover.png'))).toBe(true);
  expect(existsSync(path.join(root, 'public/activities/keros/banner.jpg'))).toBe(true);
  // 운영 빌드에서는 초안 이미지를 복사하지 않는다.
  expect(existsSync(path.join(root, 'public/blog/drafts'))).toBe(false);
});

test('copies draft assets in dev', () => {
  const root = fixture({}, { 'My-Draft': 'date: 2026-10-02 12:00:00' });
  syncContentAssets({ root, includeDrafts: true });
  expect(existsSync(path.join(root, 'public/blog/drafts/My-Draft/d.png'))).toBe(true);
});

test('fails on timezone date, bad slug and duplicate slug', () => {
  expect(() => syncContentAssets({ root: fixture({ A: 'date: 2026-11-11T08:00:00+09:00' }), includeDrafts: false })).toThrow(
    /date 형식/,
  );
  expect(() => syncContentAssets({ root: fixture({ 'my post': 'date: 2026-11-11 08:00:00' }), includeDrafts: false })).toThrow(
    /my post/,
  );
  expect(() =>
    syncContentAssets({
      root: fixture({ Same: 'date: 2026-11-11 08:00:00' }, { Same: 'date: 2026-11-11 08:00:00' }),
      includeDrafts: false,
    }),
  ).toThrow(/Same/);
});

test('fails on missing post image even without rendering', () => {
  const root = fixture({ Img: 'date: 2026-11-11 08:00:00' });
  const file = path.join(root, 'content/blog/posts/Img/index.md');
  writeFileSync(file, '---\ntitle: t\ndate: 2026-11-11 08:00:00\n---\n![](a.png)\n\n```\n![](in-code.png)\n```\n');
  expect(() => syncContentAssets({ root, includeDrafts: false })).not.toThrow();
  writeFileSync(file, '---\ntitle: t\ndate: 2026-11-11 08:00:00\n---\n![](A.png)\n');
  expect(() => syncContentAssets({ root, includeDrafts: false })).toThrow(/A\.png/);
});

test('fails on date without seconds with the file name', () => {
  expect(() => syncContentAssets({ root: fixture({ NoSec: 'date: 2026-11-11 08:00' }), includeDrafts: false })).toThrow(
    /content\/blog\/posts\/NoSec\/index\.md: date 형식/,
  );
});

test('fails on subfolder and reference-style images, ignores frontmatter text', () => {
  const root = fixture({ Img: 'date: 2026-11-11 08:00:00' });
  const dir = path.join(root, 'content/blog/posts/Img');
  const file = path.join(dir, 'index.md');
  mkdirSync(path.join(dir, 'img'), { recursive: true });
  writeFileSync(path.join(dir, 'img', 'b.png'), 'x');
  // 하위 폴더의 파일은 복사되지 않으므로 파일이 있어도 실패한다.
  writeFileSync(file, '---\ntitle: t\ndate: 2026-11-11 08:00:00\n---\n![](img/b.png)\n');
  expect(() => syncContentAssets({ root, includeDrafts: false })).toThrow(/바로 아래/);
  // 참조형 이미지도 같은 검사를 받는다.
  writeFileSync(file, '---\ntitle: t\ndate: 2026-11-11 08:00:00\n---\n![x][r]\n\n[r]: nope.png\n');
  expect(() => syncContentAssets({ root, includeDrafts: false })).toThrow(/nope\.png/);
  writeFileSync(file, '---\ntitle: t\ndate: 2026-11-11 08:00:00\n---\n![x][r]\n\n[r]: a.png\n');
  expect(() => syncContentAssets({ root, includeDrafts: false })).not.toThrow();
  // frontmatter 안의 이미지 문법은 본문이 아니다 (remark 플러그인도 보지 않는다).
  writeFileSync(file, '---\ntitle: "![](x.png) 쓰는 법"\ndate: 2026-11-11 08:00:00\n---\nbody\n');
  expect(() => syncContentAssets({ root, includeDrafts: false })).not.toThrow();
});
