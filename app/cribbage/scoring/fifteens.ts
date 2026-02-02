import { Card } from '../core/deck';
import { CardScore } from './types';
import { combine, isSameCardSet } from './utils';
import { RANK_VALUE } from '../core/constants';

export function scoreFifteens(cards: Card[], returnSum: true): number;
export function scoreFifteens(cards: Card[], returnSum?: false): CardScore[];

export function scoreFifteens(
  cards: Card[],
  returnSum = false
): number | CardScore[] {
  const results: CardScore[] = [];
  const combos: Card[][] = [];
  const n = cards.length;

  for (let i = 2; i <= n; i++) {
    combine(cards, i, 0, [], combos);
  }

  for (const combo of combos) {
    const sum = combo.reduce((acc, c) => acc + RANK_VALUE[c.rank], 0);
    if (sum === 15 && !results.some((r) => isSameCardSet(r.cards, combo))) {
      results.push({
        category: 'Fifteen',
        points: 2,
        cards: combo,
        label: 'Fifteen'
      });
    }
  }

  if (returnSum) return results.reduce((sum, r) => sum + r.points, 0);
  return results;
}
