import { Card } from '../core/deck';

export function combine(
  cards: Card[],
  size: number,
  start: number,
  path: Card[],
  res: Card[][]
) {
  if (path.length === size) {
    res.push([...path]);
    return;
  }
  for (let i = start; i < cards.length; i++) {
    path.push(cards[i]);
    combine(cards, size, i + 1, path, res);
    path.pop();
  }
}

export function getAllCombosOfSize(cards: Card[], size: number): Card[][] {
  const results: Card[][] = [];
  combine(cards, size, 0, [], results);
  return results;
}

export function isRun(cards: Card[]): boolean {
  if (cards.length < 3) return false;
  const sorted = [...cards].sort((a, b) => a.rank.localeCompare(b.rank));
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].rank.charCodeAt(0) !== sorted[i - 1].rank.charCodeAt(0) + 1)
      return false;
  }
  return true;
}

export function isSameCardSet(a: Card[], b: Card[]): boolean {
  if (a.length !== b.length) return false;
  const aStr = a
    .map((c) => c.rank + c.suit)
    .sort()
    .join('');
  const bStr = b
    .map((c) => c.rank + c.suit)
    .sort()
    .join('');
  return aStr === bStr;
}
