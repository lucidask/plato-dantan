import type { Game37BotActionDecision } from "../types";
import type { Game37State } from "../../types/Game37State";

import { analyzePlayableCards } from "../analyzePlayableCards";

export function normalBotPlay(
  state: Game37State,
  playerId: string
): Game37BotActionDecision {
  if (state.phase === "draw_phase" && state.drawContext) {
    const expectedPlayerId =
      state.drawContext.expectedOrder[state.drawContext.currentIndex];

    if (expectedPlayerId === playerId) {
      return {
        type: "draw_card",
        playerId,
        reason: "normal_bot_draw",
      };
    }

    return {
      type: "wait",
      playerId,
      reason: "waiting_draw_order",
    };
  }

  if (state.phase === "trick_play") {
    const analysis = analyzePlayableCards(state, playerId);

    if (analysis.playableCards.length === 0) {
      return {
        type: "wait",
        playerId,
        reason: "no_playable_card",
      };
    }

    const randomIndex = Math.floor(Math.random() * analysis.playableCards.length);
    const selectedCard = analysis.playableCards[randomIndex];

    return {
      type: "play_card",
      playerId,
      card: selectedCard,
      reason: "normal_bot_random_legal_card",
    };
  }

  return {
    type: "wait",
    playerId,
    reason: "unsupported_phase",
  };
}