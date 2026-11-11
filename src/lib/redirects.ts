// 없는 주소로 들어온 사람을 새 주소로 보낼 때 쓰는 규칙. 테마와 상관없다.
// GitHub Pages는 없는 경로마다 404.html을 내려주고, 그 페이지의 스크립트가 이 함수를 불러 location.replace 한다.
// - 예전 이력서: /my-resume, /my-resume/games, /my-resume/resume.pdf → 루트로
// - 예전 블로그: dudwns0921.github.io/2026/... 은 도메인을 따라 elioground.com/2026/... 으로 오므로 /blog 아래로
// - Hexo의 목록 페이지 나누기(.../page/N/)는 없앴으므로 그 목록으로, /blog/links/는 /blog/로
// 여러 규칙이 겹쳐도(/page/3/ → /blog/page/3/ → /blog/) 한 번에 최종 주소를 돌려준다.
const BLOG_PATHS = /^\/(\d{4}|categories|tags|archives|page|links|about|img|css|js|xml|local-search\.xml|search\.xml)(\/|$)/;
const PAGINATION = /^\/blog\/(.*?)\/?page\/\d+\/?$/;
const LINKS = /^\/blog\/links\/?$/;

export const redirectTarget = (pathname: string): string | null => {
  let path = pathname;
  if (path === '/my-resume' || path.startsWith('/my-resume/')) {
    path = path.slice('/my-resume'.length) || '/';
  }
  if (BLOG_PATHS.test(path)) {
    path = `/blog${path}`;
  }
  const page = path.match(PAGINATION);
  if (page) {
    path = page[1] ? `/blog/${page[1]}/` : '/blog/';
  }
  if (LINKS.test(path)) {
    path = '/blog/';
  }
  return path === pathname ? null : path;
};
