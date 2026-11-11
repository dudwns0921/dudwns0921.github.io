import { useEffect, useRef, useState } from 'react';

interface SearchEntry {
  title: string;
  url: string;
  date: string;
  tags: string[];
  categories: string[];
  excerpt: string;
}

// 글 목록 위의 검색 상자. 처음 입력할 때 검색 색인(search.json)을 받아, 제목 · 태그 · 카테고리 · 요약에
// 입력어가 들어 있지 않은 글을 목록([data-post-url])에서 숨긴다. 대소문자는 가리지 않는다.
const SearchBox = ({ indexUrl }: { indexUrl: string }) => {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const loading = useRef(false);

  useEffect(() => {
    if (!query || index || loading.current) return;
    loading.current = true;
    fetch(indexUrl)
      .then((res) => res.json() as Promise<SearchEntry[]>)
      .then(setIndex)
      .catch(() => setIndex([]))
      .finally(() => (loading.current = false));
  }, [query, index, indexUrl]);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-post-url]');
    const q = query.trim().toLowerCase();
    if (!q || !index) {
      items.forEach((el) => (el.hidden = false));
      setShown(null);
      return;
    }
    const hits = new Set(
      index
        .filter((e) => [e.title, e.excerpt, ...e.tags, ...e.categories].some((s) => s.toLowerCase().includes(q)))
        .map((e) => e.url),
    );
    let count = 0;
    items.forEach((el) => {
      const hit = hits.has(el.dataset.postUrl ?? '');
      el.hidden = !hit;
      if (hit) count++;
    });
    setShown(count);
  }, [query, index]);

  return (
    <div className="flex flex-col gap-1">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목 · 태그 · 카테고리 · 요약에서 찾기"
        aria-label="글 검색"
        className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
      />
      {shown !== null && <p className="text-sm text-gray-500">{shown}개의 글</p>}
    </div>
  );
};

export default SearchBox;
