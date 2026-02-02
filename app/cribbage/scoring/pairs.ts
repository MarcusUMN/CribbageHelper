import { Card } from '../core/deck';
import { CardScore } from './types';

export function scorePairs(cards: Card[], returnSum: true): number;
export function scorePairs(cards: Card[], returnSum?: false): CardScore[];

export function scorePairs(
  cards: Card[],
  returnSum = false
): number | CardScore[] {
  const results: CardScore[] = [];
  const rankCounts: Record<string, Card[]> = {};

  cards.forEach((card) => {
    if (!rankCounts[card.rank]) rankCounts[card.rank] = [];
    rankCounts[card.rank].push(card);
  });

  Object.entries(rankCounts).forEach(([rank, cardsOfRank]) => {
    const count = cardsOfRank.length;
    if (count >= 2) {
      const pairsCount = (count * (count - 1)) / 2;
      results.push({
        category: 'Pair',
        points: pairsCount * 2,
        cards: cardsOfRank,
        label: `Pair${count > 2 ? 's' : ''} of ${rank}`
      });
    }
  });

  if (returnSum) return results.reduce((sum, r) => sum + r.points, 0);
  return results;
}
