import { Card } from '../core/deck';
import { CardScore } from './types';
import { RANK_ORDER } from '../core/constants';
import { getAllCombosOfSize, isRun, isSameCardSet } from './utils';

export function scoreRuns(cards: Card[], returnSum: true): number;
export function scoreRuns(cards: Card[], returnSum?: false): CardScore[];

export function scoreRuns(
  cards: Card[],
  returnSum = false
): number | CardScore[] {
  const results: CardScore[] = [];
  const n = cards.length;
  if (n < 3) return returnSum ? 0 : results;

  const sorted = [...cards].sort(
    (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank]
  );
  let maxRunLength = 0;
  const runDetails: CardScore[] = [];

  for (let size = n; size >= 3; size--) {
    const combos = getAllCombosOfSize(sorted, size);
    combos.forEach((combo) => {
      if (isRun(combo)) {
        if (size > maxRunLength) {
          maxRunLength = size;
          runDetails.length = 0;
          runDetails.push({
            category: 'Run',
            points: size,
            cards: combo,
            label: `Run of ${size}`
          });
        } else if (
          size === maxRunLength &&
          !runDetails.some((r) => isSameCardSet(r.cards, combo))
        ) {
          runDetails.push({
            category: 'Run',
            points: size,
            cards: combo,
            label: `Run of ${size}`
          });
        }
      }
    });
    if (maxRunLength > 0) break;
  }

  results.push(...runDetails);
  if (returnSum) return results.reduce((sum, r) => sum + r.points, 0);
  return results;
}
