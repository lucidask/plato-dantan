import { drawTopCard } from "../../../card-core/src";
import type { Game37State } from "../types/Game37State";
import type { DrawCardAction } from "../types/Game37Action";
import { detectTrouver } from "../rules/detectTrouver";

function getOpponentId(state: Game37State, playerId: string): string {
  const opponent = state.players.find((player) => player.id !== playerId);

  if (!opponent) {
    throw new Error("Opponent not found");
  }

  return opponent.id;
}

export function drawCard(
  state: Game37State,
  action: DrawCardAction
): Game37State {
  if (state.phase !== "draw_phase") {
    return state;
  }

if (!state.drawContext) {
  const winnerId = state.currentPlayerId;

  if (!winnerId) {
    return state;
  }

  const loserId = getOpponentId(state, winnerId);

  const trickWonEvents = state.eventQueue.filter(
    (event) => event.type === "trick_won"
  );

  const lastTrickWonEvent = trickWonEvents[trickWonEvents.length - 1];

  if (!lastTrickWonEvent || lastTrickWonEvent.type !== "trick_won") {
    return state;
  }

  const playersWhoFollowedSuit = lastTrickWonEvent.payload.playedCards
  .filter((played) => played.card.suit === lastTrickWonEvent.payload.leadSuit)
  .map((played) => played.playerId);

  state.drawContext = {
    expectedOrder: [winnerId, loserId],
    currentIndex: 0,
    leadSuit: lastTrickWonEvent.payload.leadSuit,
    winningCard: lastTrickWonEvent.payload.winningCard,
    winnerPlayerId: winnerId,
    winnerTeamId: state.players.find((p) => p.id === winnerId)!.teamId,
    playersWhoFollowedSuit,
  };
}

  const expectedPlayerId =
    state.drawContext.expectedOrder[state.drawContext.currentIndex];

  if (action.playerId !== expectedPlayerId) {
    return state;
  }

  const result = drawTopCard(state.drawPile);

  if (!result.drawnCard) {
    return state;
  }

  state.drawPile = result.remainingDeck;
  state.hands[action.playerId].push(result.drawnCard);

  state.eventQueue.push({
    type: "card_drawn",
    payload: {
      playerId: action.playerId,
      cardCountRemaining: state.drawPile.length,
    },
  });

  const trouverResult = detectTrouver(
    state.drawContext,
    action.playerId,
    result.drawnCard
  );

  if (trouverResult.shouldAnnounce) {
    state.eventQueue.push({
      type: "trouver",
      payload: {
        playerId: action.playerId,
        suit: result.drawnCard.suit,
        strongerThanWinningCard: trouverResult.strongerThanWinningCard,
      },
    });
  }

  state.drawContext.currentIndex++;

  const nextExpectedPlayerId =
    state.drawContext.expectedOrder[state.drawContext.currentIndex];

  if (nextExpectedPlayerId) {
    state.currentPlayerId = nextExpectedPlayerId;

    state.eventQueue.push({
      type: "draw_required",
      payload: {
        expectedPlayerId: nextExpectedPlayerId,
        drawOrder: state.drawContext.expectedOrder,
      },
    });

    return state;
  }

  const winnerId = state.drawContext.winnerPlayerId;

  state.drawContext = null;
  state.phase = "trick_play";
  state.currentPlayerId = winnerId;

  return state;
}