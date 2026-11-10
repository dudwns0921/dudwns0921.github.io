import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // 운영은 정적 파일(out/)로 내보내 GitHub Pages에 올린다. 서버 기능은 쓰지 않는다.
  output: isProd ? "export" : undefined,
  // GitHub Pages가 이 저장소를 /my-resume 아래로 서빙하므로 정적 파일 경로에 같은 접두사를 붙인다.
  assetPrefix: isProd ? "/my-resume/" : "",
  // 개발용 PDF API(`route.dev.ts`)는 개발 서버에서만 라우트로 잡힌다. 정적 내보내기에는 API를 둘 수 없다.
  pageExtensions: isProd ? ["tsx", "ts"] : ["dev.ts", "tsx", "ts"],
};

export default nextConfig;
