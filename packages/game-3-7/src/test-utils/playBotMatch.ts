import { createGame37Match } from "../engine/createMatch";

import { dispatchGame37Action } from "../engine/dispatch";

import { runBotMatchVerbose } from "./runBotMatchVerbose";

const state = createGame37Match({
  matchId: "bot-test-1",
  playerCount: 2,
  mode: "score",
  scoreTarget: 21,
  sequenceTarget: 4,
  players: [
    {
      id: "player-1",
      displayName: "Bot Normal",
      seat: 1,
      teamId: "team-1",
      isBot: true,
      botLevel: "normal",
    },
    {
      id: "player-2",
      displayName: "Bot Hard",
      seat: 2,
      teamId: "team-2",
      isBot: true,
      botLevel: "hard",
    },
  ],
});

let currentState = state;

// Révélation initiale
currentState = dispatchGame37Action(
  currentState,
  {
    type: "reveal_initial_card",
    playerId: "player-1",
  }
);

currentState = dispatchGame37Action(
  currentState,
  {
    type: "reveal_initial_card",
    playerId: "player-2",
  }
);

// Démarrer la manche
currentState = dispatchGame37Action(
  currentState,
  {
    type: "start_round",
  }
);

// Lancer la simulation complète
const finalState =
  runBotMatchVerbose(currentState);

console.log("");
console.log("=== FINAL RESULT ===");

console.log(
  "PHASE:",
  finalState.phase
);

console.log(
  "SCORES:",
  finalState.scoreByTeam
);

console.log(
  "WINNER:",
  finalState.winnerTeamId
);

const lastMatchEnded = finalState.eventQueue
  .filter((event) => event.type === "match_ended")
  .slice(-1)[0];

console.log("MATCH END EVENT:", lastMatchEnded);