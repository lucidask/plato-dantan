import { useGame37LocalMatch } from "../hooks/useGame37LocalMatch";
import TrickArea from "../components/TrickArea/TrickArea";
import InitialRevealArea from "../components/InitialRevealArea/InitialRevealArea";
import { useAutoResolveTrick } from "../hooks/useAutoResolveTrick";
import { useAutoStartRound } from "../hooks/useAutoStartRound";
import { useCallback, useRef, useState, useMemo } from "react";
import GameTable from "../components/GameTable/GameTable";
import GameStatusBar from "../components/GameStatusBar/GameStatusBar";
import DrawPile from "../components/DrawPile/DrawPile";
import { getPlayerLabel } from "../mappers/playerLabels";
import TrouverFlag from "../components/TrouverFlag/TrouverFlag";
import PlayerHand from "../components/PlayerHand/PlayerHand";
import PlayerScorePanel from "../components/PlayerScorePanel/PlayerScorePanel";
import RoundControlPanel from "../components/RoundControlPanel/RoundControlPanel";
import type { Card } from "card-core";
import WonPile from "../components/WonPile/WonPile";

const RANK_ORDER = ["7", "8", "J", "Q", "K", "A", "9", "10"] as const;

function getPlayableCardIds(hand: Card[], currentTrick: { card: Card }[]) {
  if (currentTrick.length === 0) return undefined;

  const leadCard = currentTrick[0].card;
  const cardsOfLeadSuit = hand.filter((card) => card.suit === leadCard.suit);

  if (cardsOfLeadSuit.length === 0) return undefined;

  const leadRankIndex = RANK_ORDER.indexOf(
    leadCard.rank as (typeof RANK_ORDER)[number],
  );

  const strongerCards = cardsOfLeadSuit.filter(
    (card) =>
      RANK_ORDER.indexOf(card.rank as (typeof RANK_ORDER)[number]) >
      leadRankIndex,
  );

  const legalCards = strongerCards.length > 0 ? strongerCards : cardsOfLeadSuit;

  if (legalCards.length === hand.length) return undefined;

  return legalCards.map((card) => card.id);
}

export default function Game37Screen() {
  const { state, dispatch } = useGame37LocalMatch();
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(
    null,
  );
  const highlightedTimeoutRef = useRef<number | null>(null);

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

  const playableCardIdsP1 = useMemo(() => {
    if (state.phase !== "trick_play") return undefined;
    if (state.currentPlayerId !== "player-1") return undefined;

    return getPlayableCardIds(
      state.hands["player-1"] || [],
      state.currentTrick,
    );
  }, [state.phase, state.currentPlayerId, state.hands, state.currentTrick]);

  const playableCardIdsP2 = useMemo(() => {
    if (state.phase !== "trick_play") return undefined;
    if (state.currentPlayerId !== "player-2") return undefined;

    return getPlayableCardIds(
      state.hands["player-2"] || [],
      state.currentTrick,
    );
  }, [state.phase, state.currentPlayerId, state.hands, state.currentTrick]);

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
              disabled={!canDraw}
              onDraw={() => {
                if (!canDraw || !expectedDrawPlayerId) return;

                const drawnCard = state.drawPile[0] ?? null;

                if (drawnCard) {
                  setHighlightedCardId(drawnCard.id);

                  if (highlightedTimeoutRef.current !== null) {
                    window.clearTimeout(highlightedTimeoutRef.current);
                  }

                  highlightedTimeoutRef.current = window.setTimeout(() => {
                    setHighlightedCardId(null);
                    highlightedTimeoutRef.current = null;
                  }, 1800);
                }

                dispatch({
                  type: "draw_card",
                  playerId: expectedDrawPlayerId,
                });
              }}
            />
          ) : null
        }
        topScore={
          <PlayerScorePanel
            teamId="team-2"
            score={state.scoreByTeam["team-2"] || 0}
            wonCards={state.wonCardsByOwner["team-2"] || []}
          />
        }
        bottomScore={
          <PlayerScorePanel
            teamId="team-1"
            score={state.scoreByTeam["team-1"] || 0}
            wonCards={state.wonCardsByOwner["team-1"] || []}
          />
        }
        topCard={
          <PlayerHand
            cards={state.hands["player-2"] || []}
            disabled={
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-2"
            }
            orientation="top"
            highlightedCardId={highlightedCardId}
            playableCardIds={playableCardIdsP2}
            onCardClick={handlePlayCardP2}
          />
        }
        bottomCard={
          <PlayerHand
            cards={state.hands["player-1"] || []}
            disabled={
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-1"
            }
            orientation="bottom"
            highlightedCardId={highlightedCardId}
            playableCardIds={playableCardIdsP1}
            onCardClick={handlePlayCardP1}
          />
        }
        topPile={<WonPile cards={state.wonCardsByOwner["team-2"] || []} />}
        bottomPile={<WonPile cards={state.wonCardsByOwner["team-1"] || []} />}
      />
    </div>
  );
}
