import type { Card, CardSuit } from "../../../card-core/src";
import type { Game37MatchConfig } from "./Game37Config";
import type { Game37Player } from "./Game37Player";
import type { Game37Team } from "./Game37Team";
import type { Game37Event } from "./Game37Event";

export type Game37Phase =
  | "match_init"
  | "initial_card_reveal"
  | "round_setup"
  | "trick_play"
  | "trick_resolution"
  | "draw_phase"
  | "round_scoring"
  | "round_transition"
  | "match_end";

export type PlayedCard = {
  playerId: string;
  card: Card;
  playedAtTurnIndex: number;
};

export type DrawContext = {
  expectedOrder: string[];
  currentIndex: number;
  leadSuit: CardSuit;
  winningCard: Card;
  winnerPlayerId: string;
  winnerTeamId: string;
  playersWhoFollowedSuit: string[];
};

export type Game37State = {
  gameId: "game-3-7";
  matchId: string;
  phase: Game37Phase;
  config: Game37MatchConfig;

  players: Game37Player[];
  teams: Game37Team[];

  roundNumber: number;
  currentPlayerId: string | null;

  firstRoundStarterId: string | null;
  currentRoundStarterId: string | null;

  deck32: Card[];
  drawPile: Card[];
  hands: Record<string, Card[]>;

  currentTrick: PlayedCard[];
  wonCardsByOwner: Record<string, Card[]>;

  scoreByTeam: Record<string, number>;
  sequenceWinsByTeam: Record<string, number>;

  initialReveal: Record<string, Card | null>;
  drawContext: DrawContext | null;

  eventQueue: Game37Event[];

  winnerTeamId: string | null;
  isFinished: boolean;
};