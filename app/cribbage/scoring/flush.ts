import { Card } from '../core/deck';
import { CardScore } from './types';

export function scoreFlush(
  hand: Card[],
  starter: Card,
  isCrib: boolean,
  returnSum: true
): number;
export function scoreFlush(
  hand: Card[],
  starter: Card,
  isCrib: boolean,
  returnSum?: false
): CardScore[];

export function scoreFlush(
  hand: Card[],
  starter: Card,
  isCrib: boolean,
  returnSum = false
): number | CardScore[] {
  const results: CardScore[] = [];
  const firstSuit = hand[0].suit;
  if (!hand.every((c) => c.suit === firstSuit)) return returnSum ? 0 : results;

  if (starter.suit === firstSuit) {
    results.push({
      category: 'Flush',
      points: 5,
      cards: [...hand, starter],
      label: isCrib ? 'Crib Flush' : 'Flush'
    });
  } else if (!isCrib) {
    results.push({ category: 'Flush', points: 4, cards: hand, label: 'Flush' });
  }

  if (returnSum) return results.reduce((sum, r) => sum + r.points, 0);
  return results;
}
