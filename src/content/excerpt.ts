// 마크다운 본문에서 기호를 뺀 앞부분 (목록 · 검색 · RSS의 요약).
export const excerpt = (body: string, length = 120): string => {
  const text = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/^\s*\|?[-:| ]+\|?\s*$/gm, ' ')
    .replace(/[*_~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
};
