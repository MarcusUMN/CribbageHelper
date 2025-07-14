import { Card, cardToString, Rank, Suit } from './deck';
import { SerializedResult } from '../../scripts/generateHandEvaluatorData/data/generateData';

const RANK_PRIMES: Record<string, number> = {
  A: 2,
  '2': 3,
  '3': 5,
  '4': 7,
  '5': 11,
  '6': 13,
  '7': 17,
  '8': 19,
  '9': 23,
  '10': 29,
  J: 31,
  Q: 37,
  K: 41,
};

export function getPrimeRankHash(cards: Card[]): string {
  const primes = cards.map(card => RANK_PRIMES[card.rank]);
  primes.sort((a, b) => a - b);
  return primes.join('-');
}

export function getHandHash(cards: Card[]): string {
  return cards
    .map(cardToString)
    .sort() 
    .join('-');
} 

export function canonicalizeHand(hand: Card[]) {
  const suitMap = new Map<string, string>();
  let nextSuitId = 0;

  const sortedCards = [...hand].sort((a, b) => {
    if (a.rank === b.rank) return a.suit.localeCompare(b.suit);
    return a.rank.localeCompare(b.rank);
  });

  const parts: string[] = [];

  for (const card of sortedCards) {
    if (!suitMap.has(card.suit)) {
      suitMap.set(card.suit, `S${nextSuitId++}`);
    }
    parts.push(card.rank + suitMap.get(card.suit));
  }

  const canonicalKey = parts.join('-');

  function normalizeSubset(cards: Card[]): string[] {
    return cards
      .slice()
      .sort((a, b) => {
        if (a.rank === b.rank) return a.suit.localeCompare(b.suit);
        return a.rank.localeCompare(b.rank);
      })
      .map(c => c.rank + suitMap.get(c.suit));
  }

  return { canonicalKey, suitMap, normalizeSubset };
}

function parseCard(str: string): Card {
  const match = str.match(/^(10|[2-9AJQK])([SHDC])$/);
  if (!match) throw new Error(`Invalid card: ${str}`);
  const rank = match[1] as Rank;
  const suit = match[2] as Suit;
  return { rank, suit };
}

function getSuitNormalization(cards: Card[]): { key: string; suitMap: Map<string, string> } {
  const suitMap = new Map<string, string>();
  let nextSuitId = 0;

  const sortedCards = [...cards].sort((a, b) => {
    if (a.rank === b.rank) return a.suit.localeCompare(b.suit);
    return a.rank.localeCompare(b.rank);
  });

  const parts: string[] = [];

  for (const card of sortedCards) {
    if (!suitMap.has(card.suit)) {
      suitMap.set(card.suit, `S${nextSuitId++}`);
    }
    parts.push(card.rank + suitMap.get(card.suit));
  }

  return { key: parts.join('-'), suitMap };
}

export function convertHashToCanonicalKey(handStr: string): string {
  const cards = handStr.split('-').map(parseCard);
  const { key } = getSuitNormalization(cards);
  return key;
}

export function canonicalCardToOriginal(
  cardStr: string,
  canonicalToActualMap: Record<string, string>
): string {
  const invertedMap = Object.entries(canonicalToActualMap).reduce<Record<string, string>>(
    (acc, [actualSuit, canonicalSuit]) => {
      acc[canonicalSuit] = actualSuit;
      return acc;
    }, {}
  );

  const match = cardStr.match(/^(\d+|[AJQK])([SHDC]\d)$/);
  if (!match) {
    return cardStr;
  }
  const [, rank, canonicalSuit] = match;

  const originalSuit = invertedMap[canonicalSuit];

  if (!originalSuit) {
    return cardStr;
  }
  return `${rank}${originalSuit}`;
}



export function denormalizeSerializedResult(
  result: SerializedResult,
  canonicalToActualMap: Record<string, string>
): SerializedResult {
  function denormalizeCards(cards: string[]): string[] {
    return cards.map(cardStr => canonicalCardToOriginal(cardStr, canonicalToActualMap));
  }

  return {
    ...result,
    keep: denormalizeCards(result.keep),
    discard: denormalizeCards(result.discard),
  };
}

function findMatchingCanonicalSuitMap(
  handKey: string,
  canonicalSuitMaps: Record<string, string>[],
  expectedCanonicalKey: string
): Record<string, string> | null {
  const originalCards = handKey.split('-').map(parseCard);

  for (const suitMap of canonicalSuitMaps) {
    const actualToCanonical = new Map<string, string>(Object.entries(suitMap));

    const parts: string[] = [];

    const sortedCards = [...originalCards].sort((a, b) => {
      if (a.rank === b.rank) return a.suit.localeCompare(b.suit);
      return a.rank.localeCompare(b.rank);
    });

    for (const card of sortedCards) {
      const mappedSuit = actualToCanonical.get(card.suit);
      if (!mappedSuit) {
        parts.push(`${card.rank}?`);
        continue;
      }
      parts.push(`${card.rank}${mappedSuit}`);
    }

    const generatedKey = parts.join('-');
    if (generatedKey === expectedCanonicalKey) {
      return suitMap;
    }
  }

  return null;
}

export function denormalizeHandsFromKey(
  handKey: string,
  handsRaw: SerializedResult[],
  canonicalSuitMaps: Record<string, string>[],
  canonicalKey: string
): SerializedResult[] {
  const canonicalSuitMap = findMatchingCanonicalSuitMap(handKey, canonicalSuitMaps, canonicalKey) ?? {};
  return handsRaw.map(sr => denormalizeSerializedResult(sr, canonicalSuitMap));
}
