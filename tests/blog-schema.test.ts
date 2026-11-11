import { expect, test } from 'vitest';
import { findDuplicateSlugs, findBadSlugs } from '../src/content/blog-checks';
import { lintFrontmatter } from '../src/content/lint-frontmatter';
import { postFrontmatter, SLUG_RE } from '../src/content/schemas';
import { parseYamlDate } from './helpers';

const base = { title: 'a', date: parseYamlDate('2026-11-11 08:00:00') };

test('null categories/tags become []', () => {
  const parsed = postFrontmatter.parse({ ...base, categories: null, tags: null });
  expect(parsed.categories).toEqual([]);
  expect(parsed.tags).toEqual([]);
  expect(postFrontmatter.parse(base).tags).toEqual([]);
});

test('index_img is rejected (strict)', () => {
  expect(postFrontmatter.safeParse({ ...base, index_img: '/img/Hexo.png' }).success).toBe(false);
});

test('cover must be a file name', () => {
  expect(postFrontmatter.safeParse({ ...base, cover: 'Hexo.png' }).success).toBe(true);
  expect(postFrontmatter.safeParse({ ...base, cover: '/img/Hexo.png' }).success).toBe(false);
});

test('at most two category levels', () => {
  expect(postFrontmatter.safeParse({ ...base, categories: ['a', 'b', 'c'] }).success).toBe(false);
});

test('rejects date with timezone offset', () => {
  expect(lintFrontmatter('---\ntitle: a\ndate: 2026-11-11T08:00:00+09:00\n---\n', 'x')).toHaveLength(1);
  expect(lintFrontmatter('---\ntitle: a\ndate: 2026-11-11 08:00:00\n---\n', 'x')).toEqual([]);
  expect(lintFrontmatter('---\ntitle: a\ndate: "2026-11-11 08:00:00"\n---\n', 'x')).toHaveLength(1);
  expect(lintFrontmatter('---\ntitle: a\n---\n', 'x')).toHaveLength(1);
});

test('rejects date without seconds, naming the file', () => {
  // YAML은 초가 없으면 날짜가 아니라 문자열로 읽는다. 원문 단계에서 파일 이름과 함께 멈춘다.
  const errors = lintFrontmatter('---\ntitle: a\ndate: 2026-11-11 08:00\n---\n', 'content/blog/posts/A/index.md');
  expect(errors).toHaveLength(1);
  expect(errors[0]).toMatch(/^content\/blog\/posts\/A\/index\.md: date 형식이 틀렸습니다/);
  expect(errors[0]).toContain('YYYY-MM-DD HH:mm:ss');
  expect(lintFrontmatter('---\ntitle: a\ndate: 2026-11-11\n---\n', 'x')).toHaveLength(1);
});

test('rejects bad slug', () => {
  expect(SLUG_RE.test('my post')).toBe(false);
  expect(SLUG_RE.test('글')).toBe(false);
  expect(SLUG_RE.test('-x')).toBe(false);
  expect(SLUG_RE.test('NAN-2026-Retrospective')).toBe(true);
  expect(findBadSlugs(['ok', 'my post'])).toEqual(['my post']);
});

test('rejects duplicate slug across posts and drafts', () => {
  expect(findDuplicateSlugs(['a', 'b'], ['b'])).toEqual(['b']);
  expect(findDuplicateSlugs(['a'], ['b'])).toEqual([]);
});
