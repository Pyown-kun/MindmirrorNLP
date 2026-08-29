import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  acceptPrivacyConsent,
  deleteAllPrivacyData,
  hasPrivacyConsent,
} from '../services/privacy';

interface PrivacyContextValue {
  hasConsent: boolean;
  isNoticeOpen: boolean;
  accept: () => void;
  openNotice: () => void;
  closeNotice: () => void;
  deleteData: () => void;
}

const PrivacyContext = createContext<PrivacyContextValue | undefined>(undefined);

export const PrivacyProvider = ({ children }: { children: ReactNode }) => {
  const [hasConsent, setHasConsent] = useState<boolean>(() => hasPrivacyConsent());
  const [isNoticeOpen, setIsNoticeOpen] = useState<boolean>(() => !hasPrivacyConsent());

  const accept = useCallback(() => {
    acceptPrivacyConsent();
    setHasConsent(true);
    setIsNoticeOpen(false);
  }, []);

  const deleteData = useCallback(() => {
    deleteAllPrivacyData();
    setHasConsent(false);
    setIsNoticeOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      hasConsent,
      isNoticeOpen,
      accept,
      openNotice: () => setIsNoticeOpen(true),
      closeNotice: () => setIsNoticeOpen(false),
      deleteData,
    }),
    [hasConsent, isNoticeOpen, accept, deleteData]
  );

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
};

export const usePrivacy = (): PrivacyContextValue => {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error('usePrivacy must be used within a PrivacyProvider');
  return ctx;
};
