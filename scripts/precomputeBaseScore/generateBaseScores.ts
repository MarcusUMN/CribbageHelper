import { scoreHandIgnoringFlushAndNobs, combinations, getPrimeRankHash, getDeck } from '../../src/utils';

export function generateBaseScores() {
  const baseScoreMap: Record<string, number> = {};
  const seenHashes = new Set<string>();

  const deck = getDeck();
  const combos = combinations(deck, 5); // All unique 5-card hands

  for (const five of combos) {
    const key = getPrimeRankHash(five);
    if (seenHashes.has(key)) continue;
    seenHashes.add(key);

    const cut = five[4];
    const hand = five.slice(0, 4);

    const baseScore = scoreHandIgnoringFlushAndNobs(hand, cut);
    baseScoreMap[key] = baseScore;
  }
  return {
    baseScoreMap,
  };
}
