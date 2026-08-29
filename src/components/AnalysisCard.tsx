import { AlertTriangle } from 'lucide-react';
import type { PatternType } from '../types/training';

interface AnalysisCardProps {
  type: PatternType;
  label: string;
  matchedText: string;
  sourceSentence: string;
  tip: string;
  detectedLabel: string;
}

const ACCENT: Record<PatternType, string> = {
  generalization: 'border-amber/30 bg-amber/5 text-amber',
  judgment: 'border-rose/30 bg-rose/5 text-rose',
  assumption: 'border-primary/30 bg-primary/5 text-primary',
};

export const AnalysisCard = ({ label, matchedText, sourceSentence, tip, type, detectedLabel }: AnalysisCardProps) => {
  return (
    <div className={`rounded-2xl border p-5 ${ACCENT[type]}`}>
      <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide">
        <AlertTriangle className="h-4 w-4" />
        {label}
      </div>
      <p className="mb-2 font-display text-base font-semibold text-ink">"{sourceSentence}"</p>
      <p className="text-sm text-muted leading-relaxed">{tip}</p>
      <p className="mt-2 text-xs text-muted/70">
        {detectedLabel}: <span className="font-mono-num font-medium">{matchedText}</span>
      </p>
    </div>
  );
};
