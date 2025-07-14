import { getDeck, canonicalizeHand } from '../../../src/utils';
import { combinations } from '../../../src/utils/combinations';
import { evaluateKeep } from '../evaluation/evalulateKeep';

export type SerializedResult = {
  keep: string[];
  discard: string[];
  scoreData: any;
};

export type CribEvaluationResults = {
  canonicalSuitMaps: Record<string, string>[];
  myCrib: SerializedResult[];
  opponentCrib: SerializedResult[];
};

export type CribEvaluationData = {
  results: Record<string, CribEvaluationResults>;
  timeTakenSeconds: number;
  processedHands: number;
};

export function generateData(limitHands?: number): CribEvaluationData {
  const startTime = Date.now();
  const deck = getDeck();
  const allHands = combinations(deck, 6);
  const seen = new Set<string>();
  const results: Record<string, CribEvaluationResults> = {};

  const total = limitHands ? Math.min(limitHands, allHands.length) : allHands.length;

  for (let i = 0; i < total; i++) {
    if ((i + 1) % 1000 === 0) {
      console.log(`Processing hand ${i + 1} of ${total}`);
    }
    const hand = allHands[i];
    const { canonicalKey, normalizeSubset, suitMap } = canonicalizeHand(hand);
    const canonicalSuitMap = Object.fromEntries(suitMap);

    if (results[canonicalKey]) {
      results[canonicalKey].canonicalSuitMaps.push(canonicalSuitMap);
      continue;
    }
    seen.add(canonicalKey);

    const remainingDeck = deck.filter(
      c => !hand.some(h => h.rank === c.rank && h.suit === c.suit)
    );

    const myCrib: SerializedResult[] = [];
    const opponentCrib: SerializedResult[] = [];

    const discardsAndKeeps = combinations(hand, 4).map(keep => {
      const discard = hand.filter(c => !keep.includes(c));
      return { keep, discard };
    });

    for (const { keep, discard } of discardsAndKeeps) {
      const resultsData = evaluateKeep(keep, discard, remainingDeck);
      myCrib.push({
        keep: normalizeSubset(keep),
        discard: normalizeSubset(discard),
        scoreData: resultsData.myCrib,
      });

      opponentCrib.push({
        keep: normalizeSubset(keep),
        discard: normalizeSubset(discard),
        scoreData: resultsData.opponentCrib,
      });
    }

    results[canonicalKey] = {
      canonicalSuitMaps: [canonicalSuitMap],
      myCrib,
      opponentCrib,
    };
  }

  return {
    results,
    timeTakenSeconds: (Date.now() - startTime) / 1000,
    processedHands: seen.size,
  };
}