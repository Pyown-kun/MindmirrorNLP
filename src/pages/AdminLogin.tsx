import type { FormEvent } from 'react';
import { useState } from 'react';
import { ArrowRight, BookOpen, LockKeyhole, ShieldCheck } from 'lucide-react';

const ADMIN_SESSION_KEY = 'mindmirror-admin-session';

export const isAdminAuthenticated = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
export const logoutAdmin = () => sessionStorage.removeItem(ADMIN_SESSION_KEY);

export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    // Demo authentication only. Replace with a real auth provider/backend for production.
    if (email.trim().toLowerCase() === 'admin@mindmirror.demo' && password === 'mindmirror') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      onLogin();
      return;
    }

    setError('Email atau password admin tidak sesuai.');
  };

  return (
    <div className="min-h-screen bg-mist px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-black/5 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <BookOpen className="h-7 w-7" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">MindMirror CMS</p>
            <h1 className="mt-2 font-display text-3xl font-bold">Admin Sign In</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">Sign in first to access the Curriculum Management Portal.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Admin Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@mindmirror.demo"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  required
                />
              </div>
            </label>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark">
              Sign In to Admin Portal <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-primary/5 p-4 text-xs leading-relaxed text-muted">
            <div className="flex items-center gap-2 font-semibold text-ink"><ShieldCheck className="h-4 w-4 text-primary" /> Demo access</div>
            <p className="mt-2">Email: <strong>admin@mindmirror.demo</strong><br />Password: <strong>mindmirror</strong></p>
            <p className="mt-2">This is local demo authentication. Production deployments should connect this screen to a secure authentication service.</p>
          </div>

          <button onClick={() => { window.location.href = '/'; }} className="mt-6 w-full text-center text-sm font-semibold text-muted hover:text-ink">Back to Participant App</button>
        </div>
      </div>
    </div>
  );
};
