import type { Card } from "../../../card-core/src";

import { GAME37_RANK_ORDER } from "../constants/game37Ranks";

export function getCardStrength(card: Card): number {
  return GAME37_RANK_ORDER.indexOf(card.rank);
}

export function isStrongerCard(cardA: Card, cardB: Card): boolean {
  return getCardStrength(cardA) > getCardStrength(cardB);
}

export function sortCardsByStrengthAsc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => getCardStrength(a) - getCardStrength(b));
}

export function sortCardsByStrengthDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => getCardStrength(b) - getCardStrength(a));
}