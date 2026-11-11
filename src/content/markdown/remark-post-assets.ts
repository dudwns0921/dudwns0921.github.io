import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { Definition, Image, ImageReference, Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import { draftUrl, permalink } from '../urls';

// 글 폴더 안의 이미지를 상대 경로로 쓰면(`![](image1.png)`) Hexo 때와 같은 절대 주소
// (`/blog/YYYY/MM/DD/<slug>/image1.png`)로 바꾼다. 절대 주소는 Astro 이미지 최적화를 타지 않으므로
// 원본 파일이 같은 주소에 그대로 남는다 (content-assets 통합이 그 주소로 복사한다).
// 파일이 글 폴더에 없으면(확장자 대소문자까지) 운영 글은 빌드를 멈추고, 초안은 경고만 한다.
// 참조형 이미지(`![a][ref]`)의 정의도 같이 바꾼다. 상대 주소로 남으면 Astro가 이미지 최적화로 모아 주소가 바뀐다.
// mdast의 노드만 보므로 코드 블록 안의 `![](...)`와 원시 HTML의 <img>는 건드리지 않는다.
const ENTRY_RE = /\/content\/blog\/(posts|drafts)\/([^/]+)\/index\.md$/;
const ABSOLUTE_RE = /^(\/|#|[a-z][a-z0-9+.-]*:)/i;

// 이미지 주소의 문제를 돌려준다 (없으면 null). remark 플러그인과 content-assets 통합이 같이 쓴다.
// - 절대 주소(`/…`, `https:` 등)는 보지 않는다.
// - 글 폴더 바로 아래 파일만 쓸 수 있다. content-assets가 그 폴더의 파일만 (한 단계) 복사하므로
//   `img/a.png`(하위 폴더)나 `../Other/a.png`(다른 글)는 검사를 통과해도 운영에서 깨진다.
// - 파일이 그 폴더에 있어야 한다 (확장자 대소문자까지).
export const assetProblem = (url: string, dir: string): string | null => {
  if (ABSOLUTE_RE.test(url)) return null;
  let rel: string;
  try {
    rel = decodeURI(url.split(/[?#]/)[0]);
  } catch {
    rel = url.split(/[?#]/)[0];
  }
  rel = rel.replace(/^\.\//, '');
  if (rel === '' || /[\\/]/.test(rel) || rel === '..' || rel === '.') {
    return `이미지는 글 폴더 바로 아래 파일만 쓸 수 있습니다 (하위 폴더 · 다른 폴더 안 됨): ${url}`;
  }
  // GitHub Pages는 대소문자를 가린다. 그래서 existsSync 대신 폴더 목록과 비교한다.
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    names = [];
  }
  return names.includes(rel) ? null : `이미지 파일이 글 폴더에 없습니다: ${path.join(dir, rel)}`;
};

// 본문의 이미지 주소를 모두 돈다: `![](a.png)`(image)와 참조형 `![a][ref]` + `[ref]: a.png`(definition).
// 참조형은 imageReference가 가리키는 definition만 본다 (링크 `[글][ref]`의 정의는 건드리지 않는다).
// 코드 블록 · 인라인 코드 · 원시 HTML은 mdast의 이 노드가 아니므로 보지 않는다.
export const forEachImageUrl = (tree: Root, fn: (node: { url: string }) => void) => {
  const refs = new Set<string>();
  visit(tree, 'imageReference', (node: ImageReference) => {
    refs.add(node.identifier);
  });
  visit(tree, (node) => {
    if (node.type === 'image') fn(node as Image);
    else if (node.type === 'definition' && refs.has((node as Definition).identifier)) fn(node as Definition);
  });
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return null;
};

interface AstroFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

export default function remarkPostAssets() {
  return (tree: Root, file: VFile) => {
    if (!file.path) return;
    const filePath = path.resolve(file.path).split(path.sep).join('/');
    const match = filePath.match(ENTRY_RE);
    if (!match) return;
    const [, kind, slug] = match;
    const isDraft = kind === 'drafts';
    const date = toDate((file.data as AstroFileData).astro?.frontmatter?.date);
    if (!isDraft && !date) throw new Error(`${filePath}: date가 없어 이미지 주소를 만들 수 없습니다.`);
    const base = isDraft ? draftUrl(slug) : permalink(slug, date!);
    const dir = path.dirname(filePath);

    forEachImageUrl(tree, (node) => {
      if (ABSOLUTE_RE.test(node.url)) return;
      const problem = assetProblem(node.url, dir);
      if (problem) {
        const message = `${filePath}: ${problem}`;
        if (!isDraft) throw new Error(message);
        // 초안은 경고만 하고 주소는 그대로 바꾼다. 상대 주소로 두면 Astro가 이미지를 모으려다 개발 서버 전체가 멈춘다.
        console.warn(`[초안] ${message}`);
      }
      node.url = `${base}${node.url.replace(/^\.\//, '')}`;
    });
  };
}
