import { useCallback } from "react";
import type { Card } from "card-core";

type Params = {
  state: any;
  dispatch: any;

  centerRef: React.RefObject<HTMLDivElement | null>;

  cardMotion: {
    active: boolean;
  };

  setCardMotion: React.Dispatch<any>;

  setHiddenCardId: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  registerAnimationTimeout: (
    callback: () => void,
    delay: number,
  ) => number;
};

export function usePlayCardAnimation({
  state,
  dispatch,
  centerRef,
  cardMotion,
  setCardMotion,
  setHiddenCardId,
  registerAnimationTimeout,
}: Params) {
  const handlePlayCard = useCallback(
    (
      playerId: string,
      card: Card,
      element: HTMLElement,
    ) => {
      if (cardMotion.active) return;
      if (state.phase !== "trick_play") return;
      if (state.currentPlayerId !== playerId) return;

      const fromRect = element.getBoundingClientRect();
      const toRect = centerRef.current?.getBoundingClientRect();

      if (!toRect) {
        dispatch({
          type: "play_card",
          playerId,
          payload: { cardId: card.id },
        });

        return;
      }

      setHiddenCardId(card.id);

      setCardMotion({
        active: true,
        card,
        from: {
          x: fromRect.left + fromRect.width / 2,
          y: fromRect.top + fromRect.height / 2,
        },
        to: {
          x: toRect.left + toRect.width / 2,
          y: toRect.top + toRect.height / 2,
        },
      });

      registerAnimationTimeout(() => {
        dispatch({
          type: "play_card",
          playerId,
          payload: { cardId: card.id },
        });

        setCardMotion({
          active: false,
          card: null,
          from: null,
          to: null,
        });

        setHiddenCardId(null);
      }, 600);
    },
    [
      cardMotion.active,
      state.phase,
      state.currentPlayerId,
      dispatch,
      centerRef,
      setCardMotion,
      setHiddenCardId,
      registerAnimationTimeout,
    ],
  );

  return {
    handlePlayCard,
  };
}