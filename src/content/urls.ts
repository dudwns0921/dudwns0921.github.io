import { slugize } from './slug';

// 사이트의 주소 규칙. 주소는 테마가 아니라 여기서 정한다 (테마를 바꿔도 주소는 그대로다).
const pad = (n: number) => String(n).padStart(2, '0');

export const RESUME_URL = '/';
export const GAMES_URL = '/games';
export const BLOG_URL = '/blog/';
// 운영에서는 빌드 때 만든 정적 PDF, 개발 서버에서는 그때그때 만드는 /api/pdf.
export const pdfUrl = (): string => (import.meta.env.PROD ? '/resume.pdf' : '/api/pdf');

export const RSS_URL = '/blog/rss.xml';
export const SEARCH_INDEX_URL = '/blog/search.json';

// Hexo의 `permalink: :year/:month/:day/:title/`과 같다.
// 글 날짜는 시간대 없는 벽시계 값이고 YAML이 UTC로 읽으므로, UTC 기준으로 꺼내면 적힌 날짜 그대로다.
export const permalink = (slug: string, date: Date): string =>
  `/blog/${date.getUTCFullYear()}/${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}/${slug}/`;

export const tagUrl = (name: string): string => `/blog/tags/${slugize(name)}/`;

export const categoryUrl = (path: string[]): string => `/blog/categories/${path.map(slugize).join('/')}/`;

export const archiveUrl = (year?: number, month?: number): string => {
  if (year === undefined) return '/blog/archives/';
  if (month === undefined) return `/blog/archives/${year}/`;
  return `/blog/archives/${year}/${pad(month)}/`;
};

export const tagsIndexUrl = (): string => '/blog/tags/';
export const categoriesIndexUrl = (): string => '/blog/categories/';

// 초안은 개발 서버에서만 이 주소로 보인다. 운영 출력에는 없다.
export const draftUrl = (slug: string): string => `/blog/drafts/${slug}/`;

// 대표 이미지(content/blog/images/<파일>)의 주소.
export const blogAssetUrl = (file: string): string => `/blog/img/${file}`;
