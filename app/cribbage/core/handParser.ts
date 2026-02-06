import { Card } from '././deck';

export function parseHandString(handStr: string): Card[] {
  if (!handStr || handStr.trim() === '') return [];
  return handStr
    .split('-')
    .map((cardStr) => ({
      rank: cardStr.slice(0, cardStr.length - 1) as Card['rank'],
      suit: cardStr.slice(cardStr.length - 1) as Card['suit']
    }))
    .filter(Boolean) as Card[];
}
