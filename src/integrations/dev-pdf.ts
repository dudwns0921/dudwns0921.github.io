import type { AstroIntegration } from 'astro';

// 개발 서버에서만 /api/pdf를 붙인다. 운영은 정적 파일만 내보내므로 빌드 때는 라우트를 만들지 않는다
// (운영 PDF는 scripts/generate-pdf.mjs가 out/resume.pdf로 만든다).
export default function devPdf(): AstroIntegration {
  return {
    name: 'dev-pdf',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        injectRoute({ pattern: '/api/pdf', entrypoint: './src/pages-dev/api/pdf.ts', prerender: false });
      },
    },
  };
}
