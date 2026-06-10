export function scoreColor(score: number): string {
  if (score >= 85) return "#34d399";
  if (score >= 70) return "#a3e635";
  if (score >= 55) return "#facc15";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

export function ScoreDial({
  score,
  grade,
  size = 180,
}: {
  score: number;
  grade: string;
  size?: number;
}) {
  const stroke = size * 0.07;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  const color = scoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#26263a"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="font-bold tabular-nums leading-none"
          style={{ fontSize: size * 0.3, color }}
        >
          {score}
        </div>
        <div
          className="mt-1 font-semibold text-white/60"
          style={{ fontSize: size * 0.11 }}
        >
          Grade {grade}
        </div>
      </div>
    </div>
  );
}
