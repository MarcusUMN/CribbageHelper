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
  isMyCrib: boolean
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
  details.push(...scoreFlush(hand, starter, isMyCrib));

  // 5. Nobs (Jack in hand same suit as starter, 1 point)
  details.push(...scoreNobs(hand, starter));

  // Sum points
  const total = details.reduce((sum, d) => sum + d.points, 0);
  return { total, details };
}

// -- Fifteens (2 points) --
// Already implemented above

function scoreFifteens(cards: Card[]): ScoreDetail[] {
  const results: ScoreDetail[] = [];
  const combos = getAllCombos(cards);

  for (const combo of combos) {
    const sum = combo.reduce((acc, c) => acc + RANK_VALUE[c.rank], 0);
    if (sum === 15) {
      // Avoid duplicate combos with same cards
      if (!results.some(r => isSameCardSet(r.cards, combo))) {
        results.push({ type: 'Fifteen', points: 2, cards: combo });
      }
    }
  }

  return results;
}

// -- Pairs (2 points each pair) --

function scorePairs(cards: Card[]): ScoreDetail[] {
  const results: ScoreDetail[] = [];
  const rankCounts: Record<string, Card[]> = {};

  cards.forEach(card => {
    if (!rankCounts[card.rank]) rankCounts[card.rank] = [];
    rankCounts[card.rank].push(card);
  });

  Object.entries(rankCounts).forEach(([rank, cardsOfRank]) => {
    const count = cardsOfRank.length;
    if (count >= 2) {
      // Number of pairs in n cards: n*(n-1)/2
      const pairsCount = (count * (count - 1)) / 2;
      results.push({
        type: `Pair${count > 2 ? 's' : ''} of ${rank}`,
        points: pairsCount * 2,
        cards: cardsOfRank,
      });
    }
  });

  return results;
}

// -- Runs (3 or more consecutive cards) --

function scoreRuns(cards: Card[]): ScoreDetail[] {
  const results: ScoreDetail[] = [];
  const n = cards.length;
  if (n < 3) return results;

  // Sort cards by rank order
  const sorted = [...cards].sort((a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank]);

  // Helper to find runs of length >= 3 in sorted cards, including duplicates
  // We consider all combos length 3 to n
  let maxRunLength = 0;
  const runDetails: ScoreDetail[] = [];

  for (let size = n; size >= 3; size--) {
    const combos = getAllCombosOfSize(sorted, size);
    combos.forEach(combo => {
      if (isRun(combo)) {
        if (size > maxRunLength) {
          // New longer runs invalidate shorter ones
          maxRunLength = size;
          runDetails.length = 0; // clear
          runDetails.push({ type: `Run of ${size}`, points: size, cards: combo });
        } else if (size === maxRunLength) {
          // Equal length runs add points
          // Avoid duplicates
          if (!runDetails.some(r => isSameCardSet(r.cards, combo))) {
            runDetails.push({ type: `Run of ${size}`, points: size, cards: combo });
          }
        }
      }
    });

    if (maxRunLength > 0) break; // Only longest runs count
  }

  results.push(...runDetails);
  return results;
}

function isRun(cards: Card[]): boolean {
  if (cards.length < 3) return false;
  const sorted = [...cards].sort((a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank]);
  for (let i = 1; i < sorted.length; i++) {
    if (RANK_ORDER[sorted[i].rank] !== RANK_ORDER[sorted[i - 1].rank] + 1) return false;
  }
  return true;
}

// -- Flush --
// If all 4 cards in hand same suit = 4 points, +1 if starter matches suit (total 5) unless crib (then 5 points only if starter matches too)
function scoreFlush(hand: Card[], starter: Card, isCrib: boolean): ScoreDetail[] {
  const flushResults: ScoreDetail[] = [];
  const firstSuit = hand[0].suit;
  if (hand.every((c) => c.suit === firstSuit)) {
    // Flush of 4 cards in hand
    if (starter.suit === firstSuit) {
      // Starter matches suit
      const points = isCrib ? 5 : 5;
      flushResults.push({
        type: isCrib ? 'Crib Flush' : 'Flush',
        points,
        cards: [...hand, starter],
      });
    } else if (!isCrib) {
      // Non-crib flush only 4 points if starter doesn't match
      flushResults.push({
        type: 'Flush',
        points: 4,
        cards: hand,
      });
    }
  }
  return flushResults;
}

// -- Nobs (Knobs) --
// Jack in hand same suit as starter, 1 point
function scoreNobs(hand: Card[], starter: Card): ScoreDetail[] {
  const results: ScoreDetail[] = [];
  hand.forEach((card) => {
    if (card.rank === 'J' && card.suit === starter.suit) {
      results.push({ type: 'Nobs', points: 1, cards: [card] });
    }
  });
  return results;
}

// Helper: Get all combos of any size >=2 for fifteens
function getAllCombos(cards: Card[]): Card[][] {
  const results: Card[][] = [];
  const n = cards.length;

  for (let i = 2; i <= n; i++) {
    combine(cards, i, 0, [], results);
  }

  return results;
}

// Helper: Get all combos of a specific size
function getAllCombosOfSize(cards: Card[], size: number): Card[][] {
  const results: Card[][] = [];
  combine(cards, size, 0, [], results);
  return results;
}

function combine(cards: Card[], size: number, start: number, path: Card[], res: Card[][]) {
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

// Helper: Compare if two card arrays contain same cards regardless of order
function isSameCardSet(a: Card[], b: Card[]): boolean {
  if (a.length !== b.length) return false;
  const aStr = a.map(c => c.rank + c.suit).sort().join('');
  const bStr = b.map(c => c.rank + c.suit).sort().join('');
  return aStr === bStr;
}
