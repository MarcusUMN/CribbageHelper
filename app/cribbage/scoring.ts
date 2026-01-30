import { Card } from './deck';
import { RANK_VALUE, RANK_ORDER } from './constants';

export interface ScoreDetail {
  type: string;
  points: number;
  cards: Card[];
}

export function scoreHand(
  hand: Card[],
  starter: Card,
  isCrib: boolean
): { total: number; details: ScoreDetail[] } {
  const fullHand = [...hand, starter];
  const details: ScoreDetail[] = [];

  // 1. Fifteens (2 points each)
  details.push(...scoreFifteens(fullHand));

  // 2. Pairs (2 points each)
  details.push(...scorePairs(fullHand));

  // 3. Runs (3 or more cards in sequence)
  details.push(...scoreRuns(fullHand));

  // 4. Flush (4 cards in hand same suit, +1 if starter matches; 5 if crib flush)
  details.push(...scoreFlush(hand, starter, isCrib));

  // 5. Nobs (Jack in hand same suit as starter, 1 point)
  details.push(...scoreNobs(hand, starter));

  // Sum points
  const total = details.reduce((sum, d) => sum + d.points, 0);
  return { total, details };
}

export function scoreHandIgnoringFlushAndNobs(
  hand: Card[],
  starter: Card
): number {
  const fullHand = [...hand, starter];
  let total = 0;

  for (const combo of getAllCombos(fullHand)) {
    const sum = combo.reduce((acc, c) => acc + RANK_VALUE[c.rank], 0);
    if (sum === 15) total += 2;
  }

  const rankCounts: Record<string, number> = {};
  for (const card of fullHand) {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  }
  for (const count of Object.values(rankCounts)) {
    if (count >= 2) total += count * (count - 1);
  }

  const sorted = [...fullHand].sort(
    (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank]
  );
  for (let size = 5; size >= 3; size--) {
    const combos = getAllCombosOfSize(sorted, size);
    for (const combo of combos) {
      if (isRun(combo)) return total + size;
    }
  }

  return total;
}

export function calculateFlushScore(
  hand: Card[],
  starter: Card,
  isCrib: boolean
): number {
  const firstSuit = hand[0].suit;
  if (!hand.every((c) => c.suit === firstSuit)) return 0;
  if (starter.suit === firstSuit) return 5;
  return isCrib ? 0 : 4;
}

export function calculateNobsScore(hand: Card[], starter: Card): number {
  return hand.some((c) => c.rank === 'J' && c.suit === starter.suit) ? 1 : 0;
}

function scoreFifteens(cards: Card[]): ScoreDetail[] {
  const results: ScoreDetail[] = [];
  const combos = getAllCombos(cards);

  for (const combo of combos) {
    const sum = combo.reduce((acc, c) => acc + RANK_VALUE[c.rank], 0);
    if (sum === 15 && !results.some((r) => isSameCardSet(r.cards, combo))) {
      results.push({ type: 'Fifteen', points: 2, cards: combo });
    }
  }

  return results;
}

function scorePairs(cards: Card[]): ScoreDetail[] {
  const results: ScoreDetail[] = [];
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
        type: `Pair${count > 2 ? 's' : ''} of ${rank}`,
        points: pairsCount * 2,
        cards: cardsOfRank
      });
    }
  });

  return results;
}

function scoreRuns(cards: Card[]): ScoreDetail[] {
  const results: ScoreDetail[] = [];
  const n = cards.length;
  if (n < 3) return results;

  const sorted = [...cards].sort(
    (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank]
  );

  let maxRunLength = 0;
  const runDetails: ScoreDetail[] = [];

  for (let size = n; size >= 3; size--) {
    const combos = getAllCombosOfSize(sorted, size);
    combos.forEach((combo) => {
      if (isRun(combo)) {
        if (size > maxRunLength) {
          maxRunLength = size;
          runDetails.length = 0;
          runDetails.push({
            type: `Run of ${size}`,
            points: size,
            cards: combo
          });
        } else if (
          size === maxRunLength &&
          !runDetails.some((r) => isSameCardSet(r.cards, combo))
        ) {
          runDetails.push({
            type: `Run of ${size}`,
            points: size,
            cards: combo
          });
        }
      }
    });

    if (maxRunLength > 0) break;
  }

  results.push(...runDetails);
  return results;
}

function isRun(cards: Card[]): boolean {
  if (cards.length < 3) return false;
  const sorted = [...cards].sort(
    (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank]
  );
  for (let i = 1; i < sorted.length; i++) {
    if (RANK_ORDER[sorted[i].rank] !== RANK_ORDER[sorted[i - 1].rank] + 1)
      return false;
  }
  return true;
}

function scoreFlush(
  hand: Card[],
  starter: Card,
  isCrib: boolean
): ScoreDetail[] {
  const flushResults: ScoreDetail[] = [];
  const firstSuit = hand[0].suit;
  if (hand.every((c) => c.suit === firstSuit)) {
    if (starter.suit === firstSuit) {
      const points = 5;
      flushResults.push({
        type: isCrib ? 'Crib Flush' : 'Flush',
        points,
        cards: [...hand, starter]
      });
    } else if (!isCrib) {
      flushResults.push({
        type: 'Flush',
        points: 4,
        cards: hand
      });
    }
  }
  return flushResults;
}

function scoreNobs(hand: Card[], starter: Card): ScoreDetail[] {
  const results: ScoreDetail[] = [];
  hand.forEach((card) => {
    if (card.rank === 'J' && card.suit === starter.suit) {
      results.push({ type: 'Nobs', points: 1, cards: [card] });
    }
  });
  return results;
}

function getAllCombos(cards: Card[]): Card[][] {
  const results: Card[][] = [];
  const n = cards.length;
  for (let i = 2; i <= n; i++) {
    combine(cards, i, 0, [], results);
  }
  return results;
}

function getAllCombosOfSize(cards: Card[], size: number): Card[][] {
  const results: Card[][] = [];
  combine(cards, size, 0, [], results);
  return results;
}

function combine(
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

function isSameCardSet(a: Card[], b: Card[]): boolean {
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
