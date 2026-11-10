import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // 운영은 정적 파일(out/)로 내보내 GitHub Pages에 올린다. 서버 기능은 쓰지 않는다.
  output: isProd ? "export" : undefined,
  // 개발용 PDF API(`route.dev.ts`)는 개발 서버에서만 라우트로 잡힌다. 정적 내보내기에는 API를 둘 수 없다.
  pageExtensions: isProd ? ["tsx", "ts"] : ["dev.ts", "tsx", "ts"],
};

export default nextConfig;
