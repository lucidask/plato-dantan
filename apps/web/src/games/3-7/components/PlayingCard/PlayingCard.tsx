import type { Card } from "card-core";
import styles from "./PlayingCard.module.css";

type PlayingCardProps = {
  card: Card;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (card: Card) => void;
};

export default function PlayingCard({
  card,
  disabled = false,
  className,
  style,
  onClick,
}: PlayingCardProps) {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";

  return (
    <button
      type="button"
      className={`${styles.card} ${isRed ? styles.red : styles.black} ${className ?? ""}`}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick?.(card);
      }}
      style={style}
    >
      <span className={styles.topLabel}>{card.shortLabel}</span>
      <span className={styles.centerLabel}>{card.shortLabel}</span>
    </button>
  );
}