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

    default:
      return state;
  }
}