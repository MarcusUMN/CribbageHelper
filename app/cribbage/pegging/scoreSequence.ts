import { Card } from '../core';
import { PeggingPile, PeggingResult, Hands } from './peggingPile';

/**
 * Score a full pegging sequence given hands
 * Uses PeggingPile internally for incremental scoring
 */
export const scoreSequence = ({
  starter,
  p1Plays,
  p2Plays
}: Hands): PeggingResult[] => {
  const results: PeggingResult[] = [];
  const hands: Record<'P1' | 'P2', (Card | null)[]> = {
    P1: [...p1Plays],
    P2: [...p2Plays]
  };

  const pile = new PeggingPile();
  let currentPlayer: 'P1' | 'P2' = starter;

  while (hands.P1.some((c) => c) || hands.P2.some((c) => c)) {
    const card = hands[currentPlayer][0];

    // Can current player play?
    if (
      card &&
      pile.total +
        (card.rank === 'A'
          ? 1
          : ['J', 'Q', 'K'].includes(card.rank)
            ? 10
            : parseInt(card.rank, 10)) <=
        31
    ) {
      hands[currentPlayer].shift();
      const score = pile.playCard(currentPlayer, card);
      results.push(score);

      // Switch player normally
      currentPlayer = currentPlayer === 'P1' ? 'P2' : 'P1';
      continue;
    }

    // Check if other player can play
    const otherPlayer: 'P1' | 'P2' = currentPlayer === 'P1' ? 'P2' : 'P1';
    const otherCard = hands[otherPlayer][0];

    if (
      otherCard &&
      pile.total +
        (otherCard.rank === 'A'
          ? 1
          : ['J', 'Q', 'K'].includes(otherCard.rank)
            ? 10
            : parseInt(otherCard.rank, 10)) <=
        31
    ) {
      currentPlayer = otherPlayer;
      continue;
    }

    // Neither can play → award Go
    const go = pile.awardGo();
    if (go) results.push(go);

    // Reset pile automatically
    pile.resetPile();
  }

  // Award Last Card to the last actual card played (ignore any Go plays)
  const lastCardPlay = [...results].reverse().find((r) => r.card);
  if (lastCardPlay) {
    lastCardPlay.points += 1;
    lastCardPlay.reasons.push('Last Card');
  }

  return results;
};
