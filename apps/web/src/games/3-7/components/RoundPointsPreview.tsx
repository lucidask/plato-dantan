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
    <section style={{ marginTop: 20, minWidth: 0 }}>
      <h2>Points provisoires</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
          minWidth: 0,
        }}
      >
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
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <strong>{ownerId}</strong>
              <div>As : {aces}</div>
              <div>Trios : {trios}</div>
              <div>
                <strong>Total : {total}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}