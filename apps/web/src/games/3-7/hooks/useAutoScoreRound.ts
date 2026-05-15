import { useEffect } from "react";
import type { Game37Action, Game37State } from "game-3-7";

type Params = {
  state: Game37State;
  dispatch: (action: Game37Action) => void;
  enabled?: boolean;
  delayMs?: number;
};

export function useAutoScoreRound({
  state,
  dispatch,
  enabled = true,
  delayMs = 500,
}: Params) {
  useEffect(() => {
    if (!enabled) return;
    if (state.phase !== "round_scoring") return;

    const timer = window.setTimeout(() => {
      dispatch({ type: "score_round" });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [state.phase, dispatch, enabled, delayMs]);
}