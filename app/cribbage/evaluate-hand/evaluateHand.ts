import {
  scoreFlush,
  scoreNobs,
  getPrimeRankHash,
  Card,
  combinations,
  getRemainingDeck,
  cardToString,
  parseHandString
} from '..';
import { getBaseScore, getDiscardWeight } from './scoring-data';

export type ScoreStats = {
  avg: number;
  min: number;
  weightedDistribution: Record<number, number>;
};

export type EvaluationResult = {
  keep: string[];
  discard: string[];
  scoreData: {
    hand: ScoreStats;
    crib: ScoreStats;
    combined: ScoreStats;
  };
};

function scoreHand(hand: Card[], cut: Card, isCrib: boolean): number {
  const key = getPrimeRankHash([...hand, cut]);
  const baseScore = getBaseScore(key);

  if (baseScore === undefined) {
    throw new Error(`Base score not found for key: ${key}`);
  }

  return (
    baseScore + scoreFlush(hand, cut, isCrib, true) + scoreNobs(hand, cut, true)
  );
}

function normalizeDistribution(
  dist: Map<number, number>
): Record<number, number> {
  const totalWeight = Array.from(dist.values()).reduce((sum, w) => sum + w, 0);
  const fullDist: Record<number, number> = {};
  const scores = Array.from(dist.keys());
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  for (let score = minScore; score <= maxScore; score++) {
    fullDist[score] = (dist.get(score) ?? 0) / totalWeight;
  }

  return fullDist;
}

export function evaluateHand(
  handString: string,
  isMyCrib: boolean
): EvaluationResult[] {
  const sixCards = parseHandString(handString);
  const results: EvaluationResult[] = [];
  const keepOptions = combinations(sixCards, 4);

  for (const keep of keepOptions) {
    const discard = sixCards.filter((c) => !keep.includes(c));
    const remainingDeck = getRemainingDeck(sixCards);

    let totalWeight = 0;
    let totalHand = 0;
    let totalCrib = 0;
    let totalCombined = 0;
    let minHand = Infinity;
    let minCrib = Infinity;
    let minCombined = Infinity;

    const handDist = new Map<number, number>();
    const cribDist = new Map<number, number>();
    const combinedDist = new Map<number, number>();

    for (const cut of remainingDeck) {
      const handScore = scoreHand(keep, cut, false);
      minHand = Math.min(minHand, handScore);

      const opponentCandidates = remainingDeck.filter((c) => c !== cut);

      for (let i = 0; i < opponentCandidates.length; i++) {
        for (let j = i + 1; j < opponentCandidates.length; j++) {
          const opp1 = opponentCandidates[i];
          const opp2 = opponentCandidates[j];
          const cribCards = [...discard, opp1, opp2];
          const cribScore = scoreHand(cribCards, cut, true);
          const weight = getDiscardWeight(opp1.rank, opp2.rank, true);

          const combinedScore = isMyCrib
            ? handScore + cribScore
            : handScore - cribScore;

          totalWeight += weight;
          totalHand += handScore * weight;
          totalCrib += cribScore * weight;
          totalCombined += combinedScore * weight;

          minCrib = Math.min(minCrib, cribScore);
          minCombined = Math.min(minCombined, combinedScore);

          handDist.set(handScore, (handDist.get(handScore) ?? 0) + weight);
          cribDist.set(cribScore, (cribDist.get(cribScore) ?? 0) + weight);
          combinedDist.set(
            combinedScore,
            (combinedDist.get(combinedScore) ?? 0) + weight
          );
        }
      }
    }

    results.push({
      keep: keep.map(cardToString),
      discard: discard.map(cardToString),
      scoreData: {
        hand: {
          avg: totalHand / (totalWeight || 1),
          min: minHand,
          weightedDistribution: normalizeDistribution(handDist)
        },
        crib: {
          avg: totalCrib / (totalWeight || 1),
          min: minCrib,
          weightedDistribution: normalizeDistribution(cribDist)
        },
        combined: {
          avg: totalCombined / (totalWeight || 1),
          min: minCombined,
          weightedDistribution: normalizeDistribution(combinedDist)
        }
      }
    });
  }

  return results;
}
