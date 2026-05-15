import { useEffect, useRef } from "react";
import type { Card } from "card-core";

type TrickCollectMotion = {
  active: boolean;
  cards: Card[];
  winnerTeamId: string | null;
  to: { x: number; y: number } | null;
};

type Params = {
  state: any;

  topWonPileRef: React.RefObject<HTMLDivElement | null>;
  bottomWonPileRef: React.RefObject<HTMLDivElement | null>;

  setTrickCollectMotion: React.Dispatch<
    React.SetStateAction<TrickCollectMotion>
  >;

  registerAnimationTimeout: (
    callback: () => void,
    delay: number,
  ) => number;
};

export function useTrickCollectAnimation({
  state,
  topWonPileRef,
  bottomWonPileRef,
  setTrickCollectMotion,
  registerAnimationTimeout,
}: Params) {
  const lastAnimatedTrickSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    const latestTrickWonEvent = [...state.eventQueue]
      .reverse()
      .find((event) => event.type === "trick_won");

    if (!latestTrickWonEvent || latestTrickWonEvent.type !== "trick_won") {
      return;
    }

    const trickSignature = [
      state.roundNumber,
      latestTrickWonEvent.payload.winnerTeamId,
      ...latestTrickWonEvent.payload.playedCards.map(
  (entry: { card: Card }) => entry.card.id,
)
    ].join("|");

    if (lastAnimatedTrickSignatureRef.current === trickSignature) return;

    lastAnimatedTrickSignatureRef.current = trickSignature;

    const targetRef =
      latestTrickWonEvent.payload.winnerTeamId === "team-2"
        ? topWonPileRef
        : bottomWonPileRef;

    const targetRect = targetRef.current?.getBoundingClientRect();

    const targetPoint = targetRect
      ? {
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2,
        }
      : null;

    setTrickCollectMotion({
      active: true,
      cards: latestTrickWonEvent.payload.playedCards.map((entry: { card: Card }) => entry.card),
      winnerTeamId: latestTrickWonEvent.payload.winnerTeamId,
      to: targetPoint,
    });

    registerAnimationTimeout(() => {
      setTrickCollectMotion({
        active: false,
        cards: [],
        winnerTeamId: null,
        to: null,
      });
    }, 700);
  }, [state.eventQueue, state.roundNumber]);
}