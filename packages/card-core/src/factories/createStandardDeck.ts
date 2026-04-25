import type { Card, CardRank, CardSuit, CardColor } from "../Card";

const suits: CardSuit[] = ["hearts", "diamonds", "clubs", "spades"];

const ranks: CardRank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const suitSymbols: Record<CardSuit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const suitNames: Record<CardSuit, string> = {
  hearts: "cœur",
  diamonds: "carreau",
  clubs: "trèfle",
  spades: "pique",
};

const rankNames: Record<CardRank, string> = {
  A: "As",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  J: "Valet",
  Q: "Dame",
  K: "Roi",
};

function getCardColor(suit: CardSuit): CardColor {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}

export function createStandardDeck(): Card[] {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${suit}-${rank}`,
      suit,
      rank,
      color: getCardColor(suit),
      shortLabel: `${rank}${suitSymbols[suit]}`,
      longLabel: `${rankNames[rank]} de ${suitNames[suit]}`,
    }))
  );
}