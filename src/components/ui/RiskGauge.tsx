import { useEffect, useState } from 'react';

export function RiskGauge({ score, animate = true }: { score: number; animate?: boolean }) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) { setDisplayScore(score); return; }
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(score * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, animate]);

  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (displayScore / 100) * circ;

  let color = '#10b981';
  if (displayScore >= 75) color = '#ef4444';
  else if (displayScore >= 55) color = '#f97316';
  else if (displayScore >= 30) color = '#f59e0b';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold" style={{ color }}>{displayScore}</span>
        <span className="text-xs font-medium text-ink-400">/ 100</span>
      </div>
    </div>
  );
}
