import type { Game37BotLevel } from "../bot";
import { createGame37Match } from "../engine/createMatch";
import { dispatchGame37Action } from "../engine/dispatch";
import { runBotMatch } from "./runBotMatch";

type TournamentResult = {
  levelA: Game37BotLevel;
  levelB: Game37BotLevel;
  matches: number;
  wins: Record<string, number>;
  reasons: Record<string, number>;
};

function createInitialState(
  levelA: Game37BotLevel,
  levelB: Game37BotLevel,
  index: number
) {
  let state = createGame37Match({
    matchId: `bot-tournament-${levelA}-vs-${levelB}-${index}`,
    playerCount: 2,
    mode: "score",
    scoreTarget: 21,
    sequenceTarget: 4,
    players: [
      {
        id: "player-1",
        displayName: `Bot ${levelA}`,
        seat: 1,
        teamId: "team-1",
        isBot: true,
        botLevel: levelA,
      },
      {
        id: "player-2",
        displayName: `Bot ${levelB}`,
        seat: 2,
        teamId: "team-2",
        isBot: true,
        botLevel: levelB,
      },
    ],
  });

  state = dispatchGame37Action(state, {
    type: "reveal_initial_card",
    playerId: "player-1",
  });

  state = dispatchGame37Action(state, {
    type: "reveal_initial_card",
    playerId: "player-2",
  });

  state = dispatchGame37Action(state, {
    type: "start_round",
  });

  return state;
}

function runTournament(
  levelA: Game37BotLevel,
  levelB: Game37BotLevel,
  matches = 100
): TournamentResult {
  const wins: Record<string, number> = {
    "team-1": 0,
    "team-2": 0,
    none: 0,
  };

  const reasons: Record<string, number> = {};

  for (let i = 1; i <= matches; i++) {
    const initialState = createInitialState(levelA, levelB, i);
    const finalState = runBotMatch(initialState);

    const winner = finalState.winnerTeamId ?? "none";
    wins[winner] = (wins[winner] ?? 0) + 1;

    const matchEndEvent = finalState.eventQueue
      .filter((event) => event.type === "match_ended")
      .slice(-1)[0];

    const reason =
      matchEndEvent?.type === "match_ended"
        ? matchEndEvent.payload.reason
        : "unknown";

    reasons[reason] = (reasons[reason] ?? 0) + 1;
  }

  return {
    levelA,
    levelB,
    matches,
    wins,
    reasons,
  };
}

const scenarios: Array<[Game37BotLevel, Game37BotLevel]> = [
  ["normal", "extreme"],
  ["extreme", "normal"],
];

for (const [levelA, levelB] of scenarios) {
  const result = runTournament(levelA, levelB, 100);

  console.log("");
  console.log(`=== ${levelA.toUpperCase()} VS ${levelB.toUpperCase()} ===`);
  console.log("MATCHES:", result.matches);
  console.log(`${levelA}:`, result.wins["team-1"]);
  console.log(`${levelB}:`, result.wins["team-2"]);
  console.log("NONE:", result.wins.none);
  console.log("REASONS:", result.reasons);
}