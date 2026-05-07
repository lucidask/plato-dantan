import type { Game37State } from "game-3-7";
import styles from "./GameStatusBar.module.css";
import { getPlayerLabel } from "../../mappers/playerLabels";

type GameStatusBarProps = {
  state: Game37State;
};

function getPhaseLabel(state: Game37State) {
  switch (state.phase) {
    case "initial_card_reveal":
      return "Révélation initiale";
    case "round_setup":
      return "Préparation de la manche";
    case "trick_play":
      return `Tour de ${
        state.currentPlayerId ? getPlayerLabel(state.currentPlayerId) : "..."
      }`;
    case "trick_resolution":
      return "Résolution du pli";
    case "draw_phase": {
      const expectedPlayer =
        state.drawContext?.expectedOrder[state.drawContext.currentIndex] ??
        "...";

      return `Pioche : ${expectedPlayer} doit piocher`;
    }
    case "round_scoring":
      return "Calcul des points";
    case "round_transition":
      return "Transition vers la prochaine manche";
    case "match_end":
      return "Match terminé";
    default:
      return state.phase;
  }
}

export default function GameStatusBar({ state }: GameStatusBarProps) {
  return (
    <section className={styles.statusBar}>
      <div>
        <span className={styles.label}>État du jeu</span>
        <strong className={styles.value}>{getPhaseLabel(state)}</strong>
      </div>

      <div>
        <span className={styles.label}>Premier joueur</span>
        <strong className={styles.value}>
          {state.firstRoundStarterId ? getPlayerLabel(state.firstRoundStarterId) : "non déterminé"}
        </strong>
      </div>
    </section>
  );
}
