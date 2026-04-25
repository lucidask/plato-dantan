export type StartMatchAction = {
  type: "start_match";
};

export type RevealInitialCardAction = {
  type: "reveal_initial_card";
  playerId: string;
};

export type PlayCardAction = {
  type: "play_card";
  playerId: string;
  payload: {
    cardId: string;
  };
};

export type DrawCardAction = {
  type: "draw_card";
  playerId: string;
};

export type Game37Action =
  | StartMatchAction
  | RevealInitialCardAction
  | PlayCardAction
  | DrawCardAction;