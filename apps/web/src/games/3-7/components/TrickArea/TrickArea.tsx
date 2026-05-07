import { memo } from "react";
import type { PlayedCard } from "game-3-7";
import PlayingCard from "../PlayingCard/PlayingCard";
import styles from "./TrickArea.module.css";
import { getPlayerLabel } from "../../mappers/playerLabels";

type TrickAreaProps = {
  cards: PlayedCard[];
};

function TrickArea({ cards }: TrickAreaProps) {
  return (
    <section className={styles.trickArea}>
      {cards.length === 0 ? (
        <p className={styles.emptyText}>Aucune carte sur la table</p>
      ) : (
        <div className={styles.cards}>
          {cards.map((played) => (
            <div
              key={`${played.playerId}-${played.card.id}`}
              className={styles.playedCard}
            >
              <PlayingCard card={played.card} disabled />
              <span className={styles.playerId}>{getPlayerLabel(played.playerId)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default memo(TrickArea);