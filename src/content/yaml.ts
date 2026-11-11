import { parseDocument } from 'yaml';

// Astro가 frontmatter를 읽을 때와 같은 설정 (@astrojs/internal-helpers의 parseYaml).
// timestamp 태그를 켜야 `2022-10-14 08:30:26`이 Date(UTC)가 된다. 이력서 · 게임 YAML도 같은 설정으로 읽는다.
export const parseYaml = (source: string): unknown => {
  const document = parseDocument(source, { customTags: ['timestamp'], merge: true, schema: 'core' });
  if (document.errors.length > 0) throw document.errors[0];
  return document.toJS();
};

// `---`로 감싼 frontmatter 원문을 꺼낸다. 없으면 null.
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?(\n|$)/;

export const extractFrontmatter = (raw: string): string | null => {
  const match = raw.match(FRONTMATTER_RE);
  return match ? match[1] : null;
};

// frontmatter를 뗀 본문. Astro가 remark에 넘기는 것과 같은 범위다. frontmatter가 없으면 그대로.
export const stripFrontmatter = (raw: string): string => {
  const match = raw.match(FRONTMATTER_RE);
  return match ? raw.slice(match[0].length) : raw;
};
