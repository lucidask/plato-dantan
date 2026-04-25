import type { Game37State } from "../types/Game37State";

function getRoundWinnerTeamId(roundPointsByTeam: Record<string, number>): string {
  const entries = Object.entries(roundPointsByTeam);

  const [winnerTeamId] = entries.reduce((best, current) =>
    current[1] > best[1] ? current : best
  );

  return winnerTeamId;
}

function getOpponentTeamIds(state: Game37State, teamId: string): string[] {
  return state.teams
    .filter((team) => team.id !== teamId)
    .map((team) => team.id);
}

function teamHasFourAces(state: Game37State, teamId: string): boolean {
  const wonCards = state.wonCardsByOwner[teamId] ?? [];
  return wonCards.filter((card) => card.rank === "A").length === 4;
}

export function checkMatchEnd(
  state: Game37State,
  roundPointsByTeam: Record<string, number>
): Game37State {
  if (state.phase !== "round_scoring") {
    return state;
  }

  const roundWinnerTeamId = getRoundWinnerTeamId(roundPointsByTeam);

  // Règle 11 : si une équipe fait 0 point, l'autre gagne immédiatement
  for (const [teamId, points] of Object.entries(roundPointsByTeam)) {
    if (points === 0) {
      const opponentTeamId = getOpponentTeamIds(state, teamId)[0];

      state.phase = "match_end";
      state.isFinished = true;
      state.winnerTeamId = opponentTeamId;

      state.eventQueue.push({
        type: "match_ended",
        payload: {
          winnerTeamId: opponentTeamId,
          reason: "rule_11",
        },
      });

      return state;
    }
  }

  // Règle 4 As
  for (const team of state.teams) {
    if (teamHasFourAces(state, team.id)) {
      state.phase = "match_end";
      state.isFinished = true;
      state.winnerTeamId = team.id;

      state.eventQueue.push({
        type: "match_ended",
        payload: {
          winnerTeamId: team.id,
          reason: "rule_4_aces",
        },
      });

      return state;
    }
  }

  // Mode score
if (state.config.mode === "score" || state.config.mode === "mixed") {
  const teamsThatReachedTarget = state.teams.filter(
    (team) => state.scoreByTeam[team.id] >= state.config.scoreTarget
  );

  if (teamsThatReachedTarget.length > 0) {
    const winnerTeam = teamsThatReachedTarget.reduce((best, current) =>
      state.scoreByTeam[current.id] > state.scoreByTeam[best.id]
        ? current
        : best
    );

    state.phase = "match_end";
    state.isFinished = true;
    state.winnerTeamId = winnerTeam.id;

    state.eventQueue.push({
      type: "match_ended",
      payload: {
        winnerTeamId: winnerTeam.id,
        reason: state.config.mode === "mixed" ? "mixed_mode" : "score_target",
      },
    });

    return state;
  }
}

  // Mise à jour séquence
  for (const team of state.teams) {
    state.sequenceWinsByTeam[team.id] =
      team.id === roundWinnerTeamId ? state.sequenceWinsByTeam[team.id] + 1 : 0;
  }

  // Mode séquence
  if (
    (state.config.mode === "sequence" || state.config.mode === "mixed") &&
    state.sequenceWinsByTeam[roundWinnerTeamId] >= state.config.sequenceTarget
  ) {
    state.phase = "match_end";
    state.isFinished = true;
    state.winnerTeamId = roundWinnerTeamId;

    state.eventQueue.push({
      type: "match_ended",
      payload: {
        winnerTeamId: roundWinnerTeamId,
        reason:
          state.config.mode === "mixed" ? "mixed_mode" : "sequence_target",
      },
    });

    return state;
  }

  state.phase = "round_transition";
  state.currentRoundStarterId = state.players.find(
    (player) => player.teamId === roundWinnerTeamId
  )?.id ?? null;

  return state;
}