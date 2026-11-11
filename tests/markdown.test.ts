import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { afterEach, expect, test, vi } from 'vitest';
import rehypeHexoHeadingIds from '../src/content/markdown/rehype-hexo-heading-ids';
import remarkPostAssets from '../src/content/markdown/remark-post-assets';
import { parseYamlDate } from './helpers';

const root = mkdtempSync(path.join(tmpdir(), 'md-'));

// content/blog/<kind>/<slug>/index.md 와 그 폴더의 파일들을 만든다.
const entry = (kind: 'posts' | 'drafts', slug: string, files: string[] = []) => {
  const dir = path.join(root, 'content', 'blog', kind, slug);
  mkdirSync(dir, { recursive: true });
  for (const f of files) writeFileSync(path.join(dir, f), '');
  return path.join(dir, 'index.md');
};

const render = (markdown: string, filePath?: string, date = '2026-09-08 14:00:00') => {
  const file = new VFile({ value: markdown, path: filePath });
  file.data = { astro: { frontmatter: { date: parseYamlDate(date) } } };
  return String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkPostAssets)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHexoHeadingIds)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(file),
  );
};

afterEach(() => vi.restoreAllMocks());

test('rewrites relative image to permalink path', () => {
  const file = entry('posts', 'NAN-2026-Retrospective', ['worldview-1.png']);
  expect(render('![a](worldview-1.png)', file)).toContain('src="/blog/2026/09/08/NAN-2026-Retrospective/worldview-1.png"');
});

test('keeps absolute and external images', () => {
  const file = entry('posts', 'Abs');
  const html = render('![a](/blog/x.gif) ![b](https://example.com/y.png)', file);
  expect(html).toContain('src="/blog/x.gif"');
  expect(html).toContain('src="https://example.com/y.png"');
});

test('ignores images inside code', () => {
  const file = entry('posts', 'Code');
  const html = render('```\n![](image.jpg)\n```\n\n`![](b.png)`', file);
  expect(html).toContain('![](image.jpg)');
});

test('fails on missing asset', () => {
  const file = entry('posts', 'Missing');
  expect(() => render('![a](nope.png)', file)).toThrow(/nope\.png/);
});

test('warns only for drafts', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const file = entry('drafts', 'Draft');
  expect(render('![a](image1.PNG)', file)).toContain('src="/blog/drafts/Draft/image1.PNG"');
  expect(warn).toHaveBeenCalledOnce();
});

test('draft images use the draft url', () => {
  const file = entry('drafts', 'DraftOk', ['a.png']);
  expect(render('![a](a.png)', file)).toContain('src="/blog/drafts/DraftOk/a.png"');
});

test('keeps extension case', () => {
  const file = entry('posts', 'Case', ['image1.PNG']);
  expect(render('![a](image1.PNG)', file)).toContain('/image1.PNG"');
  expect(() => render('![a](image1.png)', file)).toThrow(/image1\.png/);
});

test('rejects images in subfolders or other folders', () => {
  // content-assets는 글 폴더 바로 아래 파일만 복사한다. 하위 폴더의 파일이 실제로 있어도 실패해야 한다.
  const file = entry('posts', 'Sub', ['a.png']);
  mkdirSync(path.join(path.dirname(file), 'img'), { recursive: true });
  writeFileSync(path.join(path.dirname(file), 'img', 'b.png'), '');
  entry('posts', 'Other', ['c.png']);
  expect(() => render('![b](img/b.png)', file)).toThrow(/바로 아래/);
  expect(() => render('![b](./img/b.png)', file)).toThrow(/바로 아래/);
  expect(() => render('![c](../Other/c.png)', file)).toThrow(/바로 아래/);
  expect(render('![a](./a.png)', file)).toContain('src="/blog/2026/09/08/Sub/a.png"');
});

test('rewrites and checks reference-style images', () => {
  const file = entry('posts', 'Ref', ['a.png']);
  const html = render('![그림][fig]\n\n[글][site]\n\n[fig]: a.png\n[site]: other.html\n', file);
  expect(html).toContain('src="/blog/2026/09/08/Ref/a.png"');
  // 링크 참조의 정의는 이미지가 아니므로 건드리지 않는다.
  expect(html).toContain('href="other.html"');
  expect(() => render('![그림][fig]\n\n[fig]: nope.png\n', file)).toThrow(/nope\.png/);
});

test('hexo heading ids', () => {
  const html = render('# AI 활용\n\n## AI 활용\n\n## config.yml\n\n### `Lv.1` 문제');
  expect(html).toContain('<h1 id="AI-활용">');
  expect(html).toContain('<h2 id="AI-활용-1">');
  expect(html).toContain('<h2 id="config-yml">');
  expect(html).toContain('<h3 id="Lv-1-문제">');
});
