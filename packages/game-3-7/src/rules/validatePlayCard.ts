import type { Card } from "../../../card-core/src";
import type { PlayCardAction } from "../types/Game37Action";
import type { Game37State } from "../types/Game37State";
import { GAME37_RANK_ORDER } from "../constants/game37Ranks";

export type MoveValidationResult =
  | { valid: true }
  | {
      valid: false;
      reason:
        | "invalid_phase"
        | "not_player_turn"
        | "card_not_in_hand"
        | "must_follow_suit"
        | "must_play_stronger_card";
    };

function isStronger(cardA: Card, cardB: Card): boolean {
  return (
    GAME37_RANK_ORDER.indexOf(cardA.rank) >
    GAME37_RANK_ORDER.indexOf(cardB.rank)
  );
}

export function validatePlayCard(
  state: Game37State,
  action: PlayCardAction
): MoveValidationResult {
  if (state.phase !== "trick_play") {
    return { valid: false, reason: "invalid_phase" };
  }

  if (state.currentPlayerId !== action.playerId) {
    return { valid: false, reason: "not_player_turn" };
  }

  const hand = state.hands[action.playerId] ?? [];
  const cardToPlay = hand.find((card) => card.id === action.payload.cardId);

  if (!cardToPlay) {
    return { valid: false, reason: "card_not_in_hand" };
  }

  // Première carte du pli : tout est légal
  if (state.currentTrick.length === 0) {
    return { valid: true };
  }

  const leadCard = state.currentTrick[0].card;
  const leadSuit = leadCard.suit;

  const cardsOfLeadSuit = hand.filter((card) => card.suit === leadSuit);

  // Si le joueur a la couleur demandée, il doit la jouer
  if (cardsOfLeadSuit.length > 0 && cardToPlay.suit !== leadSuit) {
    return { valid: false, reason: "must_follow_suit" };
  }

  const strongerCards = cardsOfLeadSuit.filter((card) =>
    isStronger(card, leadCard)
  );

  // Si le joueur a une carte plus forte dans la couleur demandée,
  // il doit jouer une carte plus forte.
  if (
    strongerCards.length > 0 &&
    (cardToPlay.suit !== leadSuit || !isStronger(cardToPlay, leadCard))
  ) {
    return { valid: false, reason: "must_play_stronger_card" };
  }

  return { valid: true };
}