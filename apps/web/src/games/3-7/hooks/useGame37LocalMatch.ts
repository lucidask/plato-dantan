import { useCallback, useState } from "react";
import {
  createGame37Match,
  dispatchGame37Action,
  type Game37Action,
  type Game37State,
  type Game37Event,
} from "game-3-7";

function createInitialState(): Game37State {
  return createGame37Match({
    matchId: crypto.randomUUID(),
    playerCount: 2,
    mode: "score",
    scoreTarget: 21,
    sequenceTarget: 4,
    players: [
      {
        id: "player-1",
        displayName: "Joueur 1",
        seat: 1,
        teamId: "team-1",
        isBot: false,
      },
      {
        id: "player-2",
        displayName: "Malis",
        seat: 2,
        teamId: "team-2",
        isBot: true,
        botLevel: "extreme",
      },
    ],
  });
}

export function useGame37LocalMatch() {
  const [state, setState] = useState<Game37State>(() => createInitialState());
  const [events, setEvents] = useState<Game37Event[]>([]);

  const dispatch = useCallback((action: Game37Action) => {
    setState((previousState) => {
      const stateCopy = structuredClone(previousState);
      const newState = dispatchGame37Action(stateCopy, action);

      const recentEvents = newState.eventQueue.slice(-10);
      setEvents(recentEvents);

      return {
        ...newState,
        eventQueue: recentEvents,
      };
    });
  }, []);

  return {
    state,
    events,
    dispatch,
  };
}