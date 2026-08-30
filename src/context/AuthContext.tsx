import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type UserRole = 'user' | 'admin';
export interface AuthUser { id: string; email: string; role: UserRole; name: string }

const DEMO_ADMIN: AuthUser = { id: 'admin-001', email: 'admin@mindmirror.demo', role: 'admin', name: 'MindMirror Admin' };
const SESSION_KEY = 'mindmirror-auth-session';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) as AuthUser : null;
    } catch { return null; }
  });

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login: (email, password) => {
      // Demo-only credentials. Production should use SSO/OIDC + server-side RBAC.
      const valid = email.trim().toLowerCase() === 'admin@mindmirror.demo' && password === 'Admin123!';
      if (!valid) return false;
      localStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_ADMIN));
      setUser(DEMO_ADMIN);
      return true;
    },
    logout: () => { localStorage.removeItem(SESSION_KEY); setUser(null); },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
