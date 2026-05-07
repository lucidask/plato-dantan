import type { Card } from "card-core";
import styles from "./PlayingCard.module.css";

type PlayingCardProps = {
  card: Card;
  disabled?: boolean;
  onClick?: (card: Card) => void;
};

export default function PlayingCard({
  card,
  disabled = false,
  onClick,
}: PlayingCardProps) {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";

  return (
    <button
      type="button"
      className={`${styles.card} ${isRed ? styles.red : styles.black}`}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick?.(card);
      }}
    >
      <span className={styles.topLabel}>{card.shortLabel}</span>
      <span className={styles.centerLabel}>{card.shortLabel}</span>
    </button>
  );
}