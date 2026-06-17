import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

interface CookieContextType {
  consent: CookieConsent;
  hasConsented: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  updateConsent: (consent: Partial<CookieConsent>) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const STORAGE_KEY = 'dt-cookie-consent';

const defaultConsent: CookieConsent = {
  necessary: true,
  functional: false,
  analytics: false,
};

const CookieContext = createContext<CookieContextType | null>(null);

function loadConsent(): { consent: CookieConsent; hasConsented: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CookieConsent;
      return { consent: { ...parsed, necessary: true }, hasConsented: true };
    }
  } catch {
    // corrupted storage – treat as no consent
  }
  return { consent: defaultConsent, hasConsented: false };
}

function saveConsent(consent: CookieConsent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(loadConsent);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const acceptAll = useCallback(() => {
    const consent: CookieConsent = { necessary: true, functional: true, analytics: true };
    saveConsent(consent);
    setState({ consent, hasConsented: true });
  }, []);

  const acceptNecessary = useCallback(() => {
    const consent: CookieConsent = { necessary: true, functional: false, analytics: false };
    saveConsent(consent);
    setState({ consent, hasConsented: true });
  }, []);

  const updateConsent = useCallback((partial: Partial<CookieConsent>) => {
    setState(prev => {
      const consent: CookieConsent = { ...prev.consent, ...partial, necessary: true };
      saveConsent(consent);
      return { consent, hasConsented: true };
    });
  }, []);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  return (
    <CookieContext.Provider
      value={{
        consent: state.consent,
        hasConsented: state.hasConsented,
        acceptAll,
        acceptNecessary,
        updateConsent,
        isSettingsOpen,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent(): CookieContextType {
  const ctx = useContext(CookieContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieProvider');
  return ctx;
}
