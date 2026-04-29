export type StartMatchAction = {
  type: "start_match";
};

export type RevealInitialCardAction = {
  type: "reveal_initial_card";
  playerId: string;
};

export type StartRoundAction = {
  type: "start_round";
};

export type PlayCardAction = {
  type: "play_card";
  playerId: string;
  payload: {
    cardId: string;
  };
};

export type ResolveTrickAction = {
  type: "resolve_trick";
};

export type DrawCardAction = {
  type: "draw_card";
  playerId: string;
};

export type ScoreRoundAction = {
  type: "score_round";
};

export type NextRoundAction = {
  type: "next_round";
};

export type Game37Action =
  | StartMatchAction
  | RevealInitialCardAction
  | StartRoundAction
  | PlayCardAction
  | ResolveTrickAction
  | DrawCardAction
  | ScoreRoundAction
  | NextRoundAction;