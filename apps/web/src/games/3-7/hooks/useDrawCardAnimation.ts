import { useCallback } from "react";

type Params = {
  state: any;
  dispatch: any;

  canDraw: boolean;
  expectedDrawPlayerId: string | null;

  topHandRef: React.RefObject<HTMLDivElement | null>;
  bottomHandRef: React.RefObject<HTMLDivElement | null>;

  drawMotion: {
    active: boolean;
  };

  setDrawMotion: React.Dispatch<any>;

  setHighlightedCardId: React.Dispatch<React.SetStateAction<string | null>>;
  highlightedTimeoutRef: React.RefObject<number | null>;

  registerAnimationTimeout: (
    callback: () => void,
    delay: number,
  ) => number;
};

export function useDrawCardAnimation({
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
}: Params) {
  const handleDrawCard = useCallback(
    (element: HTMLElement) => {
      if (!canDraw || !expectedDrawPlayerId) return;
      if (drawMotion.active) return;

      const drawnCard = state.drawPile[0] ?? null;
      if (!drawnCard) return;

      const fromRect = element.getBoundingClientRect();

      const targetRef =
        expectedDrawPlayerId === "player-2" ? topHandRef : bottomHandRef;

      const targetRect = targetRef.current?.getBoundingClientRect();

      if (!targetRect) {
        dispatch({
          type: "draw_card",
          playerId: expectedDrawPlayerId,
        });
        return;
      }

      setDrawMotion({
        active: true,
        from: {
          x: fromRect.left + fromRect.width / 2,
          y: fromRect.top + fromRect.height / 2,
        },
        to: {
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2,
        },
      });

      registerAnimationTimeout(() => {
        dispatch({
          type: "draw_card",
          playerId: expectedDrawPlayerId,
        });

        setHighlightedCardId(drawnCard.id);

        if (highlightedTimeoutRef.current !== null) {
          window.clearTimeout(highlightedTimeoutRef.current);
        }

        highlightedTimeoutRef.current = window.setTimeout(() => {
          setHighlightedCardId(null);
          highlightedTimeoutRef.current = null;
        }, 1800);

        setDrawMotion({
          active: false,
          from: null,
          to: null,
        });
      }, 600);
    },
    [
      canDraw,
      expectedDrawPlayerId,
      drawMotion.active,
      state.drawPile,
      dispatch,
      topHandRef,
      bottomHandRef,
      setDrawMotion,
      setHighlightedCardId,
      highlightedTimeoutRef,
      registerAnimationTimeout,
    ],
  );

  return {
    handleDrawCard,
  };
}