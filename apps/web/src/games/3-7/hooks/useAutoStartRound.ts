import { useEffect, useRef } from "react";
import type { Game37Action, Game37State } from "game-3-7";

type UseAutoStartRoundParams = {
  state: Game37State;
  dispatch: (action: Game37Action) => void;
  enabled?: boolean;
  delayMs?: number;
};

export function useAutoStartRound({
  state,
  dispatch,
  enabled = false,
  delayMs = 1200,
}: UseAutoStartRoundParams) {
  const lastStartedRoundRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (state.phase !== "round_setup") return;

    if (lastStartedRoundRef.current === state.roundNumber) return;

    const allPlayersRevealed = Object.values(state.initialReveal).every(
      (card) => card !== null
    );

    if (!allPlayersRevealed) return;

    const timer = window.setTimeout(() => {
      lastStartedRoundRef.current = state.roundNumber;
      dispatch({ type: "start_round" });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [
    state.phase,
    state.roundNumber,
    state.initialReveal,
    dispatch,
    enabled,
    delayMs,
  ]);
}