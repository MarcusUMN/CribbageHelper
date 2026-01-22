import { Card, getPegValue } from "../../cribbage";
import { showError } from "./ErrorNotifications";

export const errorLogic = {
  // Converts any blank card objects to null
  normalizeHand: (hand: (Card | null)[]): (Card | null)[] =>
    hand.map((c) => (c && c.rank && c.suit ? c : null)),

  validateNotEmpty: (hand: (Card | null)[]): boolean => {
    const normalized = errorLogic.normalizeHand(hand);
    if (normalized.some((c) => !c)) {
      showError("Please select all cards.");
      return false;
    }
    return true;
  },

  validateNoDuplicates: (hand: (Card | null)[]): boolean => {
    const normalized = errorLogic.normalizeHand(hand).filter(Boolean) as Card[];
    const seen = new Set<string>();
    for (const c of normalized) {
      const key = `${c.rank}${c.suit}`;
      if (seen.has(key)) {
        showError("Duplicate cards detected!");
        return false;
      }
      seen.add(key);
    }
    return true;
  },
  validateHand: (
    hand: (Card | null)[],
    options?: { starter?: Card | null },
  ): boolean => {
    const { starter } = options || {};
    const fullHand = starter ? [...hand, starter] : [...hand];

    if (!errorLogic.validateNotEmpty(fullHand)) return false;
    if (!errorLogic.validateNoDuplicates(fullHand)) return false;

    return true;
  },
  validatePlayableSequence: (
    starter: "P1" | "P2",
    p1Plays: (Card | null)[],
    p2Plays: (Card | null)[],
  ): boolean => {
    const hands: Record<"P1" | "P2", (Card | null)[]> = {
      P1: [...p1Plays],
      P2: [...p2Plays],
    };
    const allCards = [...hands.P1, ...hands.P2];
    if (!errorLogic.validateNotEmpty(allCards)) return false;
    if (!errorLogic.validateNoDuplicates(allCards)) return false;

    let total = 0;
    let currentPlayer: "P1" | "P2" = starter;

    while (hands.P1.some((c) => c) || hands.P2.some((c) => c)) {
      const playerHand = hands[currentPlayer];

      const playableIdx = playerHand.findIndex(
        (c) => c && getPegValue(c) + total <= 31,
      );

      if (playableIdx === -1) {
        // No playable card
        const otherPlayer: "P1" | "P2" = currentPlayer === "P1" ? "P2" : "P1";
        const otherPlayable = hands[otherPlayer].find(
          (c) => c && getPegValue(c) + total <= 31,
        );

        if (!otherPlayable) {
          // Neither player can play → reset pile
          total = 0;

          // If both hands are empty, we’re done
          if (!hands.P1.some((c) => c) && !hands.P2.some((c) => c)) {
            break;
          }
        }

        currentPlayer = otherPlayer;
        continue;
      }

      // Enforce correct order (first card must be the playable one)
      const nextCard = playerHand[0];
      if (!nextCard || getPegValue(nextCard) + total > 31) {
        const correctCard = playerHand[playableIdx]!;
        showError(
          `Invalid sequence: ${currentPlayer} could have played ${correctCard.rank}${correctCard.suit} earlier instead of waiting.`,
        );
        return false;
      }

      // Play the card
      total += getPegValue(nextCard);
      playerHand.shift();

      if (total === 31) total = 0;

      // Switch to other player if they can play
      const otherPlayer: "P1" | "P2" = currentPlayer === "P1" ? "P2" : "P1";
      if (hands[otherPlayer].some((c) => c && getPegValue(c) + total <= 31)) {
        currentPlayer = otherPlayer;
      }
    }
    return true;
  },
};
