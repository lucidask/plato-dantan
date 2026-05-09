import type { ReactNode } from "react";
import styles from "./GameTable.module.css";

type GameTableProps = {
  center: ReactNode;
  drawPile?: ReactNode;
  topScore?: ReactNode;
  bottomScore?: ReactNode;
  topCard?: ReactNode;
  bottomCard?: ReactNode;
  topPile?: ReactNode;
  bottomPile?: ReactNode;
};

export default function GameTable({
  center,
  drawPile,
  topScore,
  bottomScore,
  topCard,
  bottomCard,
  topPile,
  bottomPile,
}: GameTableProps) {
  return (
    <section className={styles.gameTable}>
      <div className={styles.tableTools}>{drawPile}</div>
      <div className={`${styles.section} ${styles.top}`}>
        <div className={styles.pileSlot}>{topPile ?? "topPile"}</div>
        <div className={styles.half}>{topCard ?? "topCard"}</div>
        <div className={styles.half}>{topScore ?? "topScore"}</div>
      </div>

      <div className={styles.middle}>
        <div className={`${styles.section} ${styles.left}`}>
          <div className={styles.half}>leftScore</div>
          <div className={styles.half}>leftCard</div>
          <div className={styles.pileSlot}>leftPile</div>
        </div>
        <div className={`${styles.section} ${styles.center}`}>
          <div className={styles.centerContent}>{center}</div>
        </div>

        <div className={`${styles.section} ${styles.right}`}>
          <div className={styles.pileSlot}>rightPile</div>
          <div className={styles.half}>rightCard</div>
          <div className={styles.half}>rightScore</div>
        </div>
      </div>

      <div className={`${styles.section} ${styles.bottom}`}>
        <div className={styles.half}>{bottomScore ?? "bottomScore"}</div>
        <div className={styles.half}>{bottomCard ?? "bottomCard"}</div>

        <div className={styles.pileSlot}>{bottomPile ?? "bottomPile"}</div>
      </div>
    </section>
  );
}
