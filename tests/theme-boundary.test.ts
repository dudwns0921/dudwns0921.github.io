import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

const THEMES_DIR = path.resolve(__dirname, '../src/themes');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

// 테마는 계약(props)으로 받은 데이터만 그린다. content/나 astro:content를 직접 읽으면 테마를 바꿀 때 데이터가 따라가지 않는다.
// 허용: src/content/types · inline · urls (모델 타입 · 문장 마크업 파서 · 주소 규칙).
// 정적 import(`from '…'`)와 동적 import(`import('…')`) 둘 다 본다.
const FORBIDDEN_IMPORT = /(?:from\s+|import\s*\(\s*)['"](astro:content|[^'"]*\/content\/(?!types|inline|urls)[^'"]*|[^'"]*\/content|node:fs|fs|fs\/promises|node:fs\/promises)['"]/;
const FORBIDDEN_GLOB = /import\.meta\.glob/;

test('theme does not import content directly', () => {
  const offenders = walk(THEMES_DIR)
    .filter((file) => /\.(ts|tsx|astro|mjs|js)$/.test(file))
    .flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => ({ line, i }))
        .filter(({ line }) => FORBIDDEN_IMPORT.test(line) || FORBIDDEN_GLOB.test(line))
        .map(({ line, i }) => `${path.relative(THEMES_DIR, file)}:${i + 1}: ${line.trim()}`),
    );
  expect(offenders).toEqual([]);
});

const themeNames = readdirSync(THEMES_DIR).filter((name) => statSync(path.join(THEMES_DIR, name)).isDirectory());

test.each(themeNames)('theme %s satisfies the contract', async (name) => {
  const theme = (await import(`../src/themes/${name}/index.ts`)).default;
  expect(Object.keys(theme).sort()).toEqual([
    'BlogIndexPage',
    'BlogListPage',
    'BlogPostPage',
    'GamesPage',
    'NotFoundPage',
    'ResumePage',
  ]);
});
