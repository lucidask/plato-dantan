type ScoreBoardProps = {
  scores: Record<string, number>;
};

export default function ScoreBoard({ scores }: ScoreBoardProps) {
  return (
    <section style={{ width: "100%", boxSizing: "border-box" }}>
      <h2>Scores</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
          width: "100%",
        }}
      >
        {Object.entries(scores).map(([teamId, score]) => (
          <div
            key={teamId}
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <strong>{teamId}</strong>
            <div>{score} point(s)</div>
          </div>
        ))}
      </div>
    </section>
  );
}