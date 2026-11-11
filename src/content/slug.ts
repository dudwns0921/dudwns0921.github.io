import { slugize as hexoSlugize } from 'hexo-util';

// Hexo와 같은 슬러그 (`Lv.1` → `Lv-1`, `AI 활용` → `AI-활용`). 대소문자를 유지한다.
// 태그 · 카테고리 주소와 제목 앵커 id가 Hexo 때와 같아야 옛 링크가 살아 있다.
export const slugize = (s: string): string => hexoSlugize(s, { transform: 0 });
