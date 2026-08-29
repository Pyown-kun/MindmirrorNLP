import type { LucideIcon } from 'lucide-react';

interface TrainingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  disabled?: boolean;
  disabledLabel?: string;
  onClick: () => void;
}

export const TrainingCard = ({
  icon: Icon,
  title,
  description,
  disabled = false,
  disabledLabel,
  onClick,
}: TrainingCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-3xl border p-6 text-left transition-all duration-150 ${
        disabled
          ? 'border-ink/10 bg-ink/[0.03] cursor-default'
          : 'border-ink/10 bg-white hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 active:translate-y-0'
      }`}
    >
      {disabled && disabledLabel && (
        <span className="absolute right-4 top-4 rounded-full bg-amber/15 px-3 py-1 text-xs font-semibold text-amber">
          {disabledLabel}
        </span>
      )}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
          disabled ? 'bg-ink/10 text-muted' : 'bg-primary/10 text-primary'
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className={`mb-1.5 font-display text-lg font-semibold ${disabled ? 'text-muted' : 'text-ink'}`}>
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </button>
  );
};
