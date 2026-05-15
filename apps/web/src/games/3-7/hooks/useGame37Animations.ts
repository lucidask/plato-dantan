import { useCallback, useEffect, useRef, useState } from "react";
import type { Card } from "card-core";

type Point = { x: number; y: number };

type Game37AnimationRefs = {
  centerRef: React.RefObject<HTMLDivElement | null>;
  topWonPileRef: React.RefObject<HTMLDivElement | null>;
  bottomWonPileRef: React.RefObject<HTMLDivElement | null>;
  topHandRef: React.RefObject<HTMLDivElement | null>;
  bottomHandRef: React.RefObject<HTMLDivElement | null>;
  drawPileRef: React.RefObject<HTMLDivElement | null>;
  initialRevealCenterRef: React.RefObject<HTMLDivElement | null>;
};

export function useGame37Animations() {
  const animationTimeoutsRef = useRef<number[]>([]);

  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const [isDealing, setIsDealing] = useState(false);

  const [dealingVisibleCount, setDealingVisibleCount] = useState({
    "player-1": 0,
    "player-2": 0,
  });

  const [cardMotion, setCardMotion] = useState<{
    active: boolean;
    card: Card | null;
    from: Point | null;
    to: Point | null;
  }>({
    active: false,
    card: null,
    from: null,
    to: null,
  });

  const [drawMotion, setDrawMotion] = useState<{
    active: boolean;
    from: Point | null;
    to: Point | null;
  }>({
    active: false,
    from: null,
    to: null,
  });

  const [dealMotions, setDealMotions] = useState<
    {
      id: string;
      from: Point;
      to: Point;
    }[]
  >([]);

  const [trickCollectMotion, setTrickCollectMotion] = useState<{
    active: boolean;
    cards: Card[];
    winnerTeamId: string | null;
    to: Point | null;
  }>({
    active: false,
    cards: [],
    winnerTeamId: null,
    to: null,
  });

  const [initialRevealMotion, setInitialRevealMotion] = useState<{
    active: boolean;
    card: Card | null;
    from: Point | null;
    to: Point | null;
  }>({
    active: false,
    card: null,
    from: null,
    to: null,
  });

  const [roundScoringMotion, setRoundScoringMotion] = useState<{
    active: boolean;
    top: {
      cards: Card[];
      from: Point | null;
      to: Point | null;
    };
    bottom: {
      cards: Card[];
      from: Point | null;
      to: Point | null;
    };
  }>({
    active: false,
    top: { cards: [], from: null, to: null },
    bottom: { cards: [], from: null, to: null },
  });

  const registerAnimationTimeout = useCallback(
    (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        animationTimeoutsRef.current = animationTimeoutsRef.current.filter(
          (id) => id !== timeoutId,
        );

        callback();
      }, delay);

      animationTimeoutsRef.current.push(timeoutId);

      return timeoutId;
    },
    [],
  );

  const cancelAnimations = useCallback(() => {
    animationTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });

    animationTimeoutsRef.current = [];

    setIsDealing(false);
    setHiddenCardId(null);

    setCardMotion({
      active: false,
      card: null,
      from: null,
      to: null,
    });

    setDrawMotion({
      active: false,
      from: null,
      to: null,
    });

    setDealMotions([]);

    setTrickCollectMotion({
      active: false,
      cards: [],
      winnerTeamId: null,
      to: null,
    });

    setInitialRevealMotion({
      active: false,
      card: null,
      from: null,
      to: null,
    });

    setRoundScoringMotion({
      active: false,
      top: { cards: [], from: null, to: null },
      bottom: { cards: [], from: null, to: null },
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", cancelAnimations);

    return () => {
      window.removeEventListener("resize", cancelAnimations);
    };
  }, [cancelAnimations]);

  return {
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

    initialRevealMotion,
    setInitialRevealMotion,

    registerAnimationTimeout,
    cancelAnimations,
    roundScoringMotion,
    setRoundScoringMotion,
  };
}