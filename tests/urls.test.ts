import { expect, test } from 'vitest';
import { slugize } from '../src/content/slug';
import { categoryUrl, permalink, tagUrl } from '../src/content/urls';
import { parseYamlDate } from './helpers';

test('yaml reads wall-clock dates as UTC', () => {
  expect(parseYamlDate('2022-10-14 08:30:26')).toBeInstanceOf(Date);
});

test('permalink uses the written date', () => {
  expect(permalink('Making-Hexo-Blog', parseYamlDate('2022-10-14 08:30:26'))).toBe('/blog/2022/10/14/Making-Hexo-Blog/');
  expect(permalink('Coding-Test-Programmers-basic', parseYamlDate('2024-01-08 00:00:00'))).toBe(
    '/blog/2024/01/08/Coding-Test-Programmers-basic/',
  );
  expect(permalink('Late', parseYamlDate('2026-09-08 23:59:59'))).toBe('/blog/2026/09/08/Late/');
});

test('hexo-compatible slugs', () => {
  expect(tagUrl('Lv.1')).toBe('/blog/tags/Lv-1/');
  expect(tagUrl('Basic Training')).toBe('/blog/tags/Basic-Training/');
  expect(tagUrl('indexedDB')).toBe('/blog/tags/indexedDB/');
  expect(categoryUrl(['Coding-Test', 'Programmers'])).toBe('/blog/categories/Coding-Test/Programmers/');
  expect(slugize('AI 활용')).toBe('AI-활용');
  expect(slugize('config.yml')).toBe('config-yml');
});
