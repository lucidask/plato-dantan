import type { Card } from "card-core";
import { getTeamLabel } from "../../mappers/playerLabels";
import styles from "./PlayerScorePanel.module.css";

type PlayerScorePanelProps = {
  teamId: string;
  score: number;
  wonCards: Card[];
};

const TRIO_RANKS = ["9", "10", "J", "Q", "K"];

function countAces(cards: Card[]) {
  return cards.filter((card) => card.rank === "A").length;
}

function countTrios(cards: Card[]) {
  return Math.floor(
    cards.filter((card) => TRIO_RANKS.includes(card.rank)).length / 3,
  );
}

export default function PlayerScorePanel({
  teamId,
  score,
  wonCards,
}: PlayerScorePanelProps) {
  const aces = countAces(wonCards);
  const trios = countTrios(wonCards);
  const roundTotal = aces + trios;

  return (
    <section className={styles.panel}>
      <strong className={styles.team}>{getTeamLabel(teamId)}</strong>

      <div className={styles.row}>
        <span>Score</span>
        <strong>{score}</strong>
      </div>

      <div className={styles.row}>
        <span>Points manche</span>
        <strong>{roundTotal}</strong>
      </div>

      <div className={styles.details}>
        As: {aces} · Trios: {trios}
      </div>
    </section>
  );
}