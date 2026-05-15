import type { Card } from "card-core";

type TrickCollectMotion = {
  active: boolean;
  cards: Card[];
  winnerTeamId: string | null;
};

export function getVisibleWonCards(
  wonCardsByOwner: Record<string, Card[]>,
  teamId: string,
  trickCollectMotion: TrickCollectMotion,
) {
  const cards = wonCardsByOwner[teamId] || [];

  if (
    !trickCollectMotion.active ||
    trickCollectMotion.winnerTeamId !== teamId
  ) {
    return cards;
  }

  const collectingCardIds = new Set(
    trickCollectMotion.cards.map((card) => card.id),
  );

  return cards.filter((card) => !collectingCardIds.has(card.id));
}