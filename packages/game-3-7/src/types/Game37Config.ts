import type { Game37Player } from "./Game37Player";

export type Game37Mode = "score" | "sequence" | "mixed";

export type Game37MatchConfig = {
  matchId: string;
  playerCount: 2 | 4;
  mode: Game37Mode;
  scoreTarget: number;
  sequenceTarget: number;
  players: Game37Player[];
};