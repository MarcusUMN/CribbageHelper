import { Card } from './deck';

export function validateHand(hand: Card[], starter: Card): boolean {
  const all = [...hand, starter];
  const unique = new Set(all.map((c) => `${c.rank}${c.suit}`));
  return hand.length === 4 && unique.size === 5;
}
