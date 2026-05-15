import type { Card } from "../../../card-core/src";
import type { DrawContext } from "../types/Game37State";
import { GAME37_RANK_ORDER } from "../constants/game37Ranks";

function isStronger(cardA: Card, cardB: Card): boolean {
  return (
    GAME37_RANK_ORDER.indexOf(cardA.rank) >
    GAME37_RANK_ORDER.indexOf(cardB.rank)
  );
}

export function detectTrouver(
  drawContext: DrawContext,
  playerId: string,
  drawnCard: Card
): {
  shouldAnnounce: boolean;
  strongerThanWinningCard: boolean;
} {
  const isLoserDraw =
    playerId !== drawContext.winnerPlayerId;

  if (!isLoserDraw) {
    return {
      shouldAnnounce: false,
      strongerThanWinningCard: false,
    };
  }

  const sameSuit =
    drawnCard.suit === drawContext.winningCard.suit;

  if (!sameSuit) {
    return {
      shouldAnnounce: false,
      strongerThanWinningCard: false,
    };
  }

  const loserFollowedSuit =
    drawContext.playersWhoFollowedSuit.includes(playerId);

  const strongerThanWinningCard =
    isStronger(drawnCard, drawContext.winningCard);

  const shouldAnnounce =
    (!loserFollowedSuit && sameSuit) ||
    (
      loserFollowedSuit &&
      sameSuit &&
      strongerThanWinningCard
    );

  return {
    shouldAnnounce,
    strongerThanWinningCard:
      shouldAnnounce && strongerThanWinningCard,
  };
}