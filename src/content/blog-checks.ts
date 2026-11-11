import { SLUG_RE } from './schemas';

// 글 · 초안 폴더 이름(= 주소의 슬러그) 검사. content-assets 통합이 빌드 시작 때 돌린다.
export const findBadSlugs = (slugs: string[]): string[] => slugs.filter((slug) => !SLUG_RE.test(slug));

// 글과 초안을 통틀어 슬러그는 하나뿐이어야 한다 (초안을 글로 옮길 때 주소가 겹치지 않게).
export const findDuplicateSlugs = (posts: string[], drafts: string[]): string[] => {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const slug of [...posts, ...drafts]) {
    if (seen.has(slug)) dup.add(slug);
    seen.add(slug);
  }
  return [...dup];
};
