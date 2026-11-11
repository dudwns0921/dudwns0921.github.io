import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { postFrontmatter } from './content/schemas';

// 블로그 글과 초안. 글 하나 = 폴더 하나(content/blog/posts/<slug>/index.md + 그 글의 이미지). 폴더 이름이 슬러그다.
const entryLoader = (base: string) =>
  glob({ pattern: '*/index.md', base, generateId: ({ entry }) => entry.split('/')[0] });

const posts = defineCollection({
  loader: entryLoader('./content/blog/posts'),
  schema: postFrontmatter,
});

// 초안은 개발 서버에서만 읽는다. 운영 빌드에서는 렌더도 하지 않아 흔적(HTML · 이미지 · 색인)이 남지 않는다.
const drafts = defineCollection({
  loader: import.meta.env.DEV ? entryLoader('./content/blog/drafts') : () => [],
  schema: postFrontmatter,
});

export const collections = { posts, drafts };
