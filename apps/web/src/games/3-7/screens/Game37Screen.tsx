import { useGame37LocalMatch } from "../hooks/useGame37LocalMatch";
import { useAutoResolveTrick } from "../hooks/useAutoResolveTrick";
import { useAutoStartRound } from "../hooks/useAutoStartRound";
import { useRef, useState, useMemo } from "react";
import GameStatusBar from "../components/GameStatusBar/GameStatusBar";
import CardMotionLayer from "../components/CardMotionLayer/CardMotionLayer";
import { getPlayableCardIds } from "../utils/getPlayableCardIds";
import { getVisibleWonCards } from "../utils/getVisibleWonCards";
import { getLatestVisibleTrouverEvent } from "../utils/getLatestTrouverEvent";
import { useGame37Animations } from "../hooks/useGame37Animations";
import { usePlayCardAnimation } from "../hooks/usePlayCardAnimation";
import { useInitialRevealAnimation } from "../hooks/useInitialRevealAnimation";
import { useDrawCardAnimation } from "../hooks/useDrawCardAnimation";
import { useDealAnimation } from "../hooks/useDealAnimation";
import { useTrickCollectAnimation } from "../hooks/useTrickCollectAnimation";
import Game37TableView from "../components/Game37TableView/Game37TableView";
import Game37DebugPanel from "../debug/Game37DebugPanel";
import { useRoundScoringAnimation } from "../hooks/useRoundScoringAnimation";

export default function Game37Screen() {
  const { state, dispatch } = useGame37LocalMatch();
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(
    null,
  );
  const highlightedTimeoutRef = useRef<number | null>(null);
  const topWonPileRef = useRef<HTMLDivElement | null>(null);
  const bottomWonPileRef = useRef<HTMLDivElement | null>(null);
  const topHandRef = useRef<HTMLDivElement | null>(null);
  const bottomHandRef = useRef<HTMLDivElement | null>(null);
  const drawPileRef = useRef<HTMLDivElement | null>(null);
  const initialRevealCenterRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);

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

  const initialRevealEntries = Object.entries(state.initialReveal);

  const expectedInitialRevealPlayerId =
    state.phase === "initial_card_reveal"
      ? (initialRevealEntries.find(([, card]) => card === null)?.[0] ?? null)
      : null;

  const shouldShowInitialReveal =
    state.phase === "initial_card_reveal" || state.phase === "round_setup";

  const latestTrouverEvent = getLatestVisibleTrouverEvent(state.eventQueue);

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

  const {
    hiddenCardId,
    setHiddenCardId,
    isDealing,
    setIsDealing,
    dealingVisibleCount,
    setDealingVisibleCount,
    cardMotion,
    setCardMotion,
    drawMotion,
    setDrawMotion,
    dealMotions,
    setDealMotions,
    trickCollectMotion,
    setTrickCollectMotion,
    roundScoringMotion,
    setRoundScoringMotion,
    initialRevealMotion,
    setInitialRevealMotion,
    registerAnimationTimeout,
  } = useGame37Animations();

  const { handlePlayCard } = usePlayCardAnimation({
    state,
    dispatch,
    centerRef,
    cardMotion,
    setCardMotion,
    setHiddenCardId,
    registerAnimationTimeout,
  });
  const { handleRevealInitialCard } = useInitialRevealAnimation({
    state,
    dispatch,
    initialRevealCenterRef,
    setInitialRevealMotion,
    registerAnimationTimeout,
  });
  const { handleDrawCard } = useDrawCardAnimation({
    state,
    dispatch,
    canDraw,
    expectedDrawPlayerId,
    topHandRef,
    bottomHandRef,
    drawMotion,
    setDrawMotion,
    setHighlightedCardId,
    highlightedTimeoutRef,
    registerAnimationTimeout,
  });

  useDealAnimation({
    state,
    drawPileRef,
    topHandRef,
    bottomHandRef,
    setIsDealing,
    setDealingVisibleCount,
    setDealMotions,
    registerAnimationTimeout,
  });

  useTrickCollectAnimation({
    state,
    topWonPileRef,
    bottomWonPileRef,
    setTrickCollectMotion,
    registerAnimationTimeout,
  });

  useRoundScoringAnimation({
    state,
    centerRef,
    topWonPileRef,
    bottomWonPileRef,
    setRoundScoringMotion,
    registerAnimationTimeout,
  });

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

  const visibleDrawPileCount = isDealing
    ? 32 - dealingVisibleCount["player-1"] - dealingVisibleCount["player-2"]
    : state.drawPile.length;

  const getVisibleWonCardsForTeam = (teamId: string) =>
    getVisibleWonCards(state.wonCardsByOwner, teamId, trickCollectMotion);

  return (
    <div style={{ padding: 20 }}>
      <h1>Jeu 3-7</h1>

      <GameStatusBar state={state} />

      <Game37TableView
        state={state}
        dispatch={dispatch}
        centerRef={centerRef}
        initialRevealCenterRef={initialRevealCenterRef}
        drawPileRef={drawPileRef}
        topHandRef={topHandRef}
        bottomHandRef={bottomHandRef}
        topWonPileRef={topWonPileRef}
        bottomWonPileRef={bottomWonPileRef}
        shouldShowInitialReveal={shouldShowInitialReveal}
        shouldShowTableControls={shouldShowTableControls}
        expectedInitialRevealPlayerId={expectedInitialRevealPlayerId}
        latestTrouverEvent={latestTrouverEvent}
        visibleDrawPileCount={visibleDrawPileCount}
        expectedDrawPlayerId={expectedDrawPlayerId}
        canDraw={canDraw}
        handleRevealInitialCard={handleRevealInitialCard}
        handleDrawCard={handleDrawCard}
        handlePlayCard={handlePlayCard}
        highlightedCardId={highlightedCardId}
        playableCardIdsP1={playableCardIdsP1}
        playableCardIdsP2={playableCardIdsP2}
        hiddenCardId={hiddenCardId}
        isDealing={isDealing}
        dealingVisibleCount={dealingVisibleCount}
        trickCollectMotion={trickCollectMotion}
        getVisibleWonCards={getVisibleWonCardsForTeam}
        roundScoringMotion={roundScoringMotion}
      />

      <CardMotionLayer
        active={cardMotion.active}
        card={cardMotion.card}
        from={cardMotion.from}
        to={cardMotion.to}
        trickCollect={trickCollectMotion}
        drawMotion={drawMotion}
        dealMotions={dealMotions}
        initialRevealMotion={initialRevealMotion}
        roundScoringMotion={roundScoringMotion}
      />
      {import.meta.env.DEV && (
        <Game37DebugPanel state={state} dispatch={dispatch} />
      )}
    </div>
  );
}
