import { createStandardDeck } from "../../../card-core/src";
import type { Card } from "../../../card-core/src";
import { GAME37_RANK_ORDER } from "../constants/game37Ranks";

export function createGame37Deck(): Card[] {
  return createStandardDeck().filter((card) =>
    GAME37_RANK_ORDER.includes(card.rank)
  );
}