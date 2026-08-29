interface ProgressBarProps {
  label: string;
  value: number;
  icon?: string;
  color?: string;
}

export const ProgressBar = ({ label, value, icon, color = 'var(--color-primary)' }: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">
          {icon && <span className="mr-1.5">{icon}</span>}
          {label}
        </span>
        <span className="font-mono-num font-semibold text-ink">{clamped}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
