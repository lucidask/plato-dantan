import { useEffect } from "react";
import type { Card } from "card-core";
import type { Game37State } from "game-3-7";

type Point = { x: number; y: number };

type RoundScoringMotionGroup = {
  cards: Card[];
  from: Point | null;
  to: Point | null;
};

type RoundScoringMotion = {
  active: boolean;
  top: RoundScoringMotionGroup;
  bottom: RoundScoringMotionGroup;
};

type Props = {
  state: Game37State;
  centerRef: React.RefObject<HTMLDivElement | null>;
  topWonPileRef: React.RefObject<HTMLDivElement | null>;
  bottomWonPileRef: React.RefObject<HTMLDivElement | null>;
  setRoundScoringMotion: React.Dispatch<React.SetStateAction<RoundScoringMotion>>;
  registerAnimationTimeout: (callback: () => void, delay: number) => number;
};

function centerOf(rect: DOMRect): Point {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function useRoundScoringAnimation({
  state,
  centerRef,
  topWonPileRef,
  bottomWonPileRef,
  setRoundScoringMotion,
  registerAnimationTimeout,
}: Props) {
  useEffect(() => {
    if (state.phase !== "round_transition") return;

    const centerRect = centerRef.current?.getBoundingClientRect();
    const topRect = topWonPileRef.current?.getBoundingClientRect();
    const bottomRect = bottomWonPileRef.current?.getBoundingClientRect();

    if (!centerRect || !topRect || !bottomRect) return;

    const topCards = state.wonCardsByOwner["team-2"] || [];
    const bottomCards = state.wonCardsByOwner["team-1"] || [];

    if (topCards.length === 0 && bottomCards.length === 0) return;

    setRoundScoringMotion({
      active: true,
      top: {
        cards: topCards,
        from: centerOf(topRect),
        to: {
          x: centerRect.left + centerRect.width / 2,
          y: centerRect.top + centerRect.height * 0.23,
        },
      },
      bottom: {
        cards: bottomCards,
        from: centerOf(bottomRect),
        to: {
          x: centerRect.left + centerRect.width / 2,
          y: centerRect.top + centerRect.height * 0.77,
        },
      },
    });

    registerAnimationTimeout(() => {
      setRoundScoringMotion({
        active: false,
        top: { cards: [], from: null, to: null },
        bottom: { cards: [], from: null, to: null },
      });
    }, 1000);
  }, [
    state.phase,
    state.wonCardsByOwner,
    centerRef,
    topWonPileRef,
    bottomWonPileRef,
    setRoundScoringMotion,
    registerAnimationTimeout,
  ]);
}