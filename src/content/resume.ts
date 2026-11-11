import type { z } from 'astro/zod';
import { parseYamlFile } from './load-yaml';
import { resumeSchemas } from './schemas';
import type { Resume } from './types';
import profile from '../../content/resume/profile.yaml?raw';
import workExperiences from '../../content/resume/workExperiences.yaml?raw';
import activities from '../../content/resume/activities.yaml?raw';
import awards from '../../content/resume/awards.yaml?raw';
import patents from '../../content/resume/patents.yaml?raw';
import educations from '../../content/resume/educations.yaml?raw';
import qualifications from '../../content/resume/qualifications.yaml?raw';
import additionals from '../../content/resume/additionals.yaml?raw';

// 이력서는 Astro 컬렉션이 아니라 파일 하나를 통째로 읽는다 (배열 순서가 곧 화면 순서).
const raw = { profile, workExperiences, activities, awards, patents, educations, qualifications, additionals };

const parse = <K extends keyof typeof resumeSchemas>(key: K): z.infer<(typeof resumeSchemas)[K]> =>
  parseYamlFile(raw[key], `content/resume/${key}.yaml`, resumeSchemas[key]) as z.infer<(typeof resumeSchemas)[K]>;

export const getResume = async (): Promise<Resume> => ({
  profile: parse('profile'),
  workExperiences: parse('workExperiences'),
  activities: parse('activities'),
  awards: parse('awards'),
  patents: parse('patents'),
  educations: parse('educations'),
  qualifications: parse('qualifications'),
  additionals: parse('additionals'),
});
