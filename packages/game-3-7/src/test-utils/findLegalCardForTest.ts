import type { Card } from "../../../card-core/src";
import type { Game37State } from "../types/Game37State";
import { GAME37_RANK_ORDER } from "../constants/game37Ranks";

function isStronger(cardA: Card, cardB: Card): boolean {
  return (
    GAME37_RANK_ORDER.indexOf(cardA.rank) >
    GAME37_RANK_ORDER.indexOf(cardB.rank)
  );
}

export function findLegalCardForTest(
  state: Game37State,
  playerId: string
): Card {
  const hand = state.hands[playerId];

  if (!hand || hand.length === 0) {
    throw new Error(`No cards in hand for player ${playerId}`);
  }

  // Si le joueur commence le pli, il peut jouer n'importe quelle carte
  if (state.currentTrick.length === 0) {
    return hand[0];
  }

  const leadCard = state.currentTrick[0].card;
  const sameSuitCards = hand.filter((card) => card.suit === leadCard.suit);

  if (sameSuitCards.length === 0) {
    return hand[0];
  }

  const strongerCards = sameSuitCards.filter((card) =>
    isStronger(card, leadCard)
  );

  if (strongerCards.length > 0) {
    return strongerCards[0];
  }

  return sameSuitCards[0];
}