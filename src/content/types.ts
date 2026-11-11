import type { MarkdownHeading } from 'astro';
import type { z } from 'astro/zod';
import type {
  achievementSchema,
  additionalSchema,
  gameSchema,
  gamesSchema,
  infoItemSchema,
  profileSchema,
  projectLinkSchema,
  projectSchema,
  siteSchema,
  teamSchema,
  workExperienceSchema,
} from './schemas';

// 테마에 넘기는 모델 타입. 테마는 이 타입과 src/content/inline.ts · urls.ts만 안다.

export type SiteMeta = z.infer<typeof siteSchema>;

export type Achievement = z.infer<typeof achievementSchema>;
export type ProjectLink = z.infer<typeof projectLinkSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Team = z.infer<typeof teamSchema>;
export type InfoItem = z.infer<typeof infoItemSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Additional = z.infer<typeof additionalSchema>;
export type Profile = z.infer<typeof profileSchema>;

export interface Resume {
  profile: Profile;
  workExperiences: WorkExperience[];
  activities: Project[];
  awards: InfoItem[];
  patents: InfoItem[];
  educations: InfoItem[];
  qualifications: InfoItem[];
  additionals: Additional[];
}

export type Game = z.infer<typeof gameSchema>;
export type GamesData = z.infer<typeof gamesSchema>;

// ---- 블로그 ----

export interface PostSummary {
  slug: string;
  title: string;
  date: Date;
  url: string;
  categories: string[];
  tags: { name: string; url: string }[];
  category?: { path: string[]; url: string };
  // 완성된 주소 (/blog/img/<파일>).
  cover?: string;
  excerpt: string;
  isDraft: boolean;
}

export interface TagCount {
  name: string;
  slug: string;
  url: string;
  count: number;
}

export interface CategoryNode {
  name: string;
  path: string[];
  url: string;
  count: number;
  children: CategoryNode[];
}

export interface ArchiveYear {
  year: number;
  url: string;
  months: { month: number; url: string; posts: PostSummary[] }[];
}

export type { MarkdownHeading };
