import type { Card } from "../Card";

/**
 * Mélange un paquet de cartes (algorithme Fisher-Yates)
 * Ne modifie pas le paquet original
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]; // copie

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // swap
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}