import type { Game37Action, Game37State } from "game-3-7";
import { getTeamLabel } from "../../mappers/playerLabels";
import styles from "./RoundControlPanel.module.css";

type RoundControlPanelProps = {
  state: Game37State;
  dispatch: (action: Game37Action) => void;
};

export default function RoundControlPanel({
  state,
  dispatch,
}: RoundControlPanelProps) {
  if (
    state.phase !== "round_scoring" &&
    state.phase !== "round_transition" &&
    state.phase !== "match_end"
  ) {
    return null;
  }

  return (
    <section className={styles.panel}>
      
      {state.phase === "round_transition" && (
        <>
          <h3 className={styles.title}>Scores après manche</h3>

          <div className={styles.scores}>
            {Object.entries(state.scoreByTeam).map(([teamId, score]) => (
              <div key={teamId} className={styles.scoreRow}>
                <span>{getTeamLabel(teamId)}</span>
                <strong>{score}</strong>
              </div>
            ))}
          </div>

          <button
            className={styles.button}
            onClick={() => dispatch({ type: "next_round" })}
          >
            Manche suivante
          </button>
        </>
      )}

      {state.phase === "match_end" && (
        <h3 className={styles.title}>
          Victoire :{" "}
          {state.winnerTeamId
            ? getTeamLabel(state.winnerTeamId)
            : "équipe inconnue"}
        </h3>
      )}
    </section>
  );
}