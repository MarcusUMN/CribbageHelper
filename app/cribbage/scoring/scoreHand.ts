import { Card } from '../core/deck';
import { CardScore } from './types';
import { scoreFifteens } from './fifteens';
import { scorePairs } from './pairs';
import { scoreRuns } from './runs';
import { scoreFlush } from './flush';
import { scoreNobs } from './nobs';

export function scoreHand(
  hand: Card[],
  starter: Card,
  isCrib: boolean,
  returnSum: true
): number;
export function scoreHand(
  hand: Card[],
  starter: Card,
  isCrib: boolean,
  returnSum?: false
): { total: number; details: CardScore[] };

export function scoreHand(
  hand: Card[],
  starter: Card,
  isCrib: boolean,
  returnSum = false
): number | { total: number; details: CardScore[] } {
  const fullHand = [...hand, starter];

  if (returnSum) {
    return (
      (scoreFifteens(fullHand, true) as number) +
      (scorePairs(fullHand, true) as number) +
      (scoreRuns(fullHand, true) as number) +
      (scoreFlush(hand, starter, isCrib, true) as number) +
      (scoreNobs(hand, starter, true) as number)
    );
  }

  const details: CardScore[] = [
    ...(scoreFifteens(fullHand, false) as CardScore[]),
    ...(scorePairs(fullHand, false) as CardScore[]),
    ...(scoreRuns(fullHand, false) as CardScore[]),
    ...(scoreFlush(hand, starter, isCrib, false) as CardScore[]),
    ...(scoreNobs(hand, starter, false) as CardScore[])
  ];

  const total = details.reduce((sum, d) => sum + d.points, 0);

  return { total, details };
}
