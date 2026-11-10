'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// 정적 내보내기에서는 이 페이지가 404.html이 되고, GitHub Pages가 없는 경로마다 이 파일을 내려준다.
// 예전 주소로 들어온 사람을 새 주소로 보낸다.
// - 예전 이력서: /my-resume, /my-resume/games, /my-resume/resume.pdf → 루트로
// - 예전 블로그: dudwns0921.github.io/2026/... 은 도메인을 따라 elioground.com/2026/... 으로 오므로 /blog 아래로
const BLOG_PATHS = /^\/(\d{4}|categories|tags|archives|page|links|about|img|css|js|xml|local-search\.xml|search\.xml)(\/|$)/;

const redirectTarget = (pathname: string) => {
  if (pathname === '/my-resume' || pathname.startsWith('/my-resume/')) {
    return pathname.slice('/my-resume'.length) || '/';
  }
  if (BLOG_PATHS.test(pathname)) {
    return `/blog${pathname}`;
  }
  return null;
};

export default function NotFound() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const target = redirectTarget(pathname);
    if (target) {
      window.location.replace(`${target}${search}${hash}`);
      return;
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  return (
    <main className="h-dvh flex flex-col items-center justify-center gap-4 px-8 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-lg">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="text-blue-600 underline underline-offset-2">
        이력서로 가기
      </Link>
    </main>
  );
}
