type ScoreBoardProps = {
  scores: Record<string, number>;
};

export default function ScoreBoard({ scores }: ScoreBoardProps) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Scores</h2>

      <div style={{ display: "flex", gap: 16 }}>
        {Object.entries(scores).map(([teamId, score]) => (
          <div
            key={teamId}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              borderRadius: 8,
              minWidth: 120,
            }}
          >
            <strong>{teamId}</strong>
            <div>{score} point(s)</div>
          </div>
        ))}
      </div>
    </div>
  );
}