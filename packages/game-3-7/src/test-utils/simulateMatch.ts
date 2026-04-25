import {
  createGame37Match,
  setupRound,
  resolveTrick,
  findLegalCardForTest,
  scoreRound,
  checkMatchEnd,
  nextRound,
  dispatchGame37Action,
} from "../index";

export function simulateMatch() {
  const state = createGame37Match({
    matchId: "match-1",
    playerCount: 2,
    mode: "score",
    scoreTarget: 21,
    sequenceTarget: 4,
    players: [
      {
        id: "p1",
        displayName: "J1",
        seat: 1,
        teamId: "team-p1",
        isBot: false,
      },
      {
        id: "p2",
        displayName: "J2",
        seat: 2,
        teamId: "team-p2",
        isBot: false,
      },
    ],
  });

  dispatchGame37Action(state, {
    type: "reveal_initial_card",
    playerId: "p1",
  });

  dispatchGame37Action(state, {
    type: "reveal_initial_card",
    playerId: "p2",
  });

  while (state.phase !== "match_end") {
    if (state.phase === "round_setup") {
      setupRound(state);
      console.log(`\n===== Manche ${state.roundNumber} =====`);
    }

    while (state.phase === "trick_play") {
      const playerId = state.currentPlayerId!;
      const card = findLegalCardForTest(state, playerId);

      dispatchGame37Action(state, {
        type: "play_card",
        playerId,
        payload: { cardId: card.id },
      });
    }

    resolveTrick(state);

    while (state.phase === "draw_phase") {
      const drawerId = state.currentPlayerId!;

      dispatchGame37Action(state, {
        type: "draw_card",
        playerId: drawerId,
      });
    }

    if (state.phase === "round_scoring") {
      scoreRound(state);

      const lastRoundScored = state.eventQueue
        .filter((event) => event.type === "round_scored")
        .slice(-1)[0];

      if (lastRoundScored?.type === "round_scored") {
        console.log("Points manche:", lastRoundScored.payload.roundPointsByTeam);
        console.log("Score total:", lastRoundScored.payload.scoreByTeam);

        checkMatchEnd(state, lastRoundScored.payload.roundPointsByTeam);
      }
    }

    if (state.phase === "round_transition") {
      nextRound(state);
    }
  }

  console.log("\n===== MATCH TERMINÉ =====");
  console.log("Winner:", state.winnerTeamId);
  console.log("Score final:", state.scoreByTeam);

  const lastEvent = state.eventQueue[state.eventQueue.length - 1];
  console.log("Dernier event:", lastEvent);

  return state;
}