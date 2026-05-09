import type { Card } from "card-core";
import styles from "./WonPile.module.css";

type WonPileProps = {
  cards: Card[];
  label?: string;
};

export default function WonPile({ cards }: WonPileProps) {
  const visibleLayers = Math.min(cards.length, 4);

  return (
    <div className={styles.stack} aria-label={`${cards.length} cartes gagnées`}>
      {cards.length === 0 ? (
        <div className={styles.emptyCard} />
      ) : (
        Array.from({ length: visibleLayers }).map((_, index) => (
          <div
            key={index}
            className={styles.cardBack}
            style={{
              transform: `translate(${index * 2}px, ${index * -2}px)`,
            }}
          />
        ))
      )}

      {cards.length > 0 && <span className={styles.count}>{cards.length}</span>}
    </div>
  );
}
