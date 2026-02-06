import { Card, getDeck } from '../core';
import { rankValue } from './helpers';

export interface PeggingHands {
  p1: Card[];
  p2: Card[];
}

/**
 * Generates a random legal sequence of pegging hands
 * Ensures that no card pushes the running total above 31
 */
export const generatePeggingHands = (): PeggingHands => {
  const deck = getDeck().sort(() => Math.random() - 0.5);
  const handPool = deck
    .slice(0, 8)
    .sort((a, b) => rankValue[a.rank] - rankValue[b.rank]);
  const p1: Card[] = [];
  const p2: Card[] = [];

  let total = 0;
  let currentPlayer: 'P1' | 'P2' = 'P1';

  for (let i = 0; i < handPool.length; i++) {
    const card = handPool[i];
    const value = rankValue[card.rank];

    if (total + value > 31) total = 0;

    if (currentPlayer === 'P1' && p1.length < 4) p1.push(card);
    else if (currentPlayer === 'P2' && p2.length < 4) p2.push(card);

    total += value;
    currentPlayer = currentPlayer === 'P1' ? 'P2' : 'P1';
  }

  return { p1, p2 };
};
