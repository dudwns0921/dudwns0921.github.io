import type { z } from 'astro/zod';
import { parseYaml } from './yaml';

// YAML 원문을 읽어 스키마로 검사한다. 틀리면 파일 경로와 필드 경로를 붙여 빌드를 멈춘다.
export const parseYamlFile = <S extends z.ZodType>(raw: string, file: string, schema: S): z.infer<S> => {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (error) {
    throw new Error(`${file}: YAML을 읽지 못했습니다: ${(error as Error).message}`);
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `  - ${issue.path.join('.') || '(맨 위)'}: ${issue.message}`);
    throw new Error(`${file}: 데이터가 스키마와 맞지 않습니다.\n${issues.join('\n')}`);
  }
  return result.data;
};
