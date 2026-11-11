import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { getGames } from '../src/content/games';
import { stripInline } from '../src/content/inline';
import { parseYamlFile } from '../src/content/load-yaml';
import { getResume } from '../src/content/resume';
import { resumeSchemas } from '../src/content/schemas';
import { getSite } from '../src/content/site';
import { parseYaml } from '../src/content/yaml';

// 옛 src/data/*.ts와 같은 값인지는 이전 때 확인했다 (docs/plan/2026-11-11-blog-merge/build.md Task 5). 이제는 스키마만 본다.
test('resume and games parse', async () => {
  const resume = await getResume();
  expect(resume.workExperiences[0].title).toBe('오비고');
  expect(resume.activities.length).toBeGreaterThan(0);
  const games = await getGames();
  expect(games.games.map((g) => g.slug)).toEqual(['nostos', 'keros', 'outis']);
});

test('profile paragraphs keep the text', async () => {
  const { profile } = await getResume();
  const text = stripInline(profile.paragraphs.join(' '));
  expect(text).toContain('4년 연속 전사 상위 2% 인사평가 최고 등급');
  expect(text).toContain('588팀 중 본선 10팀');
  expect(profile.greeting).toEqual(['안녕하세요,', '믿고 맡길 수 있는', '정영준입니다']);
});

test('schema rejects unknown field', () => {
  const data = parseYaml(readFileSync('content/resume/workExperiences.yaml', 'utf8')) as Record<string, unknown>[];
  data[0].titel = 'x';
  expect(() => parseYamlFile(JSON.stringify(data), 'workExperiences.yaml', resumeSchemas.workExperiences)).toThrow(/titel/);
});

test('site meta', async () => {
  expect((await getSite()).origin).toBe('https://elioground.com');
});
