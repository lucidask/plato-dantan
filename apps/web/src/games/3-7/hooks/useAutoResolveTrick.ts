import { useEffect } from "react";
import type { Game37Action, Game37State } from "game-3-7";

type UseAutoResolveTrickParams = {
  state: Game37State;
  dispatch: (action: Game37Action) => void;
  enabled?: boolean;
  delayMs?: number;
};

export function useAutoResolveTrick({
  state,
  dispatch,
  enabled = false,
  delayMs = 900,
}: UseAutoResolveTrickParams) {
  useEffect(() => {
    if (!enabled) return;
    if (state.phase !== "trick_resolution") return;

    const timer = window.setTimeout(() => {
      dispatch({ type: "resolve_trick" });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [state.phase, dispatch, enabled, delayMs]);
}