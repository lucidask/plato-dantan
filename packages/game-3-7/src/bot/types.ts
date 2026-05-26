import type { Card } from "../../../card-core/src";

export type Game37BotLevel = "normal" | "extreme";

export type Game37BotActionDecision =
  | {
      type: "play_card";
      playerId: string;
      card: Card;
      reason: string;
    }
  | {
      type: "draw_card";
      playerId: string;
      reason: string;
    }
  | {
      type: "wait";
      playerId: string;
      reason: string;
    };

export type Game37BotContext = {
  playerId: string;
  level: Game37BotLevel;
};