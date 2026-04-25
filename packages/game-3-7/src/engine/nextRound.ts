import type { Game37State } from "../types/Game37State";

export function nextRound(state: Game37State): Game37State {
  if (state.phase !== "round_transition") {
    return state;
  }

  state.roundNumber += 1;

  // reset des données de manche
  state.hands = {};
  state.currentTrick = [];
  state.drawPile = [];
  state.drawContext = null;

  for (const team of state.teams) {
    state.wonCardsByOwner[team.id] = [];
  }

  // le starter de la nouvelle manche est déjà défini
  // (défini dans checkMatchEnd)

  state.phase = "round_setup";

  state.eventQueue.push({
    type: "round_started",
    payload: {
      roundNumber: state.roundNumber,
      starterPlayerId: state.currentRoundStarterId!,
    },
  });

  return state;
}