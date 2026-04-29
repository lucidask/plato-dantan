import { useGame37LocalMatch } from "../hooks/useGame37LocalMatch";
import PlayerHand from "../components/PlayerHand";
import TrickArea from "../components/TrickArea";
import InitialRevealArea from "../components/InitialRevealArea";
import ScoreBoard from "../components/ScoreBoard";
import RoundPointsPreview from "../components/RoundPointsPreview";
import ActionPanel from "../components/ActionPanel";
import { useAutoResolveTrick } from "../hooks/useAutoResolveTrick";
import { useAutoStartRound } from "../hooks/useAutoStartRound";

export default function Game37Screen() {
  const { state, dispatch } = useGame37LocalMatch();

  useAutoResolveTrick({
    state,
    dispatch,
    enabled: true,
    delayMs: 1200,
  });

  useAutoStartRound({
    state,
    dispatch,
    enabled: true,
    delayMs: 1200,
  });


  return (
    <div style={{ padding: 20 }}>
      <h1>Jeu 3-7</h1>

      <ScoreBoard scores={state.scoreByTeam} />
      <RoundPointsPreview wonCardsByOwner={state.wonCardsByOwner} />

      <h2>Phase: {state.phase}</h2>
      <h3>Joueur courant: {state.currentPlayerId ?? "aucun"}</h3>
      <ActionPanel state={state} dispatch={dispatch} />

      <h3>Révélation initiale:</h3>
      <InitialRevealArea reveal={state.initialReveal} />

      <h3>Premier joueur: {state.firstRoundStarterId ?? "non déterminé"}</h3>

      <TrickArea cards={state.currentTrick} />

      {state.phase === "trick_resolution" && (
        <div style={{ marginTop: 20 }}>
          <h3>Résolution du pli</h3>
        </div>
      )}

      {state.phase === "draw_phase" && (
        <div style={{ marginTop: 20 }}>
          <h3>Phase de pioche</h3>
        </div>
      )}

      {state.eventQueue
        .filter((e) => e.type === "trick_won")
        .slice(-1)
        .map((event, index) => (
          <div key={index} style={{ marginTop: 10 }}>
            <strong>
              Gagnant du pli : {event.payload.winnerPlayerId} (
              {event.payload.winningCard.shortLabel})
            </strong>
          </div>
        ))}

      {state.phase === "round_scoring" && (
        <div style={{ marginTop: 20 }}>
          <h3>Fin de manche</h3>
        </div>
      )}

      <h2>Mains</h2>

      <PlayerHand
        title="Joueur 1"
        cards={state.hands["player-1"] || []}
        disabled={state.currentPlayerId !== "player-1"}
        onCardClick={(card) =>
          dispatch({
            type: "play_card",
            playerId: "player-1",
            payload: {
              cardId: card.id,
            },
          })
        }
      />

      <PlayerHand
        title="Joueur 2"
        cards={state.hands["player-2"] || []}
        disabled={state.currentPlayerId !== "player-2"}
        onCardClick={(card) =>
          dispatch({
            type: "play_card",
            playerId: "player-2",
            payload: {
              cardId: card.id,
            },
          })
        }
      />
      <h3>Pioche: {state.drawPile.length}</h3>
    </div>
  );
}
