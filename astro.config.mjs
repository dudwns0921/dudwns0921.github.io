// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { THEME } from './src/theme.config.ts';
import devPdf from './src/integrations/dev-pdf.ts';
import contentAssets from './src/integrations/content-assets.ts';
import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';
import rehypeExternalLinks from 'rehype-external-links';
import remarkPostAssets from './src/content/markdown/remark-post-assets.ts';
import remarkMermaid from './src/content/markdown/remark-mermaid.ts';
import rehypeHexoHeadingIds from './src/content/markdown/rehype-hexo-heading-ids.ts';

export default defineConfig({
  site: 'https://elioground.com',
  // 정적 파일만 내보낸다. scripts/generate-pdf.mjs와 배포 워크플로가 out/을 쓴다.
  outDir: './out',
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  integrations: [contentAssets(), react(), devPdf()],
  // 블로그 글은 hexo-renderer-marked 기본값과 같게 그린다: GFM 표, smartypants, 줄바꿈 하나 = <br>, 원시 HTML 허용, 바깥 링크는 새 탭.
  // Astro 7의 기본 처리기(Sätteri)는 remark/rehype 플러그인을 받지 않으므로 unified 처리기를 쓴다.
  markdown: {
    processor: unified({
      gfm: true,
      smartypants: true,
      // ```mermaid 블록은 Shiki 대신 remarkMermaid가 <pre class="mermaid">로 남기고, 테마가 브라우저에서 그린다.
      remarkPlugins: [remarkBreaks, remarkPostAssets, remarkMermaid],
      rehypePlugins: [rehypeHexoHeadingIds, [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
    }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // 라우트(src/pages)는 테마를 이 별칭으로만 부른다. 테마를 바꾸려면 src/theme.config.ts만 고친다.
        '@theme': fileURLToPath(new URL(`./src/themes/${THEME}`, import.meta.url)),
      },
    },
  },
});
