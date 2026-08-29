interface ScoreCardProps {
  score: number;
  label: string;
}

export const ScoreCard = ({ score, label }: ScoreCardProps) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-ink)" strokeOpacity="0.08" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-num text-4xl font-bold text-ink sm:text-5xl">{score}</span>
          <span className="text-xs text-muted">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
};
