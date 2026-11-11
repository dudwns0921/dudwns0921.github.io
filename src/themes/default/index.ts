import type { Theme } from '../contract';
import ResumePage from './pages/ResumePage.astro';
import GamesPage from './pages/GamesPage.astro';
import BlogIndexPage from './pages/BlogIndexPage.astro';
import BlogListPage from './pages/BlogListPage.astro';
import BlogPostPage from './pages/BlogPostPage.astro';
import NotFoundPage from './pages/NotFoundPage.astro';

// 기본 테마. 이력서 디자인(Pretendard · 노란 강조 · 파란 점)을 블로그까지 쓴다.
export default { ResumePage, GamesPage, BlogIndexPage, BlogListPage, BlogPostPage, NotFoundPage } satisfies Theme;
