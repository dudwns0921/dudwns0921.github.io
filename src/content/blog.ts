import { getCollection, render, type CollectionEntry } from 'astro:content';
import { excerpt } from './excerpt';
import { slugize } from './slug';
import type { ArchiveYear, CategoryNode, PostSummary, TagCount } from './types';
import { archiveUrl, blogAssetUrl, categoryUrl, draftUrl, permalink, tagUrl } from './urls';

export { excerpt } from './excerpt';
export { findBadSlugs, findDuplicateSlugs } from './blog-checks';

// 블로그 읽기 API. 라우트(src/pages/blog)는 이것만 부르고, 테마에는 결과(PostSummary 등)만 넘긴다.

type Entry = CollectionEntry<'posts'> | CollectionEntry<'drafts'>;

const toSummary = (entry: Entry, isDraft: boolean): PostSummary => {
  const { data } = entry;
  const slug = entry.id;
  return {
    slug,
    title: data.title,
    date: data.date,
    url: isDraft ? draftUrl(slug) : permalink(slug, data.date),
    categories: data.categories,
    tags: data.tags.map((name) => ({ name, url: tagUrl(name) })),
    category: data.categories.length > 0 ? { path: data.categories, url: categoryUrl(data.categories) } : undefined,
    cover: data.cover ? blogAssetUrl(data.cover) : undefined,
    excerpt: data.description ?? excerpt(entry.body ?? ''),
    isDraft,
  };
};

// 최신 글이 앞에 온다.
const byDateDesc = (a: PostSummary, b: PostSummary) => b.date.getTime() - a.date.getTime() || a.slug.localeCompare(b.slug);

export const getPosts = async (): Promise<PostSummary[]> =>
  (await getCollection('posts')).map((entry) => toSummary(entry, false)).sort(byDateDesc);

// 초안은 개발 서버에서만 있다 (src/content.config.ts). 운영 빌드에서는 빈 배열이다.
export const getDrafts = async (): Promise<PostSummary[]> =>
  import.meta.env.DEV ? (await getCollection('drafts')).map((entry) => toSummary(entry, true)).sort(byDateDesc) : [];

export const getPostEntry = async (slug: string, isDraft = false) => {
  const entry = (await getCollection(isDraft ? 'drafts' : 'posts')).find((e) => e.id === slug);
  if (!entry) throw new Error(`글을 찾을 수 없습니다: ${slug}`);
  return { summary: toSummary(entry, isDraft), entry };
};

export const renderPost = async (entry: Entry) => render(entry);

// 글 하나의 앞뒤 글. prev = 바로 전에 쓴 글, next = 바로 다음에 쓴 글.
export const getNeighbors = (posts: PostSummary[], slug: string): { prev?: PostSummary; next?: PostSummary } => {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return { prev: posts[i + 1], next: posts[i - 1] };
};

export const getTags = async (posts?: PostSummary[]): Promise<TagCount[]> => {
  const all = posts ?? (await getPosts());
  const tags = new Map<string, TagCount>();
  for (const post of all) {
    for (const { name } of post.tags) {
      const slug = slugize(name);
      const tag = tags.get(slug) ?? { name, slug, url: tagUrl(name), count: 0 };
      tag.count++;
      tags.set(slug, tag);
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const postsWithTag = (posts: PostSummary[], slug: string) =>
  posts.filter((post) => post.tags.some((tag) => slugize(tag.name) === slug));

// 카테고리 나무. 위 단계의 글 수에는 아래 단계의 글도 들어간다 (Hexo와 같다).
export const getCategoryTree = async (posts?: PostSummary[]): Promise<CategoryNode[]> => {
  const all = posts ?? (await getPosts());
  const roots: CategoryNode[] = [];
  for (const post of all) {
    let level = roots;
    post.categories.forEach((name, depth) => {
      const path = post.categories.slice(0, depth + 1);
      let node = level.find((n) => slugize(n.name) === slugize(name));
      if (!node) {
        node = { name, path, url: categoryUrl(path), count: 0, children: [] };
        level.push(node);
      }
      node.count++;
      level = node.children;
    });
  }
  const sort = (nodes: CategoryNode[]): CategoryNode[] =>
    nodes.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).map((n) => ({ ...n, children: sort(n.children) }));
  return sort(roots);
};

export const flattenCategories = (nodes: CategoryNode[]): CategoryNode[] =>
  nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);

export const postsInCategory = (posts: PostSummary[], path: string[]) =>
  posts.filter((post) => path.every((name, i) => post.categories[i] !== undefined && slugize(post.categories[i]) === slugize(name)));

export const getArchives = async (posts?: PostSummary[]): Promise<ArchiveYear[]> => {
  const all = posts ?? (await getPosts());
  const years: ArchiveYear[] = [];
  for (const post of all) {
    const year = post.date.getUTCFullYear();
    const month = post.date.getUTCMonth() + 1;
    let y = years.find((x) => x.year === year);
    if (!y) years.push((y = { year, url: archiveUrl(year), months: [] }));
    let m = y.months.find((x) => x.month === month);
    if (!m) y.months.push((m = { month, url: archiveUrl(year, month), posts: [] }));
    m.posts.push(post);
  }
  return years;
};
