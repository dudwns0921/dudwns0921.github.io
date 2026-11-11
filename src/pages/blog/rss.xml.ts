import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '../../content/blog';
import { getSite } from '../../content/site';
import { BLOG_URL } from '../../content/urls';

// 운영 글 최신 20개. 초안은 들어가지 않는다.
// 글 날짜는 한국 벽시계 값을 UTC로 읽은 Date다 (주소 · 화면의 날짜는 그 값 그대로 쓴다).
// 피드의 pubDate는 실제 시각이어야 하므로 KST(+09:00)로 보고 9시간을 뺀다.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
export const GET: APIRoute = async () => {
  const [site, posts] = await Promise.all([getSite(), getPosts()]);
  return rss({
    title: site.blog.title,
    description: site.blog.description,
    site: new URL(BLOG_URL, site.origin).href,
    items: posts.slice(0, 20).map((post) => ({
      title: post.title,
      link: new URL(post.url, site.origin).href,
      pubDate: new Date(post.date.getTime() - KST_OFFSET_MS),
      description: post.excerpt,
      categories: post.tags.map((tag) => tag.name),
    })),
    customData: '<language>ko</language>',
  });
};
