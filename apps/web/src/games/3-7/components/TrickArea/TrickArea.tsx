import { memo } from "react";
import type { PlayedCard } from "game-3-7";
import PlayingCard from "../PlayingCard/PlayingCard";
import styles from "./TrickArea.module.css";
import { getPlayerLabel } from "../../mappers/playerLabels";

type TrickAreaProps = {
  cards: PlayedCard[];
  playerCount?: 2 | 3 | 4;
};

function TrickArea({ cards, playerCount = 2 }: TrickAreaProps) {
  return (
    <section className={styles.trickArea}>
      {cards.length === 0 ? (
        <p className={styles.emptyText}>Aucune carte sur la table</p>
      ) : (
        <div className={styles.cards}>
          {cards.map((played, index) => {
            const isLatestCard = index === cards.length - 1;
            const getPositionClass = (playerId: string) => {
              if (playerCount === 2) {
                return playerId === "player-2"
                  ? styles.topPosition
                  : styles.bottomPosition;
              }

              switch (playerId) {
                case "player-1":
                  return styles.bottomPosition;
                case "player-2":
                  return styles.topPosition;
                case "player-3":
                  return styles.leftPosition;
                case "player-4":
                  return styles.rightPosition;
                default:
                  return "";
              }
            };

            return (
              <div
                key={`${played.playerId}-${played.card.id}`}
                className={[
                  styles.playedCard,
                  getPositionClass(played.playerId),
                  isLatestCard ? styles.latestCard : "",
                ].join(" ")}
              >
                <PlayingCard card={played.card} disabled />
                {/* <span className={styles.playerId}>
                  {getPlayerLabel(played.playerId)}
                </span> */}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default memo(TrickArea);
