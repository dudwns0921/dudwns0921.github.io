import { extractFrontmatter } from './yaml';

// YAML이 시간대를 지워 UTC로 바꾸기 전에 원문 그대로 날짜 형식을 본다.
// `2026-11-11T08:00:00+09:00`처럼 시간대를 붙이면 주소 날짜가 하루 밀릴 수 있으므로 빌드를 멈춘다.
// 초까지 적어야 한다. `2026-11-11 08:00`(초 없음)은 YAML이 날짜가 아니라 문자열로 읽는다.
const DATE_LINE = /^date: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\s*$/;

export const lintFrontmatter = (raw: string, file: string): string[] => {
  const frontmatter = extractFrontmatter(raw);
  if (frontmatter === null) return [`${file}: frontmatter(---)가 없습니다.`];
  const dateLines = frontmatter.split(/\r?\n/).filter((line) => /^date\s*:/.test(line));
  if (dateLines.length === 0) return [`${file}: date가 없습니다. 'date: YYYY-MM-DD HH:mm:ss' 형식으로 씁니다.`];
  return dateLines
    .filter((line) => !DATE_LINE.test(line))
    .map((line) => `${file}: date 형식이 틀렸습니다 ('${line}'). 시간대 없이 'date: YYYY-MM-DD HH:mm:ss'로 씁니다.`);
};
