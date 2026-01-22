import { Card, RANKS, getDeck } from "./deck";

// Pegging value mapping
const rankValue: Record<string, number> = Object.fromEntries(
  RANKS.map(r => [r, r === "A" ? 1 : ["J", "Q", "K"].includes(r) ? 10 : Number(r)])
);

// --- Types ---
export interface Hands {
  starter: "P1" | "P2";
  p1Plays: (Card | null)[];
  p2Plays: (Card | null)[];
}

export interface PeggingPlay {
  player: "P1" | "P2";
  card: Card;
}

export interface PeggingResult {
  player: "P1" | "P2";
  card: Card;
  runningTotal: number;
  points: number;
  reasons: string[];
  pileReset: boolean;
  awardedGo?: boolean;
}

// --- Helpers ---
export const getPegValue = (card: Card): number => {
  if (card.rank === "A") return 1;
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  return parseInt(card.rank, 10);
};

const rankToNum = (rank: string): number => {
  if (rank === "A") return 1;
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  return parseInt(rank, 10);
};

const scoreRunFromEnd = (pile: Card[]): number => {
  if (pile.length < 3) return 0;
  for (let runSize = Math.min(pile.length, 7); runSize >= 3; runSize--) {
    const window = pile.slice(-runSize);
    const ranks = window.map(c => rankToNum(c.rank)).sort((a, b) => a - b);
    if (new Set(ranks).size !== runSize) continue;

    if (ranks.every((v, i) => i === 0 || v === ranks[i - 1] + 1)) return runSize;
  }
  return 0;
};

// --- Generate random hands for pegging ---
export const generateLegalPeggingHands = (): { p1: Card[]; p2: Card[] } => {
  const deck = getDeck().sort(() => Math.random() - 0.5);
  const p1: Card[] = [];
  const p2: Card[] = [];
  const handCards = deck.slice(0, 8);
  let runningTotal = 0;

  handCards.forEach(card => {
    const value = rankValue[card.rank];
    if (runningTotal + value <= 31) {
      if (p1.length <= p2.length) p1.push(card);
      else p2.push(card);
      runningTotal += value;
    } else {
      runningTotal = 0;
      if (p1.length <= p2.length) p1.push(card);
      else p2.push(card);
    }
  });

  while (p1.length < 4) p1.push(handCards.pop()!);
  while (p2.length < 4) p2.push(handCards.pop()!);

  return { p1, p2 };
};

// Check if player can play any card given current total
export const canPlay = (hand: (Card|null)[], total: number): boolean =>
  hand.some(c => c && getPegValue(c) + total <= 31);

// Score a single play
export const scoreCardPlay = (pile: Card[], card: Card, total: number): { points: number; reasons: string[] } => {
  let points = 0;
  const reasons: string[] = [];
  const newTotal = total + getPegValue(card);

  if (newTotal === 15) { reasons.push("Fifteen"); points += 2; }
  if (newTotal === 31) { reasons.push("Thirty-One"); points += 2; }

  // Check pairs
  let pairCount = 1;
  for (let i = pile.length - 1; i >= 0; i--) {
    if (pile[i].rank === card.rank) pairCount++;
    else break;
  }
  if (pairCount === 2) { reasons.push("Pair"); points += 2; }
  if (pairCount === 3) { reasons.push("Three of a Kind"); points += 6; }
  if (pairCount === 4) { reasons.push("Four of a Kind"); points += 12; }

  // Check runs
  const runLen = scoreRunFromEnd([...pile, card]);
  if (runLen >= 3) { reasons.push(`Run of ${runLen}`); points += runLen; }

  return { points, reasons };
};

export const calculatePeggingSequenceFromHands = ({
  starter,
  p1Plays,
  p2Plays
}: Hands): PeggingResult[] => {
  const results: PeggingResult[] = [];
  const hands: Record<"P1"|"P2", (Card | null)[]> = {
    P1: [...p1Plays],
    P2: [...p2Plays]
  };

  let total = 0;
  let pile: Card[] = [];
  let currentPlayer: "P1" | "P2" = starter;
  let lastPlayerToPlay: "P1" | "P2" | null = null;

  while (hands.P1.some(c => c) || hands.P2.some(c => c)) {
    const card = hands[currentPlayer][0];

    // Can current player play?
    if (card && getPegValue(card) + total <= 31) {
      hands[currentPlayer].shift();
      total += getPegValue(card);
      pile.push(card);
      lastPlayerToPlay = currentPlayer;

      const score = scoreCardPlay(pile.slice(0, -1), card, total - getPegValue(card));

      results.push({
        player: currentPlayer,
        card,
        runningTotal: total,
        points: score.points,
        reasons: score.reasons,
        pileReset: total === 31
      });

      if (total === 31) {
        total = 0;
        pile = [];
        lastPlayerToPlay = null;
      }

      // Switch player normally
      currentPlayer = currentPlayer === "P1" ? "P2" : "P1";
      continue;
    }

    // Check if other player can play
    const otherPlayer: "P1" | "P2" = currentPlayer === "P1" ? "P2" : "P1";
    const otherCard = hands[otherPlayer][0];

    if (otherCard && getPegValue(otherCard) + total <= 31) {
      currentPlayer = otherPlayer;
      continue;
    }

    // Neither can play → award Go only if lastPlayerToPlay exists
    if (lastPlayerToPlay) {
      results.push({
        player: lastPlayerToPlay,
        card: null as any,
        runningTotal: total,
        points: 1,
        reasons: ["Go"],
        pileReset: false,
        awardedGo: true
      });
    }

    // Reset pile
    total = 0;
    pile = [];
    lastPlayerToPlay = null;
  }

  // Award Last Card only to the last actual card played (ignore any Go plays)
  const lastCardPlay = [...results].reverse().find(r => r.card);
  if (lastCardPlay) {
    lastCardPlay.points += 1;
    lastCardPlay.reasons.push("Last Card");
  }

  return results;
};


