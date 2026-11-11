import type { Code, Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

// ```mermaid 코드 블록을 Shiki가 칠하지 않게 <pre class="mermaid">원문</pre>으로 바꾼다.
// 그림은 브라우저에서 그린다 (테마의 Mermaid 컴포넌트가 mermaid 라이브러리를 불러 그린다).
// 그 컴포넌트를 mermaid가 있는 글에서만 붙이도록 frontmatter에 hasMermaid: true를 남긴다
// (render()의 remarkPluginFrontmatter로 나온다. 원래 frontmatter 파일은 바뀌지 않는다).
export default function remarkMermaid() {
  return (tree: Root, file: VFile) => {
    let found = false;
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === undefined) return;
      found = true;
      // mdast-util-to-hast는 모르는 노드를 data.hName · hProperties · hChildren대로 그린다. 글자는 이스케이프된다.
      parent.children[index] = {
        type: 'mermaidBlock',
        data: {
          hName: 'pre',
          hProperties: { className: ['mermaid'] },
          hChildren: [{ type: 'text', value: node.value }],
        },
      } as unknown as Code;
    });
    if (!found) return;
    const data = file.data as { astro?: { frontmatter?: Record<string, unknown> } };
    data.astro ??= {};
    data.astro.frontmatter ??= {};
    data.astro.frontmatter.hasMermaid = true;
  };
}
