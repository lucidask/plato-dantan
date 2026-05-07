import { useGame37LocalMatch } from "../hooks/useGame37LocalMatch";
import PlayerHand from "../components/PlayerHand";
import TrickArea from "../components/TrickArea/TrickArea";
import InitialRevealArea from "../components/InitialRevealArea/InitialRevealArea";
import ScoreBoard from "../components/ScoreBoard";
import RoundPointsPreview from "../components/RoundPointsPreview";
import { useAutoResolveTrick } from "../hooks/useAutoResolveTrick";
import { useAutoStartRound } from "../hooks/useAutoStartRound";
import { useCallback } from "react";
import GameTable from "../components/GameTable/GameTable";
import GameStatusBar from "../components/GameStatusBar/GameStatusBar";
import DrawPile from "../components/DrawPile/DrawPile";
import { getPlayerLabel } from "../mappers/playerLabels";
import TrouverBanner from "../components/TrouverBanner/TrouverBanner";

export default function Game37Screen() {
  const { state, dispatch } = useGame37LocalMatch();

  useAutoResolveTrick({
    state,
    dispatch,
    enabled: true,
    delayMs: 2000,
  });

  useAutoStartRound({
    state,
    dispatch,
    enabled: true,
    delayMs: 3000,
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

  const expectedDrawPlayerId =
    state.phase === "draw_phase"
      ? (state.drawContext?.expectedOrder[state.drawContext.currentIndex] ??
        state.currentPlayerId)
      : null;

  const canDraw =
    state.phase === "draw_phase" &&
    expectedDrawPlayerId !== null &&
    expectedDrawPlayerId !== undefined &&
    state.drawPile.length > 0;

  const handleRevealInitialCard = useCallback(
    (playerId: string) => {
      if (state.phase !== "initial_card_reveal") return;
      if (state.initialReveal[playerId] !== null) return;

      dispatch({
        type: "reveal_initial_card",
        playerId,
      });
    },
    [state.phase, state.initialReveal, dispatch],
  );

  const initialRevealEntries = Object.entries(state.initialReveal);

  const expectedInitialRevealPlayerId =
    state.phase === "initial_card_reveal"
      ? (initialRevealEntries.find(([, card]) => card === null)?.[0] ?? null)
      : null;

  const shouldShowInitialReveal =
    state.phase === "initial_card_reveal" || state.phase === "round_setup";

  const latestTrouverEvent = state.eventQueue
    .filter((event) => event.type === "trouver")
    .slice(-1)[0];

  return (
    <div style={{ padding: 20 }}>
      <h1>Jeu 3-7</h1>

      <GameStatusBar state={state} />

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
        center={
          <div style={{ position: "relative", width: "100%" }}>
            {shouldShowInitialReveal ? (
              <InitialRevealArea
                reveal={state.initialReveal}
                expectedPlayerId={expectedInitialRevealPlayerId}
                onRevealCard={handleRevealInitialCard}
              />
            ) : (
              <TrickArea cards={state.currentTrick} />
            )}

            {latestTrouverEvent && (
              <TrouverBanner playerId={latestTrouverEvent.payload.playerId} />
            )}
          </div>
        }
        tableRight={
          !shouldShowInitialReveal ? (
            <DrawPile
              count={state.drawPile.length}
              expectedPlayerLabel={
                expectedDrawPlayerId
                  ? getPlayerLabel(expectedDrawPlayerId)
                  : undefined
              }
              expectedPlayerPosition={
                expectedDrawPlayerId === "player-2" ? "top" : "bottom"
              }
              disabled={!canDraw}
              onDraw={() => {
                if (!canDraw || !expectedDrawPlayerId) return;

                dispatch({
                  type: "draw_card",
                  playerId: expectedDrawPlayerId,
                });
              }}
            />
          ) : null
        }
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
          </>
        }
      />
    </div>
  );
}
