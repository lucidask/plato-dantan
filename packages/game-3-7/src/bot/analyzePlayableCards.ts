import type { Card } from "../../../card-core/src";

import type { Game37State } from "../types/Game37State";

import {
  isStrongerCard,
  sortCardsByStrengthAsc,
  sortCardsByStrengthDesc,
} from "./cardStrength";

import { getPlayableCardsForBot } from "./getPlayableCardsForBot";

export type PlayableCardsAnalysis = {
  playableCards: Card[];

  weakestCard: Card | null;
  strongestCard: Card | null;

  winningCards: Card[];
  losingCards: Card[];
};

export function analyzePlayableCards(
  state: Game37State,
  playerId: string
): PlayableCardsAnalysis {
  const playableCards = getPlayableCardsForBot(
    state,
    playerId
  );

  if (playableCards.length === 0) {
    return {
      playableCards: [],
      weakestCard: null,
      strongestCard: null,
      winningCards: [],
      losingCards: [],
    };
  }

  const weakestCard =
    sortCardsByStrengthAsc(playableCards)[0] ?? null;

  const strongestCard =
    sortCardsByStrengthDesc(playableCards)[0] ?? null;

  // Si personne n’a encore joué :
  // toutes les cartes peuvent potentiellement gagner.
  if (state.currentTrick.length === 0) {
    return {
      playableCards,
      weakestCard,
      strongestCard,
      winningCards: playableCards,
      losingCards: [],
    };
  }

  const currentWinningCard =
    state.currentTrick[0].card;

  const winningCards = playableCards.filter((card) =>
    isStrongerCard(card, currentWinningCard)
  );

  const losingCards = playableCards.filter(
    (card) =>
      !isStrongerCard(card, currentWinningCard)
  );

  return {
    playableCards,
    weakestCard,
    strongestCard,
    winningCards,
    losingCards,
  };
}