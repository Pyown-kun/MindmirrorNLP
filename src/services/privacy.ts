export const PRIVACY_CONSENT_KEY = 'mindmirror:privacy-consent';
export const PRIVACY_DATA_KEY = 'mindmirror:training-data';
export const DATA_RETENTION_DAYS = 90;
export const DATA_RETENTION_MS = DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000;

export interface StoredTrainingData<T> {
  savedAt: number;
  expiresAt: number;
  session: T;
  step: string;
}

export const hasPrivacyConsent = (): boolean => {
  try {
    return window.localStorage.getItem(PRIVACY_CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
};

export const acceptPrivacyConsent = (): void => {
  try {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, 'accepted');
  } catch {
    // Storage may be disabled. The app still works in-memory.
  }
};

export const loadTrainingData = <T>(): StoredTrainingData<T> | null => {
  try {
    const raw = window.localStorage.getItem(PRIVACY_DATA_KEY);
    if (!raw) return null;

    const stored = JSON.parse(raw) as StoredTrainingData<T>;
    if (!stored.expiresAt || Date.now() >= stored.expiresAt) {
      window.localStorage.removeItem(PRIVACY_DATA_KEY);
      return null;
    }
    return stored;
  } catch {
    window.localStorage.removeItem(PRIVACY_DATA_KEY);
    return null;
  }
};

export const saveTrainingData = <T>(session: T, step: string): void => {
  try {
    const now = Date.now();
    const stored: StoredTrainingData<T> = {
      savedAt: now,
      expiresAt: now + DATA_RETENTION_MS,
      session,
      step,
    };
    window.localStorage.setItem(PRIVACY_DATA_KEY, JSON.stringify(stored));
  } catch {
    // Storage may be unavailable or full. Keep the session in memory.
  }
};

export const deleteAllPrivacyData = (): void => {
  try {
    window.localStorage.removeItem(PRIVACY_DATA_KEY);
    window.localStorage.removeItem(PRIVACY_CONSENT_KEY);
  } catch {
    // Ignore storage errors; the in-memory session is reset by the caller.
  }
};
