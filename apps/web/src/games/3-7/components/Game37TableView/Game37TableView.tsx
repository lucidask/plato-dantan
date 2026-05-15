import GameTable from "../GameTable/GameTable";
import TrickArea from "../TrickArea/TrickArea";
import InitialRevealArea from "../InitialRevealArea/InitialRevealArea";
import RoundControlPanel from "../RoundControlPanel/RoundControlPanel";
import TrouverFlag from "../TrouverFlag/TrouverFlag";
import DrawPile from "../DrawPile/DrawPile";
import PlayerHand from "../PlayerHand/PlayerHand";
import PlayerScorePanel from "../PlayerScorePanel/PlayerScorePanel";
import WonPile from "../WonPile/WonPile";

import { getPlayerLabel } from "../../mappers/playerLabels";

type Props = {
  state: any;
  dispatch: any;

  centerRef: React.RefObject<HTMLDivElement | null>;

  initialRevealCenterRef: React.RefObject<HTMLDivElement | null>;

  drawPileRef: React.RefObject<HTMLDivElement | null>;

  topHandRef: React.RefObject<HTMLDivElement | null>;
  bottomHandRef: React.RefObject<HTMLDivElement | null>;

  topWonPileRef: React.RefObject<HTMLDivElement | null>;
  bottomWonPileRef: React.RefObject<HTMLDivElement | null>;

  shouldShowInitialReveal: boolean;
  shouldShowTableControls: boolean;

  expectedInitialRevealPlayerId: string | null;

  latestTrouverEvent: any;

  visibleDrawPileCount: number;

  expectedDrawPlayerId: string | null;

  canDraw: boolean;

  handleRevealInitialCard: (
    playerId: string,
    element: HTMLElement,
  ) => void;

  handleDrawCard: (element: HTMLElement) => void;

  handlePlayCard: (
    playerId: string,
    card: any,
    element: HTMLElement,
  ) => void;

  highlightedCardId: string | null;

  playableCardIdsP1?: string[];
  playableCardIdsP2?: string[];

  hiddenCardId: string | null;

  isDealing: boolean;

  dealingVisibleCount: {
    "player-1": number;
    "player-2": number;
  };

  trickCollectMotion: any;

  getVisibleWonCards: (
    teamId: string,
  ) => any[];
};

export default function Game37TableView({
  state,
  dispatch,

  centerRef,
  initialRevealCenterRef,
  drawPileRef,

  topHandRef,
  bottomHandRef,

  topWonPileRef,
  bottomWonPileRef,

  shouldShowInitialReveal,
  shouldShowTableControls,

  expectedInitialRevealPlayerId,

  latestTrouverEvent,

  visibleDrawPileCount,

  expectedDrawPlayerId,

  canDraw,

  handleRevealInitialCard,
  handleDrawCard,
  handlePlayCard,

  highlightedCardId,

  playableCardIdsP1,
  playableCardIdsP2,

  hiddenCardId,

  isDealing,
  dealingVisibleCount,

  getVisibleWonCards,
}: Props) {
  return (
    <GameTable
      center={
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          ref={centerRef}
        >
          {shouldShowInitialReveal ? (
            <div
              ref={initialRevealCenterRef}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InitialRevealArea
                reveal={state.initialReveal}
                expectedPlayerId={expectedInitialRevealPlayerId}
                onRevealCard={handleRevealInitialCard}
              />
            </div>
          ) : state.phase === "round_scoring" ||
            state.phase === "round_transition" ||
            state.phase === "match_end" ? (
            <RoundControlPanel state={state} dispatch={dispatch} />
          ) : (
            <TrickArea
              cards={state.currentTrick}
              playerCount={state.config.playerCount}
            />
          )}

          {latestTrouverEvent &&
            state.phase !== "round_scoring" &&
            state.phase !== "round_transition" &&
            state.phase !== "match_end" && (
              <TrouverFlag
                position={
                  latestTrouverEvent.payload.playerId === "player-2"
                    ? "top"
                    : "bottom"
                }
              />
            )}
        </div>
      }
      drawPile={
        !shouldShowInitialReveal && shouldShowTableControls ? (
          <div ref={drawPileRef}>
            <DrawPile
              count={visibleDrawPileCount}
              expectedPlayerLabel={
                expectedDrawPlayerId
                  ? getPlayerLabel(expectedDrawPlayerId)
                  : undefined
              }
              disabled={!canDraw}
              onDraw={handleDrawCard}
            />
          </div>
        ) : null
      }
      topScore={
        <PlayerScorePanel
          teamId="team-2"
          score={state.scoreByTeam["team-2"] || 0}
          wonCards={state.wonCardsByOwner["team-2"] || []}
        />
      }
      bottomScore={
        <PlayerScorePanel
          teamId="team-1"
          score={state.scoreByTeam["team-1"] || 0}
          wonCards={state.wonCardsByOwner["team-1"] || []}
        />
      }
      topCard={
        <div ref={topHandRef} style={{ width: "100%", height: "100%" }}>
          <PlayerHand
            cards={
              isDealing
                ? (state.hands["player-2"] || []).slice(
                    0,
                    dealingVisibleCount["player-2"],
                  )
                : state.hands["player-2"] || []
            }
            disabled={
              isDealing ||
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-2"
            }
            orientation="top"
            highlightedCardId={highlightedCardId}
            playableCardIds={playableCardIdsP2}
            onCardClick={(card, element) =>
              handlePlayCard("player-2", card, element)
            }
            hiddenCardId={hiddenCardId}
          />
        </div>
      }
      bottomCard={
        <div ref={bottomHandRef} style={{ width: "100%", height: "100%" }}>
          <PlayerHand
            cards={
              isDealing
                ? (state.hands["player-1"] || []).slice(
                    0,
                    dealingVisibleCount["player-1"],
                  )
                : state.hands["player-1"] || []
            }
            disabled={
              isDealing ||
              state.phase !== "trick_play" ||
              state.currentPlayerId !== "player-1"
            }
            orientation="bottom"
            highlightedCardId={highlightedCardId}
            playableCardIds={playableCardIdsP1}
            onCardClick={(card, element) =>
              handlePlayCard("player-1", card, element)
            }
            hiddenCardId={hiddenCardId}
          />
        </div>
      }
      topPile={
        <div ref={topWonPileRef}>
          <WonPile cards={getVisibleWonCards("team-2")} />
        </div>
      }
      bottomPile={
        <div ref={bottomWonPileRef}>
          <WonPile cards={getVisibleWonCards("team-1")} />
        </div>
      }
    />
  );
}