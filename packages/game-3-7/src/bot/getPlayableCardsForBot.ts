import type { Card } from "../../../card-core/src";

import type { PlayCardAction } from "../types/Game37Action";
import type { Game37State } from "../types/Game37State";

import { validatePlayCard } from "../rules/validatePlayCard";

export function getPlayableCardsForBot(
  state: Game37State,
  playerId: string
): Card[] {
  const hand = state.hands[playerId] ?? [];

  return hand.filter((card) => {
    const action: PlayCardAction = {
      type: "play_card",
      playerId,
      payload: {
        cardId: card.id,
      },
    };

    const result = validatePlayCard(state, action);

    return result.valid;
  });
}