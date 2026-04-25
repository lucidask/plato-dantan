import type { Card, CardSuit } from "../../../card-core/src";

export type Game37Event =
  | { type: "match_started" }
  | {
      type: "initial_card_revealed";
      payload: { playerId: string; card: Card };
    }
  | {
      type: "first_round_starter_determined";
      payload: { playerId: string; card: Card };
    }
  | {
      type: "round_started";
      payload: { roundNumber: number; starterPlayerId: string };
    }
  | {
      type: "card_played";
      payload: { playerId: string; card: Card };
    }
  | {
      type: "trick_won";
      payload: {
        winnerPlayerId: string;
        winnerTeamId: string;
        winningCard: Card;
        leadSuit: CardSuit;
      };
    }
  | {
      type: "draw_required";
      payload: { expectedPlayerId: string; drawOrder: string[] };
    }
  | {
      type: "card_drawn";
      payload: { playerId: string; cardCountRemaining: number };
    }
  | {
      type: "trouver";
      payload: {
        playerId: string;
        suit: CardSuit;
        strongerThanWinningCard: boolean;
      };
    }
    | {
    type: "round_end";
    payload: {
      roundNumber: number;
    };
  }
  | {
    type: "round_scored";
    payload: {
      roundPointsByTeam: Record<string, number>;
      scoreByTeam: Record<string, number>;
      sequenceWinsByTeam: Record<string, number>;
    };
  }
  | {
      type: "match_ended";
      payload: {
        winnerTeamId: string;
        reason:
          | "score_target"
          | "sequence_target"
          | "mixed_mode"
          | "rule_11"
          | "rule_4_aces";
      };
    };