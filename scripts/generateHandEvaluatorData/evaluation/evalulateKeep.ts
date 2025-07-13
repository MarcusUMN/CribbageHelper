import { Card, getPrimeRankHash } from '../../../src/utils';
import { 
  scoreHandIgnoringFlushAndNobs, 
  calculateFlushScore, 
  calculateNobsScore, 
} from '../../../src/utils';
import { getDiscardWeight } from './cribDiscardWeights';

export type ScoreStats = {
  avg: number;
  min: number;
};

const scoreCache: Map<string, number> = new Map();

function getOrScoreHand(hand: Card[], cut: Card, isCrib: boolean): number {
  const key = getPrimeRankHash([...hand, cut]);
  if (!scoreCache.has(key)) {
    const baseScore = scoreHandIgnoringFlushAndNobs(hand, cut);
    scoreCache.set(key, baseScore);
  }
  const baseScore = scoreCache.get(key)!;
  return baseScore + calculateFlushScore(hand, cut, isCrib) + calculateNobsScore(hand, cut);
}

export function evaluateKeep(
  keep: Card[],
  discard: Card[],
  remainingDeck: Card[],
  isMyCrib: boolean
): {
  hand: ScoreStats;
  crib: ScoreStats;
  combined: ScoreStats;
} {
  let totalWeight = 0;

  let totalHand = 0;
  let totalCrib = 0;
  let totalCombined = 0;

  let minHand = Infinity;
  let minCrib = Infinity;
  let minCombined = Infinity;

  const excluded = new Set([
    ...keep.map(c => c.rank + c.suit),
    ...discard.map(c => c.rank + c.suit),
  ]);

  for (const cut of remainingDeck) {
    const cutStr = cut.rank + cut.suit;
    if (excluded.has(cutStr)) continue;

    const handScore = getOrScoreHand(keep, cut, false);
    minHand = Math.min(minHand, handScore);

    const oppExcluded = new Set(excluded);
    oppExcluded.add(cutStr);

    const opponentCandidates = remainingDeck.filter(
      c => !oppExcluded.has(c.rank + c.suit)
    );

    const n = opponentCandidates.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const opp1 = opponentCandidates[i];
        const opp2 = opponentCandidates[j];

        const cribScore = getOrScoreHand([...discard, opp1, opp2], cut, true);
        const weight = getDiscardWeight(opp1.rank, opp2.rank, isMyCrib);

        const combinedScore = isMyCrib
          ? handScore + cribScore
          : handScore - cribScore;

        totalWeight += weight;
        totalHand += handScore * weight;
        totalCrib += cribScore * weight;
        totalCombined += combinedScore * weight;

        minCrib = Math.min(minCrib, cribScore);
        minCombined = Math.min(minCombined, combinedScore);
      }
    }
  }

  const weightSafe = totalWeight || 1;

  return {
    hand: { avg: totalHand / weightSafe, min: minHand },
    crib: { avg: totalCrib / weightSafe, min: minCrib },
    combined: { avg: totalCombined / weightSafe, min: minCombined },
  };
}
