import type { CSSProperties } from "react";
import type { Card } from "card-core";
import PlayingCard from "../PlayingCard/PlayingCard";
import styles from "./CardMotionLayer.module.css";

type Point = {
  x: number;
  y: number;
};

type CardMotionLayerProps = {
  active: boolean;
  card: Card | null;
  from: Point | null;
  to: Point | null;
  trickCollect?: {
    active: boolean;
    cards: Card[];
    winnerTeamId: string | null;
    to: Point | null;
  };
  drawMotion?: {
    active: boolean;
    from: Point | null;
    to: Point | null;
  };
  dealMotions?: {
    id: string;
    from: Point;
    to: Point;
  }[];
  initialRevealMotion?: {
    active: boolean;
    card: Card | null;
    from: Point | null;
    to: Point | null;
  };

  roundScoringMotion?: {
    active: boolean;

    top: {
      cards: Card[];
      from: Point | null;
      to: Point | null;
    };

    bottom: {
      cards: Card[];
      from: Point | null;
      to: Point | null;
    };
  };
};

export default function CardMotionLayer({
  active,
  card,
  from,
  to,
  trickCollect,
  drawMotion,
  dealMotions,
  initialRevealMotion,
  roundScoringMotion,
}: CardMotionLayerProps) {
  const shouldShowCardMotion = active && card && from && to;
  const shouldShowTrickCollect =
    trickCollect?.active && trickCollect.cards.length > 0;
  const shouldShowDrawMotion =
    drawMotion?.active && drawMotion.from && drawMotion.to;
  const shouldShowDealMotions = dealMotions && dealMotions.length > 0;

  const shouldShowInitialRevealMotion =
    initialRevealMotion?.active &&
    initialRevealMotion.card &&
    initialRevealMotion.from &&
    initialRevealMotion.to;

  const shouldShowRoundScoringMotion =
    roundScoringMotion?.active &&
    (roundScoringMotion.top.cards.length > 0 ||
      roundScoringMotion.bottom.cards.length > 0);

  if (
    !shouldShowCardMotion &&
    !shouldShowTrickCollect &&
    !shouldShowDrawMotion &&
    !shouldShowDealMotions &&
    !shouldShowInitialRevealMotion &&
    !shouldShowRoundScoringMotion
  )
    return null;

  return (
    <div className={styles.layer}>
      {shouldShowCardMotion && (
        <div
          className={styles.cardFace}
          style={
            {
              "--from-x": `${from.x}px`,
              "--from-y": `${from.y}px`,
              "--to-x": `${to.x}px`,
              "--to-y": `${to.y}px`,
            } as CSSProperties
          }
        >
          <PlayingCard card={card} disabled />
        </div>
      )}

      {shouldShowTrickCollect &&
        trickCollect.cards.map((collectCard, index) => (
          <div
            key={`${collectCard.id}-${index}`}
            className={styles.collectCard}
            style={
              {
                "--collect-to-x": `${trickCollect.to?.x ?? window.innerWidth / 2}px`,
                "--collect-to-y": `${trickCollect.to?.y ?? window.innerHeight * 0.9}px`,
                left: "50%",
                top: "50%",
                animationDelay: `${index * 60}ms`,
              } as CSSProperties
            }
          >
            <div className={styles.cardBack} />
          </div>
        ))}
      {shouldShowDrawMotion && (
        <div
          className={styles.drawCard}
          style={
            {
              "--draw-from-x": `${drawMotion.from!.x}px`,
              "--draw-from-y": `${drawMotion.from!.y}px`,
              "--draw-to-x": `${drawMotion.to!.x}px`,
              "--draw-to-y": `${drawMotion.to!.y}px`,
            } as CSSProperties
          }
        >
          <div className={styles.cardBack} />
        </div>
      )}
      {shouldShowDealMotions &&
        dealMotions.map((motion) => (
          <div
            key={motion.id}
            className={styles.dealCard}
            style={
              {
                "--deal-from-x": `${motion.from.x}px`,
                "--deal-from-y": `${motion.from.y}px`,
                "--deal-to-x": `${motion.to.x}px`,
                "--deal-to-y": `${motion.to.y}px`,
              } as CSSProperties
            }
          >
            <div className={styles.cardBack} />
          </div>
        ))}
      {shouldShowInitialRevealMotion && (
        <div
          className={styles.initialRevealCard}
          style={
            {
              "--initial-from-x": `${initialRevealMotion.from!.x}px`,
              "--initial-from-y": `${initialRevealMotion.from!.y}px`,
              "--initial-to-x": `${initialRevealMotion.to!.x}px`,
              "--initial-to-y": `${initialRevealMotion.to!.y}px`,
            } as CSSProperties
          }
        >
          <PlayingCard card={initialRevealMotion.card!} disabled />
        </div>
      )}
      {shouldShowRoundScoringMotion &&
        roundScoringMotion.top.cards.map((collectCard, index) => (
          <div
            key={`round-score-top-${collectCard.id}-${index}`}
            className={styles.roundScoringCollectCard}
            style={
              {
                "--collect-to-x": `${roundScoringMotion.top.to?.x ?? window.innerWidth / 2}px`,
                "--collect-to-y": `${roundScoringMotion.top.to?.y ?? window.innerHeight / 2}px`,
                "--collect-from-x": `${roundScoringMotion.top.from?.x ?? 0}px`,
                "--collect-from-y": `${roundScoringMotion.top.from?.y ?? 0}px`,
                left: `${roundScoringMotion.top.from?.x ?? 0}px`,
                top: `${roundScoringMotion.top.from?.y ?? 0}px`,
                animationDelay: `${index * 35}ms`,
              } as CSSProperties
            }
          >
            <div className={styles.cardBack} />
          </div>
        ))}

      {shouldShowRoundScoringMotion &&
        roundScoringMotion.bottom.cards.map((collectCard, index) => (
          <div
            key={`round-score-bottom-${collectCard.id}-${index}`}
            className={styles.roundScoringCollectCard}
            style={
              {
                "--collect-to-x": `${roundScoringMotion.bottom.to?.x ?? window.innerWidth / 2}px`,
                "--collect-to-y": `${roundScoringMotion.bottom.to?.y ?? window.innerHeight / 2}px`,
                "--collect-from-x": `${roundScoringMotion.bottom.from?.x ?? 0}px`,
                "--collect-from-y": `${roundScoringMotion.bottom.from?.y ?? 0}px`,
                left: `${roundScoringMotion.bottom.from?.x ?? 0}px`,
                top: `${roundScoringMotion.bottom.from?.y ?? 0}px`,
                animationDelay: `${index * 35}ms`,
              } as CSSProperties
            }
          >
            <div className={styles.cardBack} />
          </div>
        ))}
    </div>
  );
}
