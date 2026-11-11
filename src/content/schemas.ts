import { z } from 'astro/zod';

// ---- 블로그 ----

// 글 폴더 이름이 곧 주소의 슬러그다. 공백 · 한글은 주소에서 인코딩되므로 쓰지 않는다.
export const SLUG_RE = /^[A-Za-z0-9][A-Za-z0-9-]*$/;

// 글 frontmatter. 모르는 키(옛 Hexo의 index_img 등)가 있으면 빌드를 멈춘다.
export const postFrontmatter = z
  .object({
    title: z.string().min(1),
    // 시간대 없는 'YYYY-MM-DD HH:mm:ss'. 원문 형식은 lintFrontmatter가 따로 본다.
    date: z.date(),
    // [큰 분류, 작은 분류] 두 단계까지.
    categories: z
      .array(z.string().min(1))
      .max(2)
      .nullish()
      .transform((v) => v ?? []),
    tags: z
      .array(z.string().min(1))
      .nullish()
      .transform((v) => v ?? []),
    // 대표 이미지. content/blog/images/의 파일 이름.
    cover: z
      .string()
      .regex(/^[\w.-]+\.(png|jpe?g|gif|webp|svg)$/i)
      .optional(),
    description: z.string().optional(),
  })
  .strict();

export type PostFrontmatter = z.infer<typeof postFrontmatter>;

// ---- 이력서 (content/resume/*.yaml) ----
// 모르는 필드가 있으면(오타 포함) 빌드를 멈춘다.

export const achievementSchema = z
  .object({
    // '**구절**'은 강조, '[글자](주소)'는 링크.
    description: z.string().min(1),
    // 문장 전체를 강조한다 (한 줄짜리 짧은 성과).
    strong: z.boolean().optional(),
  })
  .strict();

export const projectLinkSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
    // 웹에서만 보이고 PDF에는 넣지 않는다.
    webOnly: z.boolean().optional(),
  })
  .strict();

export const projectSchema = z
  .object({
    title: z.string().min(1),
    period: z.string().min(1),
    role: z.string(),
    links: z.array(projectLinkSchema).optional(),
    description: z.string(),
    techStack: z.array(z.string().min(1)),
    achievements: z.array(achievementSchema),
  })
  .strict();

export const teamSchema = z
  .object({
    name: z.string().min(1),
    period: z.string().min(1),
    projects: z.array(projectSchema),
  })
  .strict();

// 제목 · 부가 정보 두 줄 · 설명. 경력의 회사 줄, 수상 · 특허 · 학력 · 자격증이 이 모양이다.
export const infoItemSchema = z
  .object({
    title: z.string().min(1),
    subInfo: z.string(),
    subInfo2: z.string(),
    description: z.string(),
  })
  .strict();

export const workExperienceSchema = infoItemSchema
  .extend({
    teams: z.array(teamSchema).optional(),
    projects: z.array(projectSchema).optional(),
  })
  .strict();

export const additionalSchema = z
  .object({
    href: z.string().min(1),
    label: z.string().min(1),
  })
  .strict();

export const profileSchema = z
  .object({
    greeting: z.array(z.string().min(1)).length(3),
    paragraphs: z.array(z.string().min(1)).min(1),
  })
  .strict();

// 파일 하나 = 키 하나. src/content/resume.ts가 content/resume/<키>.yaml을 읽어 이 스키마로 본다.
export const resumeSchemas = {
  profile: profileSchema,
  workExperiences: z.array(workExperienceSchema),
  activities: z.array(projectSchema),
  awards: z.array(infoItemSchema),
  patents: z.array(infoItemSchema),
  educations: z.array(infoItemSchema),
  qualifications: z.array(infoItemSchema),
  additionals: z.array(additionalSchema),
} as const;

// ---- 게임 페이지 (content/games/games.yaml) ----

const linkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) }).strict();

export const gameSchema = z
  .object({
    slug: z.string().regex(SLUG_RE),
    title: z.string().min(1),
    period: z.string().min(1),
    // gamedev-kit으로 만든 게임만 사이클 횟수를 적는다.
    kitCycles: z.number().int().positive().optional(),
    genre: z.string().min(1),
    // /activities/<slug>/banner.jpg (content/games/<slug>/banner.jpg에서 복사된다).
    banner: z.string().regex(/^\/activities\/[A-Za-z0-9-]+\/banner\.jpg$/),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    links: z.array(linkSchema),
    description: z.string().min(1),
    achievements: z.array(z.object({ description: z.string().min(1) }).strict()),
  })
  .strict();

export const gamesSchema = z
  .object({
    hero: z.object({ kicker: z.string(), sub: z.array(z.string()) }).strict(),
    gamedevKit: z
      .object({
        title: z.string(),
        kicker: z.string(),
        period: z.string(),
        role: z.string(),
        links: z.array(linkSchema),
        description: z.string(),
        techStack: z.array(z.string()),
        cycle: z.array(z.object({ name: z.string(), byUser: z.boolean().optional(), line: z.string() }).strict()),
        ceo: z.string(),
      })
      .strict(),
    trilogy: z
      .object({
        title: z.string(),
        period: z.string(),
        role: z.string(),
        description: z.string(),
        techStack: z.array(z.string()),
      })
      .strict(),
    games: z.array(gameSchema),
  })
  .strict();

// ---- 사이트 (content/site.yaml) ----

export const siteSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    origin: z.literal('https://elioground.com'),
    author: z.string().min(1),
    blog: z.object({ title: z.string().min(1), description: z.string().min(1) }).strict(),
    games: z.object({ title: z.string().min(1), description: z.string().min(1) }).strict(),
  })
  .strict();
