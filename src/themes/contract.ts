import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type {
  CategoryNode,
  GamesData,
  MarkdownHeading,
  PostSummary,
  Resume,
  SiteMeta,
  TagCount,
} from '../content/types';

// 테마가 지켜야 할 계약. 새 테마는 src/themes/<이름>/index.ts에서 `{ ... } satisfies Theme`으로 내보낸다.
// 테마는 props로 받은 데이터만 그린다 (content/ · astro:content · 파일 읽기 금지 — tests/theme-boundary.test.ts).
//
// 타입으로 못 막는 행동 규칙:
// - ResumePage는 JS 없이도 완성된 HTML이어야 한다 (PDF는 load 직후 찍는다). 화면 폭 800px에서 PDF 레이아웃이 나와야 한다.
// - 인쇄에서 숨길 요소에 `no-pdf` 클래스를 쓰고, 테마 CSS가 `@media print { .no-pdf { display: none } }`를 갖는다.
// - 주소는 직접 만들지 않고 src/content/urls.ts의 함수나 props로 받은 값을 쓴다.
// - NotFoundPage는 `head` 이름의 슬롯을 <head> 안에 그대로 넣는다 (라우트가 옛 주소 리다이렉트 스크립트를 넣는다).
// - BlogPostPage는 isDraft면 <meta name="robots" content="noindex">를 넣는다.

// .astro 컴포넌트(또는 같은 모양의 함수). props만 받는다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThemeComponent<P> = (props: P) => any;

// render()가 돌려주는 본문 컴포넌트.
export type ContentComponent = AstroComponentFactory;

export interface ResumePageProps {
  site: SiteMeta;
  resume: Resume;
  pdfUrl: string;
  gamesUrl: string;
  blogUrl: string;
}

export interface GamesPageProps {
  site: SiteMeta;
  games: GamesData;
}

export interface BlogIndexPageProps {
  site: SiteMeta;
  posts: PostSummary[];
  // 개발 서버에서만 채워진다 (운영은 빈 배열).
  drafts: PostSummary[];
  tags: TagCount[];
  categories: CategoryNode[];
  searchIndexUrl: string;
}

export interface BlogListPageProps {
  site: SiteMeta;
  kind: 'tag' | 'category' | 'archive' | 'tags' | 'categories';
  title: string;
  posts: PostSummary[];
  tags?: TagCount[];
  categories?: CategoryNode[];
}

export interface BlogPostPageProps {
  site: SiteMeta;
  post: PostSummary;
  Content: ContentComponent;
  headings: MarkdownHeading[];
  prev?: PostSummary;
  next?: PostSummary;
  isDraft: boolean;
}

export interface NotFoundPageProps {
  site: SiteMeta;
}

export interface Theme {
  ResumePage: ThemeComponent<ResumePageProps>;
  GamesPage: ThemeComponent<GamesPageProps>;
  BlogIndexPage: ThemeComponent<BlogIndexPageProps>;
  BlogListPage: ThemeComponent<BlogListPageProps>;
  BlogPostPage: ThemeComponent<BlogPostPageProps>;
  NotFoundPage: ThemeComponent<NotFoundPageProps>;
}
