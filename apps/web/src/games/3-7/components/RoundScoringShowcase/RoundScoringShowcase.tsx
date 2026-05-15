import PlayingCard from "../PlayingCard/PlayingCard";
import styles from "./RoundScoringShowcase.module.css";

type Props = {
  topCards: any[];
  bottomCards: any[];
  topScore: number;
  bottomScore: number;
  onNextRound: () => void;
  showcaseRef?: React.RefObject<HTMLDivElement | null>;
};

export default function RoundScoringShowcase({
  topCards,
  bottomCards,
  topScore,
  bottomScore,
  onNextRound,
  showcaseRef,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 18,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateRows: "1fr auto 1fr",
        gap: 12,
      }}
        ref={showcaseRef}
    >
      <div className={styles.cardsRow}>
        {topCards.map((card, index) => (
          <div
            key={card.id}
            className={styles.scoreCardWrapper}
            style={{
              marginLeft: index === 0 ? 0 : -20,
              zIndex: index,
              animationDelay: `${index * 35}ms`,
            }}
          >
            <div style={{ transform: "scale(0.82)" }}>
              <PlayingCard card={card} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <h3>Fin de manche</h3>
        <p>Joueur 2 : {topScore} pts</p>
        <p>Joueur 1 : {bottomScore} pts</p>

        <button onClick={onNextRound}>Manche suivante</button>
      </div>

      <div className={styles.cardsRow}>
        {bottomCards.map((card, index) => (
          <div
            key={card.id}
            className={styles.scoreCardWrapper}
            style={{
              marginLeft: index === 0 ? 0 : -20,
              zIndex: index,
              animationDelay: `${index * 35}ms`,
            }}
          >
            <div style={{ transform: "scale(0.82)" }}>
              <PlayingCard card={card} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
