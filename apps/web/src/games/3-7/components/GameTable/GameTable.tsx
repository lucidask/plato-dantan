import type { ReactNode } from "react";
import styles from "./GameTable.module.css";

type GameTableProps = {
  center: ReactNode;
  drawPile?: ReactNode;
  topInner?: ReactNode;
  bottomInner?: ReactNode;
  topOuter?: ReactNode;
  bottomOuter?: ReactNode;
};

export default function GameTable({
  center,
  drawPile,
  topInner,
  bottomInner,
  topOuter,
  bottomOuter,
}: GameTableProps) {
  return (
    <section className={styles.gameTable}>
      <div className={styles.tableTools}>{drawPile}</div>
      <div className={`${styles.section} ${styles.top}`}>
        <div className={styles.half}>{topOuter ?? "topOuter"}</div>
        <div className={styles.half}>{topInner ?? "topInner"}</div>
      </div>

      <div className={styles.middle}>
        <div className={`${styles.section} ${styles.left}`}>
          <div className={styles.half}>leftOuter</div>
          <div className={styles.half}>leftInner</div>
        </div>

        <div className={`${styles.section} ${styles.center}`}>
          <div className={styles.centerContent}>{center}</div>
        </div>

        <div className={`${styles.section} ${styles.right}`}>
          <div className={styles.half}>rightInner</div>
          <div className={styles.half}>rightOuter</div>
        </div>
      </div>

      <div className={`${styles.section} ${styles.bottom}`}>
        <div className={styles.half}>{bottomInner ?? "bottomInner"}</div>
        <div className={styles.half}>{bottomOuter ?? "bottomOuter"}</div>
      </div>
    </section>
  );
}
