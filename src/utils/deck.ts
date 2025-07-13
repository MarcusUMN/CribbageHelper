export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

// S = Spades, H = Hearts, D = Diamonds, C = Clubs
export const SUITS = ['S', 'H', 'D', 'C'] as const;

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

export function getRandomHand(handLength: number): Card[] {
  const deck = getDeck();
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const randomDeck: Card[] = shuffled.slice(0, handLength);
  return randomDeck
}

export function cardToString(card: Card): string {
  return `${card.rank}${card.suit}`;
}

// Returns the same string for the same combination of cards, regardless of their order in the input array.
export function getHandHash(cards: Card[]): string {
  return cards
    .map(cardToString)
    .sort() 
    .join('');
} 