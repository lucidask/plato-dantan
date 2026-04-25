import type { Card } from "../../../card-core/src";
import type { Game37State } from "../types/Game37State";

const TRIO_RANKS = ["9", "10", "J", "Q", "K"];

function countAces(cards: Card[]): number {
  return cards.filter((card) => card.rank === "A").length;
}

function countTrios(cards: Card[]): number {
  const trioCardsCount = cards.filter((card) =>
    TRIO_RANKS.includes(card.rank)
  ).length;

  return Math.floor(trioCardsCount / 3);
}

export function scoreRound(state: Game37State): Game37State {
  if (state.phase !== "round_scoring") {
    return state;
  }

  const roundPointsByTeam: Record<string, number> = {};

  for (const team of state.teams) {
    const wonCards = state.wonCardsByOwner[team.id] ?? [];

    const acePoints = countAces(wonCards);
    const trioPoints = countTrios(wonCards);

    let total = acePoints + trioPoints;

    // Bonus dernier pli
    const lastTrickWon = state.eventQueue
      .filter((event) => event.type === "trick_won")
      .slice(-1)[0];

    if (
      lastTrickWon?.type === "trick_won" &&
      lastTrickWon.payload.winnerTeamId === team.id
    ) {
      total += 1;
    }

    roundPointsByTeam[team.id] = total;
    state.scoreByTeam[team.id] += total;
  }

  state.eventQueue.push({
    type: "round_scored",
    payload: {
      roundPointsByTeam,
      scoreByTeam: state.scoreByTeam,
      sequenceWinsByTeam: state.sequenceWinsByTeam,
    },
  });

  return state;
}