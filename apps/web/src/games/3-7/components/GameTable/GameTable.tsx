import styles from "./GameTable.module.css";

type GameTableProps = {
  top: React.ReactNode;
  center: React.ReactNode;
  bottom: React.ReactNode;
  tableRight?: React.ReactNode;
  sidebar?: React.ReactNode;
};

export default function GameTable({
  top,
  center,
  bottom,
  tableRight,
  sidebar,
}: GameTableProps) {
  return (
    <section className={styles.gameTable}>
      <main className={styles.playArea}>
        <div className={styles.topZone}>{top}</div>
        <div className={styles.centerZone}>
          <div className={styles.centerContent}>{center}</div>

          {tableRight && <div className={styles.tableRight}>{tableRight}</div>}
        </div>
        <div className={styles.bottomZone}>{bottom}</div>
      </main>

      {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
    </section>
  );
}
