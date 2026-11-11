# elioground.com

정영준의 웹 이력서(`/`) · 게임 페이지(`/games`) · 블로그(`/blog`)를 한 저장소에서 만드는 Astro 정적 사이트입니다.
이력서는 PDF로도 내려받을 수 있습니다.

- 데이터: `content/` (이력서 YAML · 게임 · 블로그 글)
- 화면: `src/themes/<이름>/` (테마는 `src/theme.config.ts` 한 줄로 바꿉니다)
- 자세한 규칙: `CLAUDE.md`

```sh
corepack pnpm install
pnpm dev            # 개발 서버 (초안 · /api/pdf 포함)
pnpm check          # 타입 검사
pnpm test           # 단위 테스트
pnpm build          # out/ 으로 정적 사이트
pnpm pdf            # out/resume.pdf
pnpm check:site     # 빌드 결과 검사 (pnpm pdf 다음)
```
