import { LockKeyhole, ShieldCheck, Trash2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePrivacy } from '../context/PrivacyContext';
import { useTraining } from '../context/TrainingContext';

export const PrivacyNotice = () => {
  const { t } = useLanguage();
  const { hasConsent, isNoticeOpen, accept, closeNotice, openNotice, deleteData } = usePrivacy();
  const { resetSession } = useTraining();

  const handleDeleteData = () => {
    resetSession();
    deleteData();
  };

  if (!isNoticeOpen) {
    return (
      <button
        type="button"
        onClick={openNotice}
        className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-semibold text-ink shadow-lg backdrop-blur transition hover:bg-white"
      >
        {t.privacy.title}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        className="relative w-full max-w-[540px] max-h-[calc(100vh-48px)] overflow-y-auto rounded-[26px] bg-white p-7 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={closeNotice}
          aria-label={t.privacy.close}
          className="absolute right-5 top-5 rounded-full p-2 text-muted transition hover:bg-mist hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center text-ink">
          <LockKeyhole className="h-14 w-14 stroke-[1.8]" />
        </div>

        <h2 id="privacy-title" className="mt-4 text-center font-display text-2xl font-bold text-ink sm:text-[27px]">
          {t.privacy.title}
        </h2>

        <p className="mt-7 text-[16px] leading-7 text-muted">
          {t.privacy.intro}
        </p>

        <div className="mt-7 rounded-2xl bg-[#F8F9FA] p-5 sm:p-6">
          <p className="font-display text-[15px] font-bold text-ink">
            {t.privacy.detailTitle}
          </p>
          <ul className="mt-3 space-y-3 text-[15px] leading-6 text-muted">
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted/70" />
              <span>{t.privacy.anonymous}</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted/70" />
              <span>{t.privacy.reflectionOnly}</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted/70" />
              <span>{t.privacy.retention}</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted/70" />
              <span>{t.privacy.deleteAnytime}</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted/70" />
              <span>{t.privacy.noProfiling}</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={accept}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-aqua px-5 text-base font-semibold text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]"
          >
            <ShieldCheck className="h-5 w-5" />
            {hasConsent ? t.privacy.saveAndContinue : t.privacy.continue}
          </button>

          {hasConsent && (
            <button
              type="button"
              onClick={handleDeleteData}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-rose/25 px-5 text-sm font-semibold text-rose transition hover:bg-rose/5"
            >
              <Trash2 className="h-4 w-4" />
              {t.privacy.deleteData}
            </button>
          )}

          <button
            type="button"
            onClick={closeNotice}
            className="min-h-10 w-full text-sm font-medium text-ink transition hover:text-primary"
          >
            {t.privacy.closeDetails}
          </button>
        </div>
      </div>
    </div>
  );
};
