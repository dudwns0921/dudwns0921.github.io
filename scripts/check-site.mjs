// 빌드 뒤 out/ 검사. `pnpm build && pnpm pdf` 다음에 돌린다 (/resume.pdf가 있어야 한다).
// 실패하면 이유를 모두 출력하고 exit 1.
//  - hexo urls present: tests/fixtures/hexo-urls.txt의 주소(옛 Hexo 블로그 107개)가 모두 out/에 파일로 있다
//  - drafts absent: out/에 /blog/drafts/ 경로 · 주소가 없고, 초안 슬러그의 글 주소(/blog/YYYY/MM/DD/<slug>/)인 파일 · 링크,
//    검색 색인 · RSS의 초안 항목(주소 · 제목)이 없다
//  - internal links resolve: HTML의 href · src 중 사이트 안 주소가 out/에 있다
//  - core files: 이력서 · 게임 · 404 · PDF · 블로그 첫 화면
//  - 404 redirect: out/404.html의 <head>에 옛 주소 리다이렉트 스크립트가 있다 (테마가 head 슬롯을 빠뜨리면 조용히 사라진다)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
// Node 22.18+ · 24는 .ts의 타입을 지우고 바로 읽는다. 404.html과 같은 리다이렉트 규칙을 쓴다.
import { redirectTarget } from '../src/lib/redirects.ts';
import { extractFrontmatter, parseYaml } from '../src/content/yaml.ts';

const root = process.cwd();
const outDir = path.join(root, 'out');
const ORIGIN = 'https://elioground.com';
const failures = [];
const checks = [];

if (!existsSync(outDir)) {
  console.error('out/ 폴더가 없습니다. 먼저 `pnpm build && pnpm pdf`를 실행하세요.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const files = walk(outDir);
const rel = (file) => `/${path.relative(outDir, file).split(path.sep).join('/')}`;

// 주소 → out/ 파일. '/'로 끝나면 index.html, 아니면 그 파일 또는 폴더의 index.html (GitHub Pages와 같다).
const exists = (urlPath) => {
  let clean;
  try {
    clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  } catch {
    clean = urlPath.split(/[?#]/)[0];
  }
  const base = path.join(outDir, clean);
  if (!base.startsWith(outDir)) return false;
  if (clean.endsWith('/')) return existsSync(path.join(base, 'index.html'));
  return (existsSync(base) && statSync(base).isFile()) || existsSync(path.join(base, 'index.html'));
};

const check = (name, fn) => {
  const before = failures.length;
  fn();
  checks.push(name);
  console.log(`${failures.length === before ? 'PASS' : 'FAIL'} ${name}`);
};

check('hexo urls present', () => {
  const urls = readFileSync(path.join(root, 'tests/fixtures/hexo-urls.txt'), 'utf8').split('\n').filter(Boolean);
  if (urls.length !== 107) failures.push(`hexo-urls.txt가 107줄이 아닙니다 (${urls.length})`);
  for (const url of urls) if (!exists(url)) failures.push(`옛 블로그 주소가 out/에 없습니다: ${url}`);
});

// 초안 슬러그와 제목. 슬러그를 글자 그대로 찾으면 'Godot' 같은 흔한 이름이 운영 글 · 태그(/blog/tags/Godot/) · 본문에
// 걸리므로, 초안이 샐 때 생기는 주소 모양으로만 찾는다: /blog/drafts/… 와 글 주소 /blog/YYYY/MM/DD/<slug>/
// (슬러그는 글과 초안을 통틀어 하나뿐이므로 이 주소가 있으면 샌 것이다). 검색 색인 · RSS는 항목의 주소 · 제목으로 본다.
const readDrafts = () => {
  const draftsDir = path.join(root, 'content/blog/drafts');
  if (!existsSync(draftsDir)) return [];
  return readdirSync(draftsDir)
    .filter((n) => statSync(path.join(draftsDir, n)).isDirectory())
    .map((slug) => {
      const file = path.join(draftsDir, slug, 'index.md');
      const fm = existsSync(file) ? extractFrontmatter(readFileSync(file, 'utf8')) : null;
      let title = null;
      try {
        title = fm ? (parseYaml(fm)?.title ?? null) : null;
      } catch {
        title = null;
      }
      return { slug, title: typeof title === 'string' ? title : null };
    });
};
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const decodeXml = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

check('drafts absent', () => {
  const drafts = readDrafts();
  if (existsSync(path.join(outDir, 'blog/drafts'))) failures.push('out/blog/drafts/가 있습니다');
  const postUrlRe = (slug) => new RegExp(`/blog/\\d{4}/\\d{2}/\\d{2}/${escapeRe(slug)}(/|$)`);
  const slugRes = drafts.map(({ slug }) => ({ slug, re: postUrlRe(slug) }));
  for (const file of files) {
    const name = rel(file);
    // 경로: /blog/drafts/ 아래이거나, 초안 슬러그의 글 주소(/blog/YYYY/MM/DD/<slug>/) 아래.
    if (name.includes('/blog/drafts/')) failures.push(`초안 경로가 out/에 있습니다: ${name}`);
    for (const { slug, re } of slugRes) {
      if (re.test(name)) failures.push(`초안 '${slug}'이 파일 경로에 있습니다: ${name}`);
    }
    if (!/\.(html|json|xml|txt|js)$/.test(file)) continue;
    // 내용: 초안 주소(/blog/drafts/…)나 초안 슬러그의 글 주소.
    const text = readFileSync(file, 'utf8');
    if (text.includes('/blog/drafts/')) failures.push(`초안 주소(/blog/drafts/)가 ${name} 안에 있습니다`);
    for (const { slug, re } of slugRes) {
      if (re.test(text)) failures.push(`초안 '${slug}'의 글 주소가 ${name} 안에 있습니다`);
    }
  }

  // 검색 색인 · RSS: 항목의 주소 · 제목이 초안과 같으면 샌 것이다.
  const isDraftUrl = (url) => String(url).includes('/blog/drafts/') || slugRes.some(({ re }) => re.test(String(url)));
  const draftTitles = new Set(drafts.map((d) => d.title).filter(Boolean));
  const searchFile = path.join(outDir, 'blog/search.json');
  if (existsSync(searchFile)) {
    for (const entry of JSON.parse(readFileSync(searchFile, 'utf8'))) {
      if (isDraftUrl(entry.url) || draftTitles.has(entry.title)) failures.push(`검색 색인에 초안이 있습니다: ${entry.title} (${entry.url})`);
    }
  }
  const rssFile = path.join(outDir, 'blog/rss.xml');
  if (existsSync(rssFile)) {
    for (const [item] of readFileSync(rssFile, 'utf8').matchAll(/<item>[\s\S]*?<\/item>/g)) {
      const link = decodeXml(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? '');
      const title = decodeXml(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
      if (isDraftUrl(link) || draftTitles.has(title)) failures.push(`RSS에 초안이 있습니다: ${title} (${link})`);
    }
  }
});

check('internal links resolve', () => {
  const broken = new Map();
  for (const file of files.filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    // 실제 태그 안의 속성만 본다 (코드 블록 안의 글자 '&lt;img src="…"&gt;'는 태그가 아니다).
    const attrs = [...html.matchAll(/<[a-zA-Z][\w-]*\s[^>]*>/g)].flatMap(([tag]) => [...tag.matchAll(/\s(href|src)="([^"]*)"/g)]);
    for (const [, attr, value] of attrs) {
      let target = value.replace(/&amp;/g, '&');
      if (target.startsWith(ORIGIN)) target = target.slice(ORIGIN.length) || '/';
      if (!target.startsWith('/') || target.startsWith('//')) continue;
      target = target.split('#')[0];
      if (!target || exists(target)) continue;
      // 글 본문의 옛 주소(/my-resume/ 등)는 404.html이 새 주소로 보낸다. 보낸 곳이 있으면 통과.
      const redirected = redirectTarget(target);
      if (redirected && exists(redirected)) continue;
      const list = broken.get(target) ?? [];
      list.push(`${rel(file)} (${attr})`);
      broken.set(target, list);
    }
  }
  for (const [target, from] of broken) failures.push(`없는 주소 ${target} ← ${from.slice(0, 3).join(', ')}${from.length > 3 ? ` 외 ${from.length - 3}곳` : ''}`);
});

check('core files', () => {
  for (const f of ['index.html', 'games/index.html', '404.html', 'resume.pdf', 'blog/index.html', 'blog/rss.xml', 'blog/search.json']) {
    if (!existsSync(path.join(outDir, f))) failures.push(`out/${f}가 없습니다`);
  }
});

check('404 redirect', () => {
  const file = path.join(outDir, '404.html');
  if (!existsSync(file)) return; // core files가 이미 실패로 적는다.
  const html = readFileSync(file, 'utf8');
  const head = html.split(/<\/head>/i)[0];
  const scripts = [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const redirect = scripts.find((code) => code.includes('location.replace') && code.includes('/my-resume') && code.includes('nf-ready'));
  if (!redirect) failures.push('out/404.html의 <head>에 리다이렉트 스크립트(location.replace)가 없습니다. 테마가 <slot name="head" />를 그리는지 확인하세요');
  if (!head.includes('html:not(.nf-ready)')) failures.push('out/404.html의 <head>에 리다이렉트 전 화면 가림 스타일이 없습니다');
});

if (failures.length > 0) {
  console.error(`\n실패 ${failures.length}건:`);
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`\n검사 ${checks.length}개 OK`);
