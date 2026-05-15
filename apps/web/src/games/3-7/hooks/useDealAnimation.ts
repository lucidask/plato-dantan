import { useEffect, useRef } from "react";

type Params = {
  state: any;

  drawPileRef: React.RefObject<HTMLDivElement | null>;
  topHandRef: React.RefObject<HTMLDivElement | null>;
  bottomHandRef: React.RefObject<HTMLDivElement | null>;

  setIsDealing: React.Dispatch<React.SetStateAction<boolean>>;

  setDealingVisibleCount: React.Dispatch<
    React.SetStateAction<{
      "player-1": number;
      "player-2": number;
    }>
  >;

  setDealMotions: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        from: { x: number; y: number };
        to: { x: number; y: number };
      }[]
    >
  >;

  registerAnimationTimeout: (
    callback: () => void,
    delay: number,
  ) => number;
};

export function useDealAnimation({
  state,
  drawPileRef,
  topHandRef,
  bottomHandRef,
  setIsDealing,
  setDealingVisibleCount,
  setDealMotions,
  registerAnimationTimeout,
}: Params) {
  const lastDealtRoundRef = useRef<number | null>(null);

  useEffect(() => {
    const latestRoundStarted = [...state.eventQueue]
      .reverse()
      .find((event) => event.type === "round_started");

    if (!latestRoundStarted || latestRoundStarted.type !== "round_started") {
      return;
    }

    const roundNumber = latestRoundStarted.payload.roundNumber;

    if (lastDealtRoundRef.current === roundNumber) return;

    lastDealtRoundRef.current = roundNumber;

    setIsDealing(true);

    setDealingVisibleCount({
      "player-1": 0,
      "player-2": 0,
    });

    const drawPileRect = drawPileRef.current?.getBoundingClientRect();

    const topHandRect = topHandRef.current?.getBoundingClientRect();

    const bottomHandRect =
      bottomHandRef.current?.getBoundingClientRect();

    if (!drawPileRect || !topHandRect || !bottomHandRect) {
      setIsDealing(false);
      return;
    }

    const from = {
      x: drawPileRect.left + drawPileRect.width / 2,
      y: drawPileRect.top + drawPileRect.height / 2,
    };

    const topTo = {
      x: topHandRect.left + topHandRect.width / 2,
      y: topHandRect.top + topHandRect.height / 2,
    };

    const bottomTo = {
      x: bottomHandRect.left + bottomHandRect.width / 2,
      y: bottomHandRect.top + bottomHandRect.height / 2,
    };

    const totalCardsPerPlayer = 8;
    const dealDurationMs = 320;
    const gapMs = 220;

    for (let i = 0; i < totalCardsPerPlayer; i++) {
      registerAnimationTimeout(
        () => {
          const id = `deal-top-${i}`;

          setDealMotions((prev) => [
            ...prev,
            {
              id,
              from,
              to: topTo,
            },
          ]);

          registerAnimationTimeout(() => {
            setDealMotions((prev) =>
              prev.filter((motion) => motion.id !== id),
            );

            setDealingVisibleCount((prev) => ({
              ...prev,
              "player-2": prev["player-2"] + 1,
            }));
          }, dealDurationMs);
        },
        i * gapMs * 2,
      );

      registerAnimationTimeout(
        () => {
          const id = `deal-bottom-${i}`;

          setDealMotions((prev) => [
            ...prev,
            {
              id,
              from,
              to: bottomTo,
            },
          ]);

          registerAnimationTimeout(() => {
            setDealMotions((prev) =>
              prev.filter((motion) => motion.id !== id),
            );

            setDealingVisibleCount((prev) => ({
              ...prev,
              "player-1": prev["player-1"] + 1,
            }));
          }, dealDurationMs);
        },
        i * gapMs * 2 + gapMs,
      );
    }

    registerAnimationTimeout(() => {
      setIsDealing(false);
    }, totalCardsPerPlayer * gapMs * 2 + 500);
  }, [state.eventQueue]);
}