import baseScoreCacheJson from './baseScoreCache.json';

type BaseScoreCache = Record<string, number>;

export const baseScoreCache: BaseScoreCache = baseScoreCacheJson;

export function getBaseScore(key: string): number | undefined {
  return baseScoreCache[key];
}
