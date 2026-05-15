import type { Card } from "card-core";
import styles from "./PlayingCard.module.css";

type PlayingCardProps = {
  card: Card;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (card: Card, element: HTMLButtonElement) => void;
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
      onClick={(event) => {
        if (disabled) return;
        onClick?.(card, event.currentTarget);
      }}
      style={style}
    >
      <span className={styles.topLabel}>{card.shortLabel}</span>
      <span className={styles.centerLabel}>{card.shortLabel}</span>
    </button>
  );
}