import type { Game37State } from "../../../../../../packages/game-3-7/src";
import type { Game37Action } from "../../../../../../packages/game-3-7/src";

type Props = {
  state: Game37State;
  dispatch: (action: Game37Action) => void;
};

export default function Game37DebugPanel({ state, dispatch }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <strong>Debug 3-7</strong>

      <button onClick={() => dispatch({ type: "debug_force_round_scoring" })}>
        Forcer fin de manche
      </button>

      <button
        onClick={() =>
          dispatch({
            type: "debug_simulate_completed_round",
          })
        }
      >
        Simuler manche complète
      </button>

      <small>Phase: {state.phase}</small>
    </div>
  );
}
