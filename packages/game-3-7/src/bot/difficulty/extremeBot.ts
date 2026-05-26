import type { Game37BotActionDecision } from "../types";

import type { Game37State } from "../../types/Game37State";

import { analyzePlayableCards } from "../analyzePlayableCards";

export function extremeBotPlay(
  state: Game37State,
  playerId: string
): Game37BotActionDecision {
  // Gestion pioche
  if (
    state.phase === "draw_phase" &&
    state.drawContext
  ) {
    const expectedPlayerId =
      state.drawContext.expectedOrder[
        state.drawContext.currentIndex
      ];

    if (expectedPlayerId === playerId) {
      return {
        type: "draw_card",
        playerId,
        reason: "extreme_bot_draw",
      };
    }

    return {
      type: "wait",
      playerId,
      reason: "waiting_draw_order",
    };
  }

  // Gestion jeu des cartes
  if (state.phase === "trick_play") {
    const analysis = analyzePlayableCards(
      state,
      playerId
    );

    // Aucune carte possible
    if (!analysis.weakestCard) {
      return {
        type: "wait",
        playerId,
        reason: "no_playable_card",
      };
    }

    // Bot extrême :
    // joue simplement la carte la plus faible légale.
    return {
      type: "play_card",
      playerId,
      card: analysis.weakestCard,
      reason: "extreme_bot_weakest_card",
    };
  }

  return {
    type: "wait",
    playerId,
    reason: "unsupported_phase",
  };
}