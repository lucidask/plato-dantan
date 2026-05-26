import styles from "./DrawPile.module.css";

type DrawPileProps = {
  count: number;
  expectedPlayerLabel?: string;
  disabled?: boolean;
  onDraw?: (element: HTMLElement) => void;
};
export default function DrawPile({
  count,
  expectedPlayerLabel,
  disabled = false,
  onDraw,
}: DrawPileProps) {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        data-draw-pile="true"
        className={styles.drawPile}
        disabled={disabled || count <= 0}
        onClick={(event) => onDraw?.(event.currentTarget)}
        title="Pioche"
      >
        <span className={styles.count}>{count}</span>
      </button>
      {expectedPlayerLabel && (
        <div className={styles.drawIndicator}>
          <span className={styles.pointer}>👆</span>

          <span className={styles.playerLabel}>{expectedPlayerLabel}</span>
        </div>
      )}
    </div>
  );
}
