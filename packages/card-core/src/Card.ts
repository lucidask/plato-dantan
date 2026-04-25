export type CardSuit = "hearts" | "diamonds" | "clubs" | "spades";

export type CardRank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export type CardColor = "red" | "black";

export type Card = {
  id: string;
  suit: CardSuit;
  rank: CardRank;
  color: CardColor;
  shortLabel: string;
  longLabel: string;
};