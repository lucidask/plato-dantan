import { dealCards, shuffleDeck } from "../../../card-core/src";
import type { Game37State } from "../types/Game37State";
import { createGame37Deck } from "../deck/createGame37Deck";

export function setupRound(state: Game37State): Game37State {
  if (state.phase !== "round_setup") {
    return state;
  }

  const roundStarterId =
    state.currentRoundStarterId ?? state.firstRoundStarterId;

  if (!roundStarterId) {
    return state;
  }

  const deck32 = shuffleDeck(createGame37Deck());
  const playerIds = state.players.map((player) => player.id);

  const { hands, remainingDeck } = dealCards(deck32, playerIds, 8);

  state.deck32 = deck32;
  state.hands = hands;
  state.drawPile = remainingDeck;

  state.currentRoundStarterId = roundStarterId;
  state.currentPlayerId = roundStarterId;

  state.currentTrick = [];
  state.drawContext = null;

  for (const ownerId of Object.keys(state.wonCardsByOwner)) {
    state.wonCardsByOwner[ownerId] = [];
  }

  state.phase = "trick_play";

  state.eventQueue.push({
    type: "round_started",
    payload: {
      roundNumber: state.roundNumber,
      starterPlayerId: roundStarterId,
    },
  });

  return state;
}