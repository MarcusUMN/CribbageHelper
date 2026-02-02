import { Card, RANKS } from '../core';

// Pegging value mapping
export const rankValue: Record<string, number> = Object.fromEntries(
  RANKS.map((r) => [
    r,
    r === 'A' ? 1 : ['J', 'Q', 'K'].includes(r) ? 10 : Number(r)
  ])
);

// Convert rank to numeric order for runs
export const rankToNum = (rank: string): number => {
  if (rank === 'A') return 1;
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;
  return parseInt(rank, 10);
};

// Get the pegging value of a card
export const getPegValue = (card: Card): number =>
  card.rank === 'A'
    ? 1
    : ['J', 'Q', 'K'].includes(card.rank)
      ? 10
      : parseInt(card.rank, 10);

// Check for runs at the end of the pile
export const scoreRunFromEnd = (pile: Card[]): number => {
  if (pile.length < 3) return 0;
  for (let runSize = Math.min(pile.length, 7); runSize >= 3; runSize--) {
    const window = pile.slice(-runSize);
    const ranks = window.map((c) => rankToNum(c.rank)).sort((a, b) => a - b);
    if (new Set(ranks).size !== runSize) continue;
    if (ranks.every((v, i) => i === 0 || v === ranks[i - 1] + 1))
      return runSize;
  }
  return 0;
};

// Check if player can play any card given current total
export const canPlay = (hand: (Card | null)[], total: number): boolean =>
  hand.some((c) => c && getPegValue(c) + total <= 31);
