import type { Game37State } from "../types/Game37State";
import type { Game37Action } from "../types/Game37Action";

import { chooseBotAction } from "../bot";

import { dispatchGame37Action } from "../engine/dispatch";

export function runBotMatch(
  initialState: Game37State,
  maxIterations = 10000
): Game37State {
  let state = initialState;

  let iteration = 0;

  while (
    state.phase !== "match_end" &&
    iteration < maxIterations
  ) {
    iteration++;


    if (state.phase === "round_setup") {
      console.log("AUTO ACTION: start_round");

      state = dispatchGame37Action(state, {
        type: "start_round",
      });

      continue;
    }
    if (state.phase === "trick_resolution") {
      state = dispatchGame37Action(state, {
        type: "resolve_trick",
      });

      continue;
    }

    if (state.phase === "round_scoring") {
      console.log("AUTO ACTION: score_round");

      state = dispatchGame37Action(state, {
        type: "score_round",
      });

      continue;
    }

    if (state.phase === "round_transition") {
      console.log("AUTO ACTION: next_round");

      state = dispatchGame37Action(state, {
        type: "next_round",
      });

      continue;
    }

    const currentPlayerId =
      state.currentPlayerId;

    if (!currentPlayerId) {
      break;
    }

    const player = state.players.find(
      (entry) => entry.id === currentPlayerId
    );

    if (!player) {
      break;
    }

    // Si joueur humain :
    // on arrête la simulation.
    if (!player.isBot) {
      break;
    }

    const decision = chooseBotAction(
      state,
      currentPlayerId
    );

    let action: Game37Action | null = null;

    if (decision.type === "play_card") {
      action = {
        type: "play_card",
        playerId: currentPlayerId,
        payload: {
          cardId: decision.card.id,
        },
      };
    }

    if (decision.type === "draw_card") {
      action = {
        type: "draw_card",
        playerId: currentPlayerId,
      };
    }

    if (!action) {
      break;
    }

    state = dispatchGame37Action(state, action);
  }

  return state;
}