import { getDeck, cardToString, getHandHash } from '../../../src/utils';
import { combinations } from '../../../src/utils/combinations';
import { evaluateKeep} from '../evaluation/evalulateKeep';

export type SerializedResult = {
  keep: string[];
  discard: string[];
  scoreData: any;
};

export type CribEvaluationResults = {
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
    if ((i + 1) % 100 === 0) {
      console.log(`Processing hand ${i + 1} of ${total}`);
    }
    const hand = allHands[i];
    const handKey = getHandHash(hand);

    if (seen.has(handKey)) continue;
    seen.add(handKey);
   
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
        keep: keep.map(cardToString),
        discard: discard.map(cardToString),
        scoreData: myCribData,
      });

      const oppCribStats = evaluateKeep(keep, discard, remainingDeck, false);
      opponentCrib.push({
        keep: keep.map(cardToString),
        discard: discard.map(cardToString),
        scoreData: oppCribStats,
      });
    }

    results[handKey] = {
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
 