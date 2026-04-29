import type { Card } from "card-core";

type InitialRevealAreaProps = {
  reveal: Record<string, Card | null>;
};

export default function InitialRevealArea({ reveal }: InitialRevealAreaProps) {
  return (
    <div>
      <h2>Cartes levées</h2>

      <div style={{ display: "flex", gap: 20 }}>
        {Object.entries(reveal).map(([playerId, card]) => (
          <div key={playerId}>
            <strong>{playerId}</strong>

            <div style={{ marginTop: 5 }}>
              {card ? (
                <div style={{ fontSize: 28 }}>{card.shortLabel}</div>
              ) : (
                <div style={{ opacity: 0.5 }}>...</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}