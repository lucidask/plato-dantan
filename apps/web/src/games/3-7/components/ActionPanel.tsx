import type { Game37State, Game37Action } from "game-3-7";

type ActionPanelProps = {
  state: Game37State;
  dispatch: (action: Game37Action) => void;
};

export default function ActionPanel({ state, dispatch }: ActionPanelProps) {
  const expectedDrawPlayerId =
    state.drawContext?.expectedOrder[state.drawContext.currentIndex] ??
    state.currentPlayerId;

  return (
    <div style={{ marginTop: 20 }}>
      {state.phase === "initial_card_reveal" && (
        <>
          <button
            disabled={state.initialReveal["player-1"] !== null}
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
            disabled={state.initialReveal["player-2"] !== null}
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

      {state.phase === "draw_phase" && expectedDrawPlayerId && (
        <button
          onClick={() =>
            dispatch({
              type: "draw_card",
              playerId: expectedDrawPlayerId,
            })
          }
        >
          Piocher ({expectedDrawPlayerId})
        </button>
      )}

      {state.phase === "round_scoring" && (
        <button onClick={() => dispatch({ type: "score_round" })}>
          Calculer le score
        </button>
      )}

      {state.phase === "round_transition" && (
        <button onClick={() => dispatch({ type: "next_round" })}>
          Manche suivante
        </button>
      )}
    </div>
  );
}