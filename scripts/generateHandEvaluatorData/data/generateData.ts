import { getDeck, canonicalizeHand } from '../../../src/utils';
import { combinations } from '../../../src/utils/combinations';
import { evaluateKeep } from '../evaluation/evalulateKeep';

export type SerializedResult = {
  keep: string[];
  discard: string[];
  scoreData: any;
};

export type CribEvaluationResults = {
  myCrib: SerializedResult[];
  opponentCrib: SerializedResult[];
  suitMap: Record<string, string>;
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
    if ((i + 1) % 10000 === 0) {
      console.log(`Processing hand ${i + 1} of ${total}`);
    }
    const hand = allHands[i];
    const { canonicalKey, normalizeSubset, suitMap } = canonicalizeHand(hand);

    if (seen.has(canonicalKey)) continue; // skip duplicates
    seen.add(canonicalKey);

    // Remaining deck excludes cards in hand by exact rank+suit
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
      const myCribData = evaluateKeep(keep, discard, remainingDeck, true);
      myCrib.push({
        keep: normalizeSubset(keep),
        discard: normalizeSubset(discard),
        scoreData: myCribData,
      });

      const oppCribStats = evaluateKeep(keep, discard, remainingDeck, false);
      opponentCrib.push({
        keep: normalizeSubset(keep),
        discard: normalizeSubset(discard),
        scoreData: oppCribStats,
      });
    }

    results[canonicalKey] = {
      suitMap: Object.fromEntries(suitMap),
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