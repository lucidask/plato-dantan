import { useGame37LocalMatch } from "../hooks/useGame37LocalMatch";
import TrickArea from "../components/TrickArea/TrickArea";
import InitialRevealArea from "../components/InitialRevealArea/InitialRevealArea";
import { useAutoResolveTrick } from "../hooks/useAutoResolveTrick";
import { useAutoStartRound } from "../hooks/useAutoStartRound";
import { useCallback } from "react";
import GameTable from "../components/GameTable/GameTable";
import GameStatusBar from "../components/GameStatusBar/GameStatusBar";
import DrawPile from "../components/DrawPile/DrawPile";
import { getPlayerLabel } from "../mappers/playerLabels";
import TrouverFlag from "../components/TrouverFlag/TrouverFlag";
import PlayerHand from "../components/PlayerHand";
import PlayerScorePanel from "../components/PlayerScorePanel/PlayerScorePanel";
import RoundControlPanel from "../components/RoundControlPanel/RoundControlPanel";
import type { Card } from "card-core";

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
    (card: Card) => {
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
    (card: Card) => {
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

  type TrouverEvent = Extract<
    (typeof state.eventQueue)[number],
    { type: "trouver" }
  >;

  const latestTrouverIndex = state.eventQueue.findLastIndex(
    (event) => event.type === "trouver",
  );

  const hasCardBeenPlayedAfterTrouver =
    latestTrouverIndex !== -1 &&
    state.eventQueue
      .slice(latestTrouverIndex + 1)
      .some((event) => event.type === "card_played");

  const latestTrouverEvent: TrouverEvent | null =
    latestTrouverIndex !== -1 &&
    !hasCardBeenPlayedAfterTrouver &&
    state.eventQueue[latestTrouverIndex].type === "trouver"
      ? state.eventQueue[latestTrouverIndex]
      : null;

  const shouldShowTableControls =
    state.phase !== "round_scoring" &&
    state.phase !== "round_transition" &&
    state.phase !== "match_end";

  return (
    <div style={{ padding: 20 }}>
      <h1>Jeu 3-7</h1>

      <GameStatusBar state={state} />

      <GameTable
        center={
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {shouldShowInitialReveal ? (
              <InitialRevealArea
                reveal={state.initialReveal}
                expectedPlayerId={expectedInitialRevealPlayerId}
                onRevealCard={handleRevealInitialCard}
              />
            ) : state.phase === "round_scoring" ||
              state.phase === "round_transition" ||
              state.phase === "match_end" ? (
              <RoundControlPanel state={state} dispatch={dispatch} />
            ) : (
              <TrickArea cards={state.currentTrick} />
            )}

            {latestTrouverEvent &&
              state.phase !== "round_scoring" &&
              state.phase !== "round_transition" &&
              state.phase !== "match_end" && (
                <TrouverFlag
                  position={
                    latestTrouverEvent.payload.playerId === "player-2"
                      ? "top"
                      : "bottom"
                  }
                />
              )}
          </div>
        }
        drawPile={
          !shouldShowInitialReveal && shouldShowTableControls ? (
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
        topInner={
          <PlayerScorePanel
            teamId="team-2"
            score={state.scoreByTeam["team-2"] || 0}
            wonCards={state.wonCardsByOwner["team-2"] || []}
          />
        }
        bottomInner={
          <PlayerScorePanel
            teamId="team-1"
            score={state.scoreByTeam["team-1"] || 0}
            wonCards={state.wonCardsByOwner["team-1"] || []}
          />
        }
        topOuter={
          <PlayerHand
            cards={state.hands["player-2"] || []}
            disabled={
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-2"
            }
            onCardClick={handlePlayCardP2}
          />
        }
        bottomOuter={
          <PlayerHand
            cards={state.hands["player-1"] || []}
            disabled={
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-1"
            }
            onCardClick={handlePlayCardP1}
          />
        }
      />
    </div>
  );
}
