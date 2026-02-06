import { Card, cardToString } from './deck';
import { RANK_PRIMES } from './constants';

export function getHandHash(cards: Card[]): string {
  return cards.map(cardToString).join('-');
}

export function getPrimeRankHash(cards: Card[]): string {
  const primes = cards.map((card) => RANK_PRIMES[card.rank]);
  primes.sort((a, b) => a - b);
  return primes.join('-');
}
