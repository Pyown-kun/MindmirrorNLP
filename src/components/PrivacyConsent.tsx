import { useState } from 'react';
import { Lock, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';

interface PrivacyConsentProps {
  onContinue: () => void;
  onDeleteData?: () => void;
  onRequestClose?: () => void;
  showDeleteButton?: boolean;
}

/**
 * A GDPR-style "Privacy & Data" disclosure shown before the user starts
 * (and reachable again any time via the footer link). Explains what is
 * stored, why, for how long, and how to remove it — in plain language,
 * translated for all three supported languages.
 */
export const PrivacyConsent = ({
  onContinue,
  onDeleteData,
  onRequestClose,
  showDeleteButton = false,
}: PrivacyConsentProps) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const points = [
    t.privacy.point1,
    t.privacy.point2,
    t.privacy.point3,
    t.privacy.point4,
    t.privacy.point5,
  ];

  const handleDelete = () => {
    onDeleteData?.();
    setDeleted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
    >
      <div className="w-full max-w-md rounded-[28px] bg-surface p-6 shadow-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Lock className="h-7 w-7 text-primary" />
        </div>

        <h2 id="privacy-title" className="text-center font-display text-xl font-bold text-ink">
          {t.privacy.title}
        </h2>

        <p className="mt-3 text-center text-sm leading-relaxed text-muted">{t.privacy.body}</p>

        {expanded && (
          <div className="mt-5 rounded-2xl bg-mist p-4">
            <p className="mb-2 text-xs font-bold text-ink">{t.privacy.detailsTitle}</p>
            <ul className="space-y-1.5">
              {points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {deleted && (
          <p className="mt-4 rounded-xl bg-aqua/10 px-4 py-2.5 text-center text-sm font-medium text-aqua">
            {t.privacy.deleteConfirm}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <Button fullWidth onClick={onRequestClose ?? onContinue}>
            {onRequestClose ? t.common.continue : t.privacy.continueBtn}
          </Button>

          {showDeleteButton && (
            <Button variant="secondary" fullWidth onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              {t.privacy.deleteData}
            </Button>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-ink"
          >
            {expanded ? t.privacy.hideDetails : t.privacy.showDetails}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
