import { parseYamlFile } from './load-yaml';
import { gamesSchema } from './schemas';
import type { GamesData } from './types';
import raw from '../../content/games/games.yaml?raw';

export const getGames = async (): Promise<GamesData> => parseYamlFile(raw, 'content/games/games.yaml', gamesSchema);
