export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
export const SUITS = ['♠', '♥', '♦', '♣'] as const;

export type Suit = typeof SUITS[number];
export type Rank = typeof RANKS[number];

export interface Card {
  rank: Rank;
  suit: Suit;
}

export function getDeck(): Card[] {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({ rank, suit }))
  );
}

export function cardToString(card: Card): string {
  return `${card.rank}${card.suit}`;
}
