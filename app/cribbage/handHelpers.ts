import { Card, cardToString } from './deck';
import { RANK_PRIMES } from './constants';

export function getPrimeRankHash(cards: Card[]): string {
  const primes = cards.map((card) => RANK_PRIMES[card.rank]);
  primes.sort((a, b) => a - b);
  return primes.join('-');
}

export function getHandHash(cards: Card[]): string {
  return cards.map(cardToString).join('-');
}

export function parseHandString(handStr: string): Card[] {
  if (!handStr || handStr.trim() === '') return [];

  return handStr
    .split('-')
    .map((cardStr) => {
      const rank = cardStr.slice(0, cardStr.length - 1);
      const suit = cardStr.slice(cardStr.length - 1);
      return { rank: rank as Card['rank'], suit: suit as Card['suit'] };
    })
    .filter(Boolean) as Card[];
}
