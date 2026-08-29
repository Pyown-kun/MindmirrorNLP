import type { ReactNode } from 'react';
import { LanguageSelector } from '../LanguageSelector';
import { ProgressStepper } from '../ProgressStepper';
import { useTraining } from '../../context/TrainingContext';

interface PageShellProps {
  children: ReactNode;
  wide?: boolean;
  showBrand?: boolean;
}

export const PageShell = ({ children, wide = false, showBrand = false }: PageShellProps) => {
  const { step } = useTraining();

  return (
    <div className="flex min-h-screen w-full flex-col bg-mist">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 0%, rgba(75,74,207,0.10), transparent), radial-gradient(50% 40% at 100% 100%, rgba(31,174,155,0.08), transparent)',
        }}
      />

      <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
        {showBrand ? (
          <div className="font-display text-lg font-bold text-ink">MindMirror</div>
        ) : (
          <div className="hidden sm:block" />
        )}
        <LanguageSelector compact />
      </header>

      {step !== 'welcome' && (
        <div className="px-4 pb-2 sm:px-8">
          <ProgressStepper step={step} />
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-4 pb-10 pt-4 sm:px-8">
        <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>{children}</div>
      </main>
    </div>
  );
};
