// 이력서 · 게임 문장 안의 작은 마크업 해석. 테마는 이 결과를 그린다.
// - '**구절**' → strong (안쪽은 글자 그대로, 링크를 풀지 않는다)
// - '[글자](주소)' → link. 주소는 'http(s)://…' 또는 사이트 안의 '/…'.
export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] };

const LINK_RE = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]*)\)/;

const parseLinks = (text: string): InlineNode[] => {
  const nodes: InlineNode[] = [];
  let rest = text;
  for (let m = rest.match(LINK_RE); m; m = rest.match(LINK_RE)) {
    if (m.index! > 0) nodes.push({ type: 'text', value: rest.slice(0, m.index) });
    nodes.push({ type: 'link', href: m[2], children: [{ type: 'text', value: m[1] }] });
    rest = rest.slice(m.index! + m[0].length);
  }
  if (rest) nodes.push({ type: 'text', value: rest });
  return nodes;
};

export const parseInline = (s: string): InlineNode[] =>
  s
    .split(/\*\*(.+?)\*\*/)
    .flatMap((part, i): InlineNode[] =>
      i % 2 === 1 ? [{ type: 'strong', children: [{ type: 'text', value: part }] }] : parseLinks(part),
    );

// 마크업을 뺀 글자만 (검색 · 설명 · 테스트용).
export const stripInline = (s: string): string => {
  const text = (nodes: InlineNode[]): string =>
    nodes.map((n) => (n.type === 'text' ? n.value : text(n.children))).join('');
  return text(parseInline(s));
};
