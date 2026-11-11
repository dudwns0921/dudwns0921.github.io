import { parseYamlFile } from './load-yaml';
import { siteSchema } from './schemas';
import type { SiteMeta } from './types';
import raw from '../../content/site.yaml?raw';

export const getSite = async (): Promise<SiteMeta> => parseYamlFile(raw, 'content/site.yaml', siteSchema);
