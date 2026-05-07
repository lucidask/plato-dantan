import styles from "./DrawPile.module.css";

type DrawPileProps = {
  count: number;
  expectedPlayerLabel?: string;
  expectedPlayerPosition?: "top" | "bottom";
  disabled?: boolean;
  onDraw?: () => void;
};

export default function DrawPile({
  count,
  expectedPlayerLabel,
  expectedPlayerPosition,
  disabled = false,
  onDraw,
}: DrawPileProps) {
  return (
    <div className={styles.wrapper}>
      {expectedPlayerLabel &&
        expectedPlayerPosition === "top" && (
          <span className={styles.playerLabel}>
            {expectedPlayerLabel}
          </span>
        )}

      <button
        type="button"
        className={styles.drawPile}
        disabled={disabled || count <= 0}
        onClick={onDraw}
        title="Pioche"
      >
        <span className={styles.count}>{count}</span>
      </button>

      {expectedPlayerLabel &&
        expectedPlayerPosition === "bottom" && (
          <span className={styles.playerLabel}>
            {expectedPlayerLabel}
          </span>
        )}
    </div>
  );
}