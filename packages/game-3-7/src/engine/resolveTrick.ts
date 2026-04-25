import type { Card } from "../../../card-core/src";
import type { Game37State, PlayedCard } from "../types/Game37State";
import { GAME37_RANK_ORDER } from "../constants/game37Ranks";

function isStronger(cardA: Card, cardB: Card): boolean {
  return (
    GAME37_RANK_ORDER.indexOf(cardA.rank) >
    GAME37_RANK_ORDER.indexOf(cardB.rank)
  );
}

function getOwnerId(state: Game37State, playerId: string): string {
  const player = state.players.find((p) => p.id === playerId);

  if (!player) {
    throw new Error(`Player not found: ${playerId}`);
  }

  return player.teamId;
}

function findTrickWinner(cards: PlayedCard[]): PlayedCard {
  const leadSuit = cards[0].card.suit;

  return cards
    .filter((played) => played.card.suit === leadSuit)
    .reduce((best, current) =>
      isStronger(current.card, best.card) ? current : best
    );
}

export function resolveTrick(state: Game37State): Game37State {
  if (state.phase !== "trick_resolution") {
    return state;
  }

  if (state.currentTrick.length !== state.players.length) {
    return state;
  }

  const winner = findTrickWinner(state.currentTrick);
  const winnerTeamId = getOwnerId(state, winner.playerId);
  const leadSuit = state.currentTrick[0].card.suit;

  state.wonCardsByOwner[winnerTeamId].push(
    ...state.currentTrick.map((played) => played.card)
  );

  state.eventQueue.push({
    type: "trick_won",
    payload: {
      winnerPlayerId: winner.playerId,
      winnerTeamId,
      winningCard: winner.card,
      leadSuit,
    },
  });

  state.currentTrick = [];

// 🔥 CAS 1 : il reste des cartes à piocher
if (state.drawPile.length > 0) {
  state.phase = "draw_phase";
  state.currentPlayerId = winner.playerId;
  return state;
}

// 🔥 CAS 2 : plus de pioche → continuer à jouer
const allHandsEmpty = Object.values(state.hands).every(
  (hand) => hand.length === 0
);

// 🔥 FIN DE MANCHE
if (allHandsEmpty) {
  state.phase = "round_scoring";
  state.currentPlayerId = null;

  state.eventQueue.push({
    type: "round_end",
    payload: {
      roundNumber: state.roundNumber,
    },
  });

  return state;
}

// 🔥 continuer les plis sans pioche
state.phase = "trick_play";
state.currentPlayerId = winner.playerId;

return state;
}