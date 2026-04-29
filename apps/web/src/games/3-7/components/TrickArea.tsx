import type { PlayedCard } from "game-3-7";

type TrickAreaProps = {
  cards: PlayedCard[];
};

export default function TrickArea({ cards }: TrickAreaProps) {
  return (
    <div>
      <h2>Pli courant</h2>

      {cards.length === 0 ? (
        <p>Aucune carte sur la table.</p>
      ) : (
        <div style={{ display: "flex", gap: 12 }}>
          {cards.map((played) => (
            <div key={`${played.playerId}-${played.card.id}`}>
              <strong>{played.playerId}</strong>
              <div style={{ fontSize: 28 }}>{played.card.shortLabel}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}