export function getPlayerLabel(playerId: string) {
  switch (playerId) {
    case "player-1":
      return "Joueur 1";

    case "player-2":
      return "Joueur 2";

    case "player-3":
      return "Joueur 3";

    case "player-4":
      return "Joueur 4";

    default:
      return playerId;
  }
}

export function getTeamLabel(teamId: string) {
  switch (teamId) {
    case "team-1":
      return "Équipe 1";

    case "team-2":
      return "Équipe 2";

    default:
      return teamId;
  }
}