import type { Game37MatchConfig } from "../types/Game37Config";
import type { Game37State } from "../types/Game37State";
import type { Game37Team } from "../types/Game37Team";
import { createGame37Deck } from "../deck/createGame37Deck";
import { shuffleDeck } from "../../../card-core/src";

function createTeams(config: Game37MatchConfig): Game37Team[] {
  if (config.playerCount === 2) {
    return config.players.map((player) => ({
      id: player.teamId,
      name: player.displayName,
      playerIds: [player.id],
    }));
  }

  return [
    {
      id: "team-a",
      name: "Équipe A",
      playerIds: config.players
        .filter((player) => player.teamId === "team-a")
        .map((player) => player.id),
    },
    {
      id: "team-b",
      name: "Équipe B",
      playerIds: config.players
        .filter((player) => player.teamId === "team-b")
        .map((player) => player.id),
    },
  ];
}

export function createGame37Match(config: Game37MatchConfig): Game37State {
  const teams = createTeams(config);
  const deck32 = shuffleDeck(createGame37Deck());

  const scoreByTeam: Record<string, number> = {};
  const sequenceWinsByTeam: Record<string, number> = {};
  const wonCardsByOwner: Record<string, never[]> = {};
  const initialReveal: Record<string, null> = {};

  for (const team of teams) {
    scoreByTeam[team.id] = 0;
    sequenceWinsByTeam[team.id] = 0;
    wonCardsByOwner[team.id] = [];
  }

  for (const player of config.players) {
    initialReveal[player.id] = null;
  }

  return {
    gameId: "game-3-7",
    matchId: config.matchId,
    phase: "initial_card_reveal",
    config,

    players: config.players,
    teams,

    roundNumber: 1,
    currentPlayerId: null,

    firstRoundStarterId: null,
    currentRoundStarterId: null,

    deck32,
    drawPile: [],
    hands: {},

    currentTrick: [],
    wonCardsByOwner,

    scoreByTeam,
    sequenceWinsByTeam,

    initialReveal,
    drawContext: null,

    eventQueue: [{ type: "match_started" }],

    winnerTeamId: null,
    isFinished: false,
  };
}