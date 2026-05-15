import type { Card } from "card-core";
import PlayingCard from "../PlayingCard/PlayingCard";
import InitialDeck from "../InitialDeck/InitialDeck";
import { getPlayerLabel } from "../../mappers/playerLabels";
import styles from "./InitialRevealArea.module.css";

type InitialRevealAreaProps = {
  reveal: Record<string, Card | null>;
  expectedPlayerId?: string | null;
  onRevealCard?: (playerId: string, element: HTMLElement) => void;
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
          ) : null,
        )}
      </div>

      {expectedPlayerId && (
        <div className={styles.initialDeckZone}>
          <div
            data-initial-deck
            onClick={() => {
              const element = document.querySelector("[data-initial-deck]");

              if (element instanceof HTMLElement) {
                onRevealCard?.(expectedPlayerId, element);
              }
            }}
          >
            <InitialDeck
              disabled={!onRevealCard}
              onClick={() => {}}
              label="Lever"
            />
          </div>

          <div className={styles.drawIndicator}>
            <span className={styles.pointer}>👆</span>

            <span className={styles.playerLabel}>
              {getPlayerLabel(expectedPlayerId)}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
