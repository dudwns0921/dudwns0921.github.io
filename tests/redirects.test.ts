import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { redirectTarget } from '../src/lib/redirects';

test('old resume paths', () => {
  expect(redirectTarget('/my-resume')).toBe('/');
  expect(redirectTarget('/my-resume/games')).toBe('/games');
  expect(redirectTarget('/my-resume/resume.pdf')).toBe('/resume.pdf');
});

test('root-level blog paths move under /blog', () => {
  expect(redirectTarget('/2026/09/08/NAN-2026-Retrospective/')).toBe('/blog/2026/09/08/NAN-2026-Retrospective/');
  expect(redirectTarget('/tags/Godot/')).toBe('/blog/tags/Godot/');
  expect(redirectTarget('/local-search.xml')).toBe('/blog/local-search.xml');
});

test('unknown paths stay', () => {
  expect(redirectTarget('/nope')).toBeNull();
  expect(redirectTarget('/blog/2026/09/08/NAN-2026-Retrospective/')).toBeNull();
});

test('pagination folds into the list', () => {
  expect(redirectTarget('/blog/page/2/')).toBe('/blog/');
  expect(redirectTarget('/blog/tags/Lv-1/page/2/')).toBe('/blog/tags/Lv-1/');
  expect(redirectTarget('/blog/categories/Coding-Test/Programmers/page/4/')).toBe('/blog/categories/Coding-Test/Programmers/');
  expect(redirectTarget('/page/3/')).toBe('/blog/');
  expect(redirectTarget('/blog/links/')).toBe('/blog/');
  expect(redirectTarget('/links/')).toBe('/blog/');
  expect(redirectTarget('/blog/page/2')).toBe('/blog/');
});

test('hexo redirect fixture', () => {
  const lines = readFileSync('tests/fixtures/hexo-redirects.txt', 'utf8').split('\n').filter(Boolean);
  expect(lines).toHaveLength(28);
  for (const line of lines) {
    const [from, to] = line.split(' ');
    expect(redirectTarget(from), from).toBe(to);
  }
});
