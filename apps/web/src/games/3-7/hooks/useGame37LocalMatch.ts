import { useState } from "react";
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
        displayName: "Joueur 2",
        seat: 2,
        teamId: "team-2",
        isBot: false,
      },
    ],
  });
}

export function useGame37LocalMatch() {
  const [state, setState] = useState<Game37State>(() => createInitialState());
  const [events, setEvents] = useState<Game37Event[]>([]);

  function dispatch(action: Game37Action) {
  const stateCopy = structuredClone(state);
  const newState = dispatchGame37Action(stateCopy, action);

  setState(newState);
  setEvents(newState.eventQueue.slice(-5));
}

  return {
    state,
    events,
    dispatch,
  };
}