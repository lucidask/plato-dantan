import type { Card } from "card-core";
import PlayingCard from "../PlayingCard/PlayingCard";
import styles from "./PlayerHand.module.css";
import { memo, useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";

const SUIT_ORDER = ["clubs", "diamonds", "hearts", "spades"] as const;
const RANK_ORDER = ["7", "8", "J", "Q", "K", "A", "9", "10"] as const;

type PlayerHandProps = {
  cards: Card[];
  disabled?: boolean;
  highlightedCardId?: string | null;
  playableCardIds?: string[];
  hiddenCardId?: string | null;
  orientation?: "bottom" | "top" | "left" | "right";
  onCardClick?: (card: Card, element: HTMLElement) => void;
};

function PlayerHand({
  cards,
  disabled = false,
  highlightedCardId = null,
  playableCardIds,
  orientation = "bottom",
  hiddenCardId,
  onCardClick,
}: PlayerHandProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const handleCardClick = useCallback(
    (card: Card, element: HTMLElement) => {
      if (disabled) return;

      setSelectedCardId(card.id);

      window.setTimeout(() => {
        onCardClick?.(card, element);
        setSelectedCardId(null);
      }, 140);
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
              selectedCardId === card.id ? styles.selected : "",
            ].join(" ")}
            onClick={handleCardClick}
            style={
              {
                "--card-index": index,
                "--card-offset": offset,
                opacity: hiddenCardId === card.id ? 0 : 1,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export default memo(PlayerHand);
