import type { Game37Event } from "../../../../../../packages/game-3-7/src/types/Game37Event";

type TrouverEvent = Extract<Game37Event, { type: "trouver" }>;

export function getLatestVisibleTrouverEvent(
  eventQueue: Game37Event[],
): TrouverEvent | null {
  const latestTrouverIndex = eventQueue.findLastIndex(
    (event) => event.type === "trouver",
  );

  const hasCardBeenPlayedAfterTrouver =
    latestTrouverIndex !== -1 &&
    eventQueue
      .slice(latestTrouverIndex + 1)
      .some((event) => event.type === "card_played");

  const latestTrouverEvent =
    latestTrouverIndex !== -1 &&
    !hasCardBeenPlayedAfterTrouver &&
    eventQueue[latestTrouverIndex].type === "trouver"
      ? eventQueue[latestTrouverIndex]
      : null;

  return latestTrouverEvent;
}