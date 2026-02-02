import { Card } from '../core';
import { scoreRunFromEnd, getPegValue } from './helpers';

export interface CardScore {
  points: number;
  reasons: string[];
}

/**
 * Score a single card against a pile and running total
 */
export const scoreCardPlay = (
  pile: Card[],
  card: Card,
  currentTotal: number
): CardScore => {
  let points = 0;
  const reasons: string[] = [];
  const newTotal = currentTotal + getPegValue(card);

  if (newTotal === 15) {
    points += 2;
    reasons.push('Fifteen');
  }
  if (newTotal === 31) {
    points += 2;
    reasons.push('Thirty-One');
  }

  // Check pairs
  let pairCount = 1;
  for (let i = pile.length - 1; i >= 0; i--) {
    if (pile[i].rank === card.rank) pairCount++;
    else break;
  }
  if (pairCount === 2) {
    points += 2;
    reasons.push('Pair');
  }
  if (pairCount === 3) {
    points += 6;
    reasons.push('Three of a Kind');
  }
  if (pairCount === 4) {
    points += 12;
    reasons.push('Four of a Kind');
  }

  // Check runs
  const runLen = scoreRunFromEnd([...pile, card]);
  if (runLen >= 3) {
    points += runLen;
    reasons.push(`Run of ${runLen}`);
  }

  return { points, reasons };
};
