import { createContext, useContext, type ReactNode } from 'react';

interface PrivacyContextValue {
  openPrivacy: () => void;
}

const PrivacyContext = createContext<PrivacyContextValue | undefined>(undefined);

export const PrivacyProvider = ({
  openPrivacy,
  children,
}: {
  openPrivacy: () => void;
  children: ReactNode;
}) => <PrivacyContext.Provider value={{ openPrivacy }}>{children}</PrivacyContext.Provider>;

export const usePrivacy = (): PrivacyContextValue => {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error('usePrivacy must be used within a PrivacyProvider');
  return ctx;
};
