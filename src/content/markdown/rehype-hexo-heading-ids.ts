import type { Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import { slugize } from '../slug';

// 제목 id를 Hexo(hexo-renderer-marked)와 같게 붙인다: slugize(제목 글자), 겹치면 -1, -2 ...
// 옛 글 주소의 `#AI-활용` 같은 앵커가 그대로 동작해야 한다.
export default function rehypeHexoHeadingIds() {
  return (tree: Root) => {
    const seen = new Map<string, number>();
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      let id = slugize(toString(node).trim());
      const count = seen.get(id);
      if (count) {
        seen.set(id, count + 1);
        id = `${id}-${count}`;
      } else {
        seen.set(id, 1);
      }
      node.properties = { ...node.properties, id };
    });
  };
}
