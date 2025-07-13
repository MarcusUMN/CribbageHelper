import { Card } from '../../../src/utils/deck';
import { combinations } from '../../../src/utils/combinations';
import { scoreHand } from '../../../src/utils/scoring';
import { cardToString, getHandHash } from '../../../src/utils';
import { getDiscardWeight } from './cribDiscardWeights';


type ScoreStats = {
  avg: number;
  min: number;
};

const scoreCache: Map<string, number> = new Map();

function getOrScoreHand(hand: Card[], cut: Card, isCrib: boolean): number {
  const key = getHandHash([...hand, cut]);
  if (!scoreCache.has(key)) {
    const score = scoreHand(hand, cut, isCrib).total;
    scoreCache.set(key, score);
  }
  return scoreCache.get(key)!;
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

  const weightedHandScores: number[] = [];
  const weightedCribScores: number[] = [];
  const weightedCombinedScores: number[] = [];
  const weightedWeights: number[] = [];

  const excluded = new Set([
    ...keep.map(cardToString),
    ...discard.map(cardToString),
  ]);

  for (const cut of remainingDeck) {
    const cutStr = cardToString(cut);
    if (excluded.has(cutStr)) continue;

    const handScore = getOrScoreHand(keep, cut, false);
    minHand = Math.min(minHand, handScore);

    const oppExcluded = new Set(excluded);
    oppExcluded.add(cutStr);

    const opponentCandidates = remainingDeck.filter(
      c => !oppExcluded.has(cardToString(c))
    );

    const opponentDiscards = combinations(opponentCandidates, 2);

    for (const opp of opponentDiscards) {
      const cribScore = getOrScoreHand([...discard, ...opp], cut, true);
      const weight = getDiscardWeight(opp[0].rank, opp[1].rank, isMyCrib);

      const combinedScore = isMyCrib
        ? handScore + cribScore
        : handScore - cribScore;

      totalWeight += weight;

      totalHand += handScore * weight;
      totalCrib += cribScore * weight;
      totalCombined += combinedScore * weight;

      minCrib = Math.min(minCrib, cribScore);
      minCombined = Math.min(minCombined, combinedScore);

      weightedHandScores.push(handScore);
      weightedCribScores.push(cribScore);
      weightedCombinedScores.push(combinedScore);
      weightedWeights.push(weight);
    }
  }

  const weightSafe = totalWeight || 1;

  return {
    hand: {
      avg: totalHand / weightSafe,
      min: minHand,
    },
    crib: {
      avg: totalCrib / weightSafe,
      min: minCrib,
    },
    combined: {
      avg: totalCombined / weightSafe,
      min: minCombined,
    },
  };
}