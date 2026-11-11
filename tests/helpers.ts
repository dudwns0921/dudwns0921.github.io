import { parseYaml } from '../src/content/yaml';

// 실제 로더(Astro frontmatter)와 같은 해석으로 날짜를 읽는다 (시간대 없는 값 → UTC).
export const parseYamlDate = (s: string): Date => (parseYaml(`d: ${s}`) as { d: Date }).d;
