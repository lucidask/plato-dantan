import type { Card } from "card-core";

const RANK_ORDER = ["7", "8", "J", "Q", "K", "A", "9", "10"] as const;

export function getPlayableCardIds(
  hand: Card[],
  currentTrick: { card: Card }[],
) {
  if (currentTrick.length === 0) return undefined;

  const leadCard = currentTrick[0].card;
  const cardsOfLeadSuit = hand.filter((card) => card.suit === leadCard.suit);

  if (cardsOfLeadSuit.length === 0) return undefined;

  const leadRankIndex = RANK_ORDER.indexOf(
    leadCard.rank as (typeof RANK_ORDER)[number],
  );

  const strongerCards = cardsOfLeadSuit.filter(
    (card) =>
      RANK_ORDER.indexOf(card.rank as (typeof RANK_ORDER)[number]) >
      leadRankIndex,
  );

  const legalCards = strongerCards.length > 0 ? strongerCards : cardsOfLeadSuit;

  if (legalCards.length === hand.length) return undefined;

  return legalCards.map((card) => card.id);
}