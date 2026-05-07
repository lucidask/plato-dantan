import type { Card } from "card-core";
import PlayingCard from "../PlayingCard/PlayingCard";
import InitialDeck from "../InitialDeck/InitialDeck";
import { getPlayerLabel } from "../../mappers/playerLabels";
import styles from "./InitialRevealArea.module.css";

type InitialRevealAreaProps = {
  reveal: Record<string, Card | null>;
  expectedPlayerId?: string | null;
  onRevealCard?: (playerId: string) => void;
};

export default function InitialRevealArea({
  reveal,
  expectedPlayerId,
  onRevealCard,
}: InitialRevealAreaProps) {
  return (
    <section className={styles.revealArea}>
      <div className={styles.revealedCards}>
        {Object.entries(reveal).map(([playerId, card]) =>
          card ? (
            <div key={playerId} className={styles.revealedCard}>
              <PlayingCard card={card} disabled />
              <span>{getPlayerLabel(playerId)}</span>
            </div>
          ) : null
        )}
      </div>

      {expectedPlayerId && (
        <div className={styles.initialDeckZone}>
          {expectedPlayerId === "player-2" && (
            <span className={styles.playerLabel}>
              {getPlayerLabel(expectedPlayerId)}
            </span>
          )}

          <InitialDeck
            disabled={!onRevealCard}
            onClick={() => onRevealCard?.(expectedPlayerId)}
            label="Lever"
          />

          {expectedPlayerId === "player-1" && (
            <span className={styles.playerLabel}>
              {getPlayerLabel(expectedPlayerId)}
            </span>
          )}
        </div>
      )}
    </section>
  );
}