import type { Card } from "../Card";

/**
 * Pioche la première carte du paquet
 * Retourne la carte + le paquet restant
 */
export function drawTopCard(deck: Card[]): {
  drawnCard: Card | null;
  remainingDeck: Card[];
} {
  if (deck.length === 0) {
    return {
      drawnCard: null,
      remainingDeck: [],
    };
  }

  const [first, ...rest] = deck;

  return {
    drawnCard: first,
    remainingDeck: rest,
  };
}