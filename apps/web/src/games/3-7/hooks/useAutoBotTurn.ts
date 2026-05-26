import { useEffect } from "react";

import type { Game37State } from "game-3-7";
import { chooseBotAction } from "game-3-7";
import type { Card } from "card-core";

type UseAutoBotTurnParams = {
    state: Game37State;
    enabled?: boolean;
    delayMs?: number;
    isDealing?: boolean;

    handlePlayCard: (
        playerId: string,
        card: Card,
        element: HTMLElement
    ) => void;

    handleDrawCard: (element: HTMLElement) => void;

    handleRevealInitialCard: (
        playerId: string,
        element: HTMLElement
    ) => void;
};

export function useAutoBotTurn({
    state,
    enabled = true,
    delayMs = 800,
    handlePlayCard,
    handleDrawCard,
    handleRevealInitialCard,
    isDealing = false,

}: UseAutoBotTurnParams) {
    useEffect(() => {
        if (!enabled) return;
        if (isDealing) return;

        const timeoutId = window.setTimeout(() => {
            if (state.phase === "initial_card_reveal") {
                const expectedPlayerId =
                    Object.entries(state.initialReveal).find(
                        ([, card]) => card === null
                    )?.[0] ?? null;

                if (!expectedPlayerId) return;

                const expectedPlayer = state.players.find(
                    (player) => player.id === expectedPlayerId
                );

                if (!expectedPlayer?.isBot) return;

                const element =
                    document.querySelector("[data-initial-deck]") ??
                    document.querySelector('[data-initial-reveal-pile="true"]');

                if (!(element instanceof HTMLElement)) return;

                handleRevealInitialCard(expectedPlayer.id, element);
                return;
            }

            const currentPlayer = state.players.find(
                (player) => player.id === state.currentPlayerId
            );

            if (!currentPlayer?.isBot) return;

            const decision = chooseBotAction(state, currentPlayer.id);

            if (decision.type === "play_card") {
                const element = document.querySelector(
                    `[data-card-id="${decision.card.id}"]`
                );

                if (!(element instanceof HTMLElement)) return;

                handlePlayCard(decision.playerId, decision.card, element);
            }

            if (decision.type === "draw_card") {
                const element = document.querySelector('[data-draw-pile="true"]');

                if (!(element instanceof HTMLElement)) return;

                handleDrawCard(element);
            }
        }, delayMs);

        return () => window.clearTimeout(timeoutId);
    }, [
        state,
        enabled,
        delayMs,
        isDealing,
        handlePlayCard,
        handleDrawCard,
        handleRevealInitialCard,
    ]);
}