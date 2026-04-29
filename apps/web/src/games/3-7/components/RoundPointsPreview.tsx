import type { Card } from "card-core";

type RoundPointsPreviewProps = {
  wonCardsByOwner: Record<string, Card[]>;
};

const TRIO_RANKS = ["9", "10", "J", "Q", "K"];

function countAces(cards: Card[]) {
  return cards.filter((card) => card.rank === "A").length;
}

function countTrios(cards: Card[]) {
  return Math.floor(
    cards.filter((card) => TRIO_RANKS.includes(card.rank)).length / 3
  );
}

export default function RoundPointsPreview({
  wonCardsByOwner,
}: RoundPointsPreviewProps) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Points provisoires de la manche</h2>

      <div style={{ display: "flex", gap: 16 }}>
        {Object.entries(wonCardsByOwner).map(([ownerId, cards]) => {
          const aces = countAces(cards);
          const trios = countTrios(cards);
          const total = aces + trios;

          return (
            <div
              key={ownerId}
              style={{
                border: "1px solid #ccc",
                padding: 12,
                borderRadius: 8,
                minWidth: 160,
              }}
            >
              <strong>{ownerId}</strong>
              <div>As : {aces}</div>
              <div>Trios : {trios}</div>
              <div>
                <strong>Total provisoire : {total}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}