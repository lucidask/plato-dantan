import type { Game37Action } from "../types/Game37Action";
import type { Game37State } from "../types/Game37State";
import { handleRevealInitialCard } from "./initialReveal";
import { playCard } from "./playCard";
import { drawCard } from "./drawCard";
import { resolveTrick } from "./resolveTrick";
import { setupRound } from "./setupRound";
import { scoreRound } from "../scoring/scoreRound";
import { nextRound } from "./nextRound";

export function dispatchGame37Action(
  state: Game37State,
  action: Game37Action
): Game37State {
  switch (action.type) {
    case "reveal_initial_card":
      return handleRevealInitialCard(state, action.playerId);

    case "play_card":
      return playCard(state, action);

    case "draw_card":
      return drawCard(state, action);

    case "start_match":
      return state;

    case "resolve_trick":
      return resolveTrick(state);

    case "start_round":
      return setupRound(state);

    case "score_round":
      return scoreRound(state);

    case "next_round":
      return nextRound(state);

    case "debug_force_round_scoring": {
      state.phase = "round_transition";
      state.currentPlayerId = null;
      state.currentTrick = [];
      state.drawContext = null;
      return state;
    }

    case "debug_simulate_completed_round": {
      const allCards = [
        ...state.drawPile,
        ...Object.values(state.hands).flat(),
        ...state.currentTrick.map((played) => played.card),
      ];

      const shuffled = [...allCards].sort(() => Math.random() - 0.5);

      const splitIndex = Math.floor(Math.random() * shuffled.length);

      const team1Cards = shuffled.slice(0, splitIndex);
      const team2Cards = shuffled.slice(splitIndex);

      state.wonCardsByOwner = {
        "team-1": team1Cards,
        "team-2": team2Cards,
      };

      state.drawPile = [];
      state.hands = {
        "player-1": [],
        "player-2": [],
      };
      state.currentTrick = [];
      state.drawContext = null;
      state.currentPlayerId = null;

      state.phase = "round_scoring";

      return scoreRound(state);
    }

    default:
      return state;
  }
}