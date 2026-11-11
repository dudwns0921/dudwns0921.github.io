import type { APIRoute } from 'astro';
import { getPosts } from '../../content/blog';

// 블로그 검색 색인. 목록 페이지의 검색 상자가 받아 제목 · 태그 · 카테고리 · 요약으로 거른다. 초안은 들어가지 않는다.
const pad = (n: number) => String(n).padStart(2, '0');

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const index = posts.map((post) => ({
    title: post.title,
    url: post.url,
    date: `${post.date.getUTCFullYear()}-${pad(post.date.getUTCMonth() + 1)}-${pad(post.date.getUTCDate())}`,
    tags: post.tags.map((tag) => tag.name),
    categories: post.categories,
    excerpt: post.excerpt,
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
