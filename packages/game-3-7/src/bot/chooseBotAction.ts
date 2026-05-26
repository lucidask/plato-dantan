import type { Game37BotActionDecision } from "./types";

import type { Game37State } from "../types/Game37State";

import { normalBotPlay } from "./difficulty/normalBot";
import { extremeBotPlay } from "./difficulty/extremeBot";

export function chooseBotAction(
  state: Game37State,
  playerId: string
): Game37BotActionDecision {
  const player = state.players.find(
    (entry) => entry.id === playerId
  );

  if (!player || !player.isBot) {
    return {
      type: "wait",
      playerId,
      reason: "not_a_bot",
    };
  }

  const level = player.botLevel ?? "normal";

  switch (level) {
    case "normal":
      return normalBotPlay(state, playerId);

    case "extreme":
      return extremeBotPlay(state, playerId);

    default:
      return normalBotPlay(state, playerId);
  }
  
}