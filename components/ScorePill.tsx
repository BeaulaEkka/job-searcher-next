export function ScorePill({ score }: { score: number }) {
  const label = score >= 80 ? "Strong" : score >= 65 ? "Good" : score >= 50 ? "Possible" : "Weak";
  return <span className="badge">{label} match · {score}%</span>;
}
