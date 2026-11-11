import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { assetProblem, forEachImageUrl } from '../content/markdown/remark-post-assets';
import { findBadSlugs, findDuplicateSlugs } from '../content/blog-checks';
import { lintFrontmatter } from '../content/lint-frontmatter';
import { draftUrl, permalink } from '../content/urls';
import { extractFrontmatter, parseYaml, stripFrontmatter } from '../content/yaml';

// content/의 이미지를 public/의 같은 주소로 복사한다 (dev · build 둘 다). public/blog · public/activities는 생성물이다.
// - content/blog/posts/<slug>/<파일>  → public/blog/YYYY/MM/DD/<slug>/<파일>  (Hexo 때와 같은 주소)
// - content/blog/drafts/<slug>/<파일> → public/blog/drafts/<slug>/<파일>      (개발 서버에서만)
// - content/blog/images/<파일>        → public/blog/img/<파일>                 (대표 이미지)
// - content/games/<slug>/banner.jpg   → public/activities/<slug>/banner.jpg
// 시작할 때 글 · 초안의 슬러그와 날짜 형식을 검사하고, 틀리면 빌드를 멈춘다.

const listDirs = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((name) => !name.startsWith('.') && statSync(path.join(dir, name)).isDirectory()) : [];

const listFiles = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((name) => !name.startsWith('.') && statSync(path.join(dir, name)).isFile()) : [];

const copyFile = (from: string, to: string) => {
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to);
};

export interface SyncOptions {
  root: string;
  includeDrafts: boolean;
}

export const syncContentAssets = ({ root, includeDrafts }: SyncOptions): { copied: number } => {
  const contentDir = path.join(root, 'content');
  const publicDir = path.join(root, 'public');
  const postsDir = path.join(contentDir, 'blog', 'posts');
  const draftsDir = path.join(contentDir, 'blog', 'drafts');

  const postSlugs = listDirs(postsDir);
  const draftSlugs = listDirs(draftsDir);
  const errors: string[] = [];

  for (const slug of findBadSlugs([...postSlugs, ...draftSlugs])) {
    errors.push(`글 폴더 이름 '${slug}'은 주소에 쓸 수 없습니다. 영문 · 숫자 · '-'만 씁니다 (^[A-Za-z0-9][A-Za-z0-9-]*$).`);
  }
  for (const slug of findDuplicateSlugs(postSlugs, draftSlugs)) {
    errors.push(`슬러그 '${slug}'가 글과 초안에 함께 있습니다. 하나만 둡니다.`);
  }

  // 본문의 상대 이미지가 글 폴더에 있는지 매번 본다. remark 플러그인도 같은 검사를 하지만,
  // Astro가 바뀌지 않은 글의 렌더 결과를 캐시에서 꺼내면 플러그인이 돌지 않아 이미지 파일만 바뀐 경우를 놓친다.
  const parser = unified().use(remarkParse).use(remarkGfm);
  // remark 플러그인과 같은 범위(frontmatter를 뗀 본문) · 같은 노드 · 같은 판단(assetProblem)을 쓴다.
  const checkAssets = (raw: string, entryDir: string, file: string, isDraft: boolean) => {
    forEachImageUrl(parser.parse(stripFrontmatter(raw)), (node) => {
      const problem = assetProblem(node.url, entryDir);
      if (!problem) return;
      const message = `${file}: ${problem.replace(root + path.sep, '')}`;
      if (isDraft) warnings.push(message);
      else errors.push(message);
    });
  };
  const warnings: string[] = [];

  const readEntry = (dir: string, slug: string, isDraft = false) => {
    const file = path.join(dir, slug, 'index.md');
    if (!existsSync(file)) {
      errors.push(`${path.relative(root, path.join(dir, slug))}: index.md가 없습니다.`);
      return null;
    }
    const raw = readFileSync(file, 'utf8');
    checkAssets(raw, path.join(dir, slug), path.relative(root, file), isDraft);
    const lint = lintFrontmatter(raw, path.relative(root, file));
    errors.push(...lint);
    if (lint.length > 0) return null;
    const data = parseYaml(extractFrontmatter(raw) ?? '') as { date?: unknown };
    return data.date instanceof Date ? data.date : null;
  };

  const posts = postSlugs.map((slug) => ({ slug, date: readEntry(postsDir, slug) }));
  for (const slug of draftSlugs) readEntry(draftsDir, slug, true);
  if (includeDrafts) for (const w of warnings) console.warn(`[초안] ${w}`);

  if (errors.length > 0) {
    throw new Error(`content/ 검사에서 오류 ${errors.length}개:\n- ${errors.join('\n- ')}`);
  }

  rmSync(path.join(publicDir, 'blog'), { recursive: true, force: true });
  rmSync(path.join(publicDir, 'activities'), { recursive: true, force: true });

  let copied = 0;
  const copyEntryFiles = (dir: string, slug: string, base: string) => {
    for (const name of listFiles(path.join(dir, slug))) {
      if (name === 'index.md') continue;
      copyFile(path.join(dir, slug, name), path.join(publicDir, base, name));
      copied++;
    }
  };

  for (const { slug, date } of posts) copyEntryFiles(postsDir, slug, permalink(slug, date!));
  if (includeDrafts) for (const slug of draftSlugs) copyEntryFiles(draftsDir, slug, draftUrl(slug));

  const imagesDir = path.join(contentDir, 'blog', 'images');
  for (const name of listFiles(imagesDir)) {
    copyFile(path.join(imagesDir, name), path.join(publicDir, 'blog', 'img', name));
    copied++;
  }

  const gamesDir = path.join(contentDir, 'games');
  for (const slug of listDirs(gamesDir)) {
    const banner = path.join(gamesDir, slug, 'banner.jpg');
    if (!existsSync(banner)) continue;
    copyFile(banner, path.join(publicDir, 'activities', slug, 'banner.jpg'));
    copied++;
  }

  return { copied };
};

export default function contentAssets(): AstroIntegration {
  let root = '';
  let includeDrafts = false;
  return {
    name: 'content-assets',
    hooks: {
      'astro:config:setup': ({ config, command, logger }) => {
        root = fileURLToPath(config.root);
        includeDrafts = command === 'dev';
        const { copied } = syncContentAssets({ root, includeDrafts });
        logger.info(`content/의 파일 ${copied}개를 public/에 복사했습니다.`);
      },
      // 개발 중에 content/가 바뀌면 다시 복사한다.
      'astro:server:setup': ({ server, logger }) => {
        const contentDir = path.join(root, 'content') + path.sep;
        let timer: ReturnType<typeof setTimeout> | undefined;
        server.watcher.add(contentDir);
        server.watcher.on('all', (_event, file) => {
          if (!file.startsWith(contentDir) || file.endsWith('.yaml')) return;
          clearTimeout(timer);
          timer = setTimeout(() => {
            try {
              syncContentAssets({ root, includeDrafts });
            } catch (error) {
              logger.error(String(error));
            }
          }, 200);
        });
      },
    },
  };
}
