import type { Card } from "card-core";
import PlayingCard from "../PlayingCard/PlayingCard";
import styles from "./PlayerHand.module.css";
import { memo, useCallback, useMemo } from "react";
import type { CSSProperties } from "react";

const SUIT_ORDER = ["clubs", "diamonds", "hearts", "spades"] as const;
const RANK_ORDER = ["7", "8", "J", "Q", "K", "A", "9", "10"] as const;

type PlayerHandProps = {
  cards: Card[];
  disabled?: boolean;
  highlightedCardId?: string | null;
  playableCardIds?: string[]; 
  orientation?: "bottom" | "top" | "left" | "right";
  onCardClick?: (card: Card) => void;
};

function PlayerHand({
  cards,
  disabled = false,
  highlightedCardId = null,
  playableCardIds,
  orientation = "bottom",
  onCardClick,
}: PlayerHandProps) {
  const handleCardClick = useCallback(
    (card: Card) => {
      if (disabled) return;
      onCardClick?.(card);
    },
    [disabled, onCardClick],
  );

  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      const suitDiff =
        SUIT_ORDER.indexOf(a.suit as (typeof SUIT_ORDER)[number]) -
        SUIT_ORDER.indexOf(b.suit as (typeof SUIT_ORDER)[number]);

      if (suitDiff !== 0) return suitDiff;

      return (
        RANK_ORDER.indexOf(a.rank as (typeof RANK_ORDER)[number]) -
        RANK_ORDER.indexOf(b.rank as (typeof RANK_ORDER)[number])
      );
    });
  }, [cards]);

  return (
    <div className={`${styles.hand} ${styles[orientation]}`}>
      {sortedCards.map((card, index) => {
        const middle = (sortedCards.length - 1) / 2;
        const offset = index - middle;
        const hasPlayableRestriction = playableCardIds !== undefined;
        const isPlayable =
          !hasPlayableRestriction || playableCardIds.includes(card.id);

        return (
          <PlayingCard
            key={card.id}
            card={card}
            disabled={disabled || !isPlayable}
            className={[
              styles.cardInHand,
              hasPlayableRestriction && isPlayable ? styles.playable : "",
              highlightedCardId === card.id ? styles.recentlyDrawn : "",
            ].join(" ")}
            onClick={handleCardClick}
            style={
              {
                "--card-index": index,
                "--card-offset": offset,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export default memo(PlayerHand);
