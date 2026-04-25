import type { PlayCardAction } from "../types/Game37Action";
import type { Game37State } from "../types/Game37State";
import { validatePlayCard } from "../rules/validatePlayCard";

function getNextPlayerId(state: Game37State): string | null {
  const currentPlayer = state.players.find(
    (player) => player.id === state.currentPlayerId
  );

  if (!currentPlayer) return null;

  const nextSeat =
    currentPlayer.seat === state.players.length
      ? 1
      : currentPlayer.seat + 1;

  return (
    state.players.find((player) => player.seat === nextSeat)?.id ?? null
  );
}

export function playCard(
  state: Game37State,
  action: PlayCardAction
): Game37State {
  const validation = validatePlayCard(state, action);

  if (!validation.valid) {
    return state;
  }

  const hand = state.hands[action.playerId];
  const card = hand.find((c) => c.id === action.payload.cardId);

  if (!card) return state;

  state.hands[action.playerId] = hand.filter((c) => c.id !== card.id);

  state.currentTrick.push({
    playerId: action.playerId,
    card,
    playedAtTurnIndex: state.currentTrick.length,
  });

  state.eventQueue.push({
    type: "card_played",
    payload: {
      playerId: action.playerId,
      card,
    },
  });

  if (state.currentTrick.length === state.players.length) {
    state.phase = "trick_resolution";
    state.currentPlayerId = null;
  } else {
    state.currentPlayerId = getNextPlayerId(state);
  }

  return state;
}