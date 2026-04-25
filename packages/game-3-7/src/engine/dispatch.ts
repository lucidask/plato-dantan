import type { Game37Action } from "../types/Game37Action";
import type { Game37State } from "../types/Game37State";
import { handleRevealInitialCard } from "./initialReveal";
import { playCard } from "./playCard";
import { drawCard } from "./drawCard";

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

    default:
      return state;
  }
}