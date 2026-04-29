import type { Card } from "card-core";

type PlayerHandProps = {
  title: string;
  cards: Card[];
  disabled?: boolean;
  onCardClick?: (card: Card) => void;
};

export default function PlayerHand({
  title,
  cards,
  disabled = false,
  onCardClick,
}: PlayerHandProps) {
  return (
    <div>
      <h3>{title}</h3>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cards.map((card) => (
          <button
            key={card.id}
            disabled={disabled}
            onClick={() => onCardClick?.(card)}
            style={{ padding: 10, cursor: disabled ? "not-allowed" : "pointer" }}
          >
            {card.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}