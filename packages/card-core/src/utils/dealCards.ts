import type { Card } from "../Card";

/**
 * Distribue des cartes à plusieurs joueurs
 */
export function dealCards(
  deck: Card[],
  playerIds: string[],
  cardsPerPlayer: number
): {
  hands: Record<string, Card[]>;
  remainingDeck: Card[];
} {
  const hands: Record<string, Card[]> = {};

  // initialiser les mains
  for (const playerId of playerIds) {
    hands[playerId] = [];
  }

  let remainingDeck = [...deck];

  // distribuer carte par carte (tour par tour)
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (const playerId of playerIds) {
      if (remainingDeck.length === 0) break;

      const [card, ...rest] = remainingDeck;
      hands[playerId].push(card);
      remainingDeck = rest;
    }
  }

  return {
    hands,
    remainingDeck,
  };
}