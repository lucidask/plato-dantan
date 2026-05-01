import { useEffect, useRef } from "react";
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
  const lastResolvedTrickRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (state.phase !== "trick_resolution") return;

    const trickKey = state.currentTrick
      .map((playedCard) => `${playedCard.playerId}:${playedCard.card.id}`)
      .join("|");

    if (!trickKey) return;
    if (lastResolvedTrickRef.current === trickKey) return;

    const timer = window.setTimeout(() => {
      lastResolvedTrickRef.current = trickKey;
      dispatch({ type: "resolve_trick" });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [state.phase, state.currentTrick, dispatch, enabled, delayMs]);
}