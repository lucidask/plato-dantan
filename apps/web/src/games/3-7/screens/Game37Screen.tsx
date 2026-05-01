import { useGame37LocalMatch } from "../hooks/useGame37LocalMatch";
import PlayerHand from "../components/PlayerHand";
import TrickArea from "../components/TrickArea";
import InitialRevealArea from "../components/InitialRevealArea";
import ScoreBoard from "../components/ScoreBoard";
import RoundPointsPreview from "../components/RoundPointsPreview";
import ActionPanel from "../components/ActionPanel";
import { useAutoResolveTrick } from "../hooks/useAutoResolveTrick";
import { useAutoStartRound } from "../hooks/useAutoStartRound";
import { useCallback } from "react";
import GameTable from "../components/GameTable/GameTable";

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

  const handlePlayCardP1 = useCallback(
    (card) => {
      if (state.phase !== "trick_play") return;
      if (state.currentPlayerId !== "player-1") return;

      dispatch({
        type: "play_card",
        playerId: "player-1",
        payload: { cardId: card.id },
      });
    },
    [state.phase, state.currentPlayerId, dispatch],
  );

  const handlePlayCardP2 = useCallback(
    (card) => {
      if (state.phase !== "trick_play") return;
      if (state.currentPlayerId !== "player-2") return;

      dispatch({
        type: "play_card",
        playerId: "player-2",
        payload: { cardId: card.id },
      });
    },
    [state.phase, state.currentPlayerId, dispatch],
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Jeu 3-7</h1>

      <h2>Phase: {state.phase}</h2>
      <h3>Joueur courant: {state.currentPlayerId ?? "aucun"}</h3>

      <h3>Révélation initiale:</h3>
      <InitialRevealArea reveal={state.initialReveal} />

      <h3>Premier joueur: {state.firstRoundStarterId ?? "non déterminé"}</h3>

      <GameTable
        top={
          <PlayerHand
            title="Joueur 2"
            cards={state.hands["player-2"] || []}
            disabled={
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-2"
            }
            onCardClick={handlePlayCardP2}
          />
        }
        center={<TrickArea cards={state.currentTrick} />}
        bottom={
          <PlayerHand
            title="Joueur 1"
            cards={state.hands["player-1"] || []}
            disabled={
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-1"
            }
            onCardClick={handlePlayCardP1}
          />
        }
        sidebar={
          <>
            <ScoreBoard scores={state.scoreByTeam} />
            <RoundPointsPreview wonCardsByOwner={state.wonCardsByOwner} />
            <ActionPanel state={state} dispatch={dispatch} />
            <h3>Pioche: {state.drawPile.length}</h3>
          </>
        }
      />
    </div>
  );
}
