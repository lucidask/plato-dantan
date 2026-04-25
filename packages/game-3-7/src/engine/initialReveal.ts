import type { Game37State } from "../types/Game37State";
import type { Game37Event } from "../types/Game37Event";
import type { Card } from "../../../card-core/src";
import { drawTopCard } from "../../../card-core/src";
import { GAME37_RANK_ORDER } from "../constants/game37Ranks";

function compareCards(cardA: Card, cardB: Card): number {
  return (
    GAME37_RANK_ORDER.indexOf(cardA.rank) -
    GAME37_RANK_ORDER.indexOf(cardB.rank)
  );
}

export function handleRevealInitialCard(
  state: Game37State,
  playerId: string
): Game37State {
  if (state.phase !== "initial_card_reveal") {
    return state;
  }

  // si déjà levée → ignore
  if (state.initialReveal[playerId]) {
    return state;
  }

  // piocher une carte
  const result = drawTopCard(state.deck32);

  if (!result.drawnCard) return state;

  state.deck32 = result.remainingDeck;

  state.initialReveal[playerId] = result.drawnCard;

  state.eventQueue.push({
    type: "initial_card_revealed",
    payload: {
      playerId,
      card: result.drawnCard,
    },
  });

  // vérifier si tous les joueurs ont levé une carte
  const allRevealed = Object.values(state.initialReveal).every(
    (card) => card !== null
  );

  if (!allRevealed) return state;

  // déterminer la carte la plus forte
  let bestPlayerId: string | null = null;
  let bestCard: Card | null = null;

  for (const [pid, card] of Object.entries(state.initialReveal)) {
    if (!card) continue;

    if (!bestCard || compareCards(card, bestCard) > 0) {
      bestCard = card;
      bestPlayerId = pid;
    }
  }

  if (bestPlayerId && bestCard) {
    state.firstRoundStarterId = bestPlayerId;

    state.eventQueue.push({
      type: "first_round_starter_determined",
      payload: {
        playerId: bestPlayerId,
        card: bestCard,
      },
    });
  }

  // remettre les cartes dans le deck
  state.deck32 = [
    ...state.deck32,
    ...Object.values(state.initialReveal).filter(
      (c): c is Card => c !== null
    ),
  ];

  // reset reveal
  for (const pid of Object.keys(state.initialReveal)) {
    state.initialReveal[pid] = null;
  }

  // passer à la suite
  state.phase = "round_setup";

  return state;
}