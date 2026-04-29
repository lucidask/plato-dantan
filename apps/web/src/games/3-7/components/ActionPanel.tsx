import type { Game37State, Game37Action } from "game-3-7";

type ActionPanelProps = {
  state: Game37State;
  dispatch: (action: Game37Action) => void;
};

export default function ActionPanel({ state, dispatch }: ActionPanelProps) {
  return (
    <div style={{ marginTop: 20 }}>
      {/* Révélation initiale */}
      {state.phase === "initial_card_reveal" && (
        <>
          <button
            onClick={() =>
              dispatch({
                type: "reveal_initial_card",
                playerId: "player-1",
              })
            }
          >
            Joueur 1 lève une carte
          </button>

          <button
            onClick={() =>
              dispatch({
                type: "reveal_initial_card",
                playerId: "player-2",
              })
            }
            style={{ marginLeft: 10 }}
          >
            Joueur 2 lève une carte
          </button>
        </>
      )}

      {/* Pioche */}
      {state.phase === "draw_phase" && (
        <button
          onClick={() =>
            dispatch({
              type: "draw_card",
              playerId: state.currentPlayerId!,
            })
          }
        >
          Piocher ({state.currentPlayerId})
        </button>
      )}

      {/* Score */}
      {state.phase === "round_scoring" && (
        <button onClick={() => dispatch({ type: "score_round" })}>
          Calculer le score
        </button>
      )}

      {/* Manche suivante */}
      {state.phase === "round_transition" && (
        <button onClick={() => dispatch({ type: "next_round" })}>
          Manche suivante
        </button>
      )}
    </div>
  );
}