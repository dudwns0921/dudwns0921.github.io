/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Astro의 Vite 설정(별칭 '@theme', .astro 변환)을 그대로 써서 테스트한다.
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
