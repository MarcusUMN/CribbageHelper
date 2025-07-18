import { calculateFlushScore, calculateNobsScore, getPrimeRankHash, Card, combinations, getRemainingDeck, cardToString, parseHandString } from '.';
import { getBaseScore, getDiscardWeight } from './scoringData';


export type ScoreStats = {
  avg: number;
  min: number;
}

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

  return baseScore + calculateFlushScore(hand, cut, isCrib) + calculateNobsScore(hand, cut);
}

export function evaluateSixCardHand(handString: string, isMyCrib: boolean): EvaluationResult[] {
  const sixCards = parseHandString(handString);
  const results: EvaluationResult[] = [];
  // Generate all 4-card keep combos (and 2-card discard combos)
  const keepOptions = combinations(sixCards, 4);

  for (const keep of keepOptions) {
    const discard = sixCards.filter(c => !keep.includes(c));
    const remainingDeck = getRemainingDeck(sixCards);

    let totalWeight = 0;
    let totalHand = 0;
    let totalCrib = 0;
    let totalCombined = 0;
    let minHand = Infinity;
    let minCrib = Infinity;
    let minCombined = Infinity;

    for (const cut of remainingDeck) {
      const handScore = scoreHand(keep, cut, false);

      minHand = Math.min(minHand, handScore);

      const opponentCandidates = remainingDeck.filter(c => c !== cut);

      // loop over opponent discard pairs
      for (let i = 0; i < opponentCandidates.length; i++) {
        for (let j = i + 1; j < opponentCandidates.length; j++) {
          const opp1 = opponentCandidates[i];
          const opp2 = opponentCandidates[j];

          const cribCards = [...discard, opp1, opp2];
          const cribScore = scoreHand(cribCards, cut, true);

          const weight = getDiscardWeight(opp1.rank, opp2.rank, true);

          const combinedScore = isMyCrib ? handScore + cribScore : handScore - cribScore;

          totalWeight += weight;
          totalHand += handScore * weight;
          totalCrib += cribScore * weight;
          totalCombined += combinedScore * weight;

          minCrib = Math.min(minCrib, cribScore);
          minCombined = Math.min(minCombined, combinedScore);
        }
      }
    }

    results.push({
      keep: keep.map(cardToString),
      discard: discard.map(cardToString),
      scoreData: {
        hand: { avg: totalHand / (totalWeight || 1), min: minHand },
        crib: { avg: totalCrib / (totalWeight || 1), min: minCrib },
        combined: { avg: totalCombined / (totalWeight || 1), min: minCombined },
      },
    });
  }

  return results;
}
