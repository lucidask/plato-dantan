import {
  createStandardDeck,
  shuffleDeck,
  dealCards,
} from "./src";

const deck = shuffleDeck(createStandardDeck());

const players = ["p1", "p2"];
const result = dealCards(deck, players, 8);

console.log("Main p1:", result.hands["p1"].length);
console.log("Main p2:", result.hands["p2"].length);
console.log("Cartes restantes:", result.remainingDeck.length);