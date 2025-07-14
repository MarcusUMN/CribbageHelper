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
  remainingDeck: Card[]
): {
  myCrib: {
    hand: ScoreStats;
    crib: ScoreStats;
    combined: ScoreStats;
  };
  opponentCrib: {
    hand: ScoreStats;
    crib: ScoreStats;
    combined: ScoreStats;
  };
} {
  let myTotalWeight = 0;
  let myTotalHand = 0;
  let myTotalCrib = 0;
  let myTotalCombined = 0;
  let myMinHand = Infinity;
  let myMinCrib = Infinity;
  let myMinCombined = Infinity;

  let oppTotalWeight = 0;
  let oppTotalHand = 0;
  let oppTotalCrib = 0;
  let oppTotalCombined = 0;
  let oppMinHand = Infinity;
  let oppMinCrib = Infinity;
  let oppMinCombined = Infinity;

  const excluded = new Set([
    ...keep.map(c => c.rank + c.suit),
    ...discard.map(c => c.rank + c.suit),
  ]);

  for (const cut of remainingDeck) {
    const cutStr = cut.rank + cut.suit;
    if (excluded.has(cutStr)) continue;

    const handScore = getOrScoreHand(keep, cut, false);

    myMinHand = Math.min(myMinHand, handScore);
    oppMinHand = Math.min(oppMinHand, handScore);

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
        const weight = getDiscardWeight(opp1.rank, opp2.rank, true);

        // My crib case (isMyCrib = true)
        {
          const combinedScore = handScore + cribScore;
          myTotalWeight += weight;
          myTotalHand += handScore * weight;
          myTotalCrib += cribScore * weight;
          myTotalCombined += combinedScore * weight;

          myMinCrib = Math.min(myMinCrib, cribScore);
          myMinCombined = Math.min(myMinCombined, combinedScore);
        }

        // Opponent crib case (isMyCrib = false)
        {
          const combinedScore = handScore - cribScore;
          oppTotalWeight += weight;
          oppTotalHand += handScore * weight;
          oppTotalCrib += cribScore * weight;
          oppTotalCombined += combinedScore * weight;

          oppMinCrib = Math.min(oppMinCrib, cribScore);
          oppMinCombined = Math.min(oppMinCombined, combinedScore);
        }
      }
    }
  }

  return {
    myCrib: {
      hand: { avg: myTotalHand / (myTotalWeight || 1), min: myMinHand },
      crib: { avg: myTotalCrib / (myTotalWeight || 1), min: myMinCrib },
      combined: { avg: myTotalCombined / (myTotalWeight || 1), min: myMinCombined },
    },
    opponentCrib: {
      hand: { avg: oppTotalHand / (oppTotalWeight || 1), min: oppMinHand },
      crib: { avg: oppTotalCrib / (oppTotalWeight || 1), min: oppMinCrib },
      combined: { avg: oppTotalCombined / (oppTotalWeight || 1), min: oppMinCombined },
    },
  };
}
