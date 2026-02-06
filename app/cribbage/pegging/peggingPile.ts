import { Card } from '../core';
import { scoreCardPlay } from './scoreCard';

export interface PeggingResult {
  player: 'P1' | 'P2';
  card: Card | null;
  runningTotal: number;
  points: number;
  reasons: string[];
  pileReset: boolean;
  awardedGo?: boolean;
}

export interface Hands {
  starter: 'P1' | 'P2';
  p1Plays: Card[];
  p2Plays: Card[];
}

/**
 * Class to manage a pegging pile incrementally
 */
export class PeggingPile {
  pile: Card[] = [];
  total: number = 0;
  lastPlayerToPlay: 'P1' | 'P2' | null = null;

  /**
   * Play a card for a player, score it, and update pile state
   */
  playCard(player: 'P1' | 'P2', card: Card): PeggingResult {
    const score = scoreCardPlay(this.pile, card, this.total);
    this.pile.push(card);
    this.total +=
      card.rank === 'A'
        ? 1
        : ['J', 'Q', 'K'].includes(card.rank)
          ? 10
          : parseInt(card.rank, 10);
    this.lastPlayerToPlay = player;

    const pileReset = this.total === 31;
    if (pileReset) this.resetPile();

    return {
      player,
      card,
      runningTotal: this.total,
      points: score.points,
      reasons: score.reasons,
      pileReset
    };
  }

  /**
   * Award a "Go" to the last player who played if no one can play
   */
  awardGo(): PeggingResult | null {
    if (!this.lastPlayerToPlay) return null;
    return {
      player: this.lastPlayerToPlay,
      card: null,
      runningTotal: this.total,
      points: 1,
      reasons: ['Go'],
      pileReset: false,
      awardedGo: true
    };
  }

  /**
   * Reset pile for next sequence
   */
  resetPile() {
    this.pile = [];
    this.total = 0;
    this.lastPlayerToPlay = null;
  }
}
