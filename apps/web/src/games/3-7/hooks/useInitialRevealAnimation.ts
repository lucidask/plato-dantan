import { useCallback } from "react";

type Params = {
  state: any;
  dispatch: any;

  initialRevealCenterRef: React.RefObject<HTMLDivElement | null>;

  setInitialRevealMotion: React.Dispatch<any>;

  registerAnimationTimeout: (
    callback: () => void,
    delay: number,
  ) => number;
};

export function useInitialRevealAnimation({
  state,
  dispatch,
  initialRevealCenterRef,
  setInitialRevealMotion,
  registerAnimationTimeout,
}: Params) {
  const handleRevealInitialCard = useCallback(
    (playerId: string, element: HTMLElement) => {
      if (state.phase !== "initial_card_reveal") return;
      if (state.initialReveal[playerId] !== null) return;

      const fromRect = element.getBoundingClientRect();
      const toRect = initialRevealCenterRef.current?.getBoundingClientRect();

      const nextCard = state.deck32[0] ?? null;

      if (!toRect || !nextCard) {
        dispatch({
          type: "reveal_initial_card",
          playerId,
        });

        return;
      }

      setInitialRevealMotion({
        active: true,
        card: nextCard,
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
          type: "reveal_initial_card",
          playerId,
        });

        setInitialRevealMotion({
          active: false,
          card: null,
          from: null,
          to: null,
        });
      }, 650);
    },
    [
      state.phase,
      state.initialReveal,
      state.deck32,
      dispatch,
      initialRevealCenterRef,
      setInitialRevealMotion,
      registerAnimationTimeout,
    ],
  );

  return {
    handleRevealInitialCard,
  };
}