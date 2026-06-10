"use client";

import { useEffect, useRef, useState } from "react";

export function scoreColor(score: number): string {
  if (score >= 85) return "#34d399";
  if (score >= 70) return "#a3e635";
  if (score >= 55) return "#facc15";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

// Animates the displayed number toward the target so live re-grading
// feels like a meter moving, not text flickering.
function useCountUp(target: number, duration = 350): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      setDisplay(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
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
  const displayed = useCountUp(score);
  const stroke = size * 0.07;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  const color = scoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ filter: `drop-shadow(0 0 ${size * 0.08}px ${color}55)` }}
      >
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
          style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="font-bold tabular-nums leading-none"
          style={{ fontSize: size * 0.3, color, transition: "color 0.5s ease" }}
        >
          {displayed}
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
