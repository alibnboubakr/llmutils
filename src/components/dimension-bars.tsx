import { scoreColor } from "./score-dial";

export function DimensionBars({
  items,
}: {
  items: Array<{ label: string; score: number }>;
}) {
  return (
    <div className="grid gap-2.5">
      {items.map((d) => (
        <div key={d.label} className="grid grid-cols-[130px_1fr_36px] items-center gap-3 text-sm">
          <span className="truncate text-white/70">{d.label}</span>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full"
              style={{
                width: `${d.score}%`,
                background: scoreColor(d.score),
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span className="text-right tabular-nums text-white/50">
            {d.score}
          </span>
        </div>
      ))}
    </div>
  );
}
