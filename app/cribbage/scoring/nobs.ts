import { Card } from '../core/deck';
import { CardScore } from './types';

export function scoreNobs(hand: Card[], starter: Card, returnSum: true): number;
export function scoreNobs(
  hand: Card[],
  starter: Card,
  returnSum?: false
): CardScore[];

export function scoreNobs(
  hand: Card[],
  starter: Card,
  returnSum = false
): number | CardScore[] {
  const results: CardScore[] = [];
  const jack = hand.find((c) => c.rank === 'J' && c.suit === starter.suit);
  if (jack)
    results.push({ category: 'Nobs', points: 1, cards: [jack], label: 'Nobs' });

  if (returnSum) return results.reduce((sum, r) => sum + r.points, 0);
  return results;
}
