import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '../../context/CookieContext';
import type { CookieConsent } from '../../context/CookieContext';
import styles from './CookieBanner.module.css';

interface CookieBannerProps {
  onNavigateDatenschutz: () => void;
}

export default function CookieBanner({ onNavigateDatenschutz }: CookieBannerProps) {
  const {
    consent,
    hasConsented,
    acceptAll,
    acceptNecessary,
    updateConsent,
    isSettingsOpen,
    closeSettings,
  } = useCookieConsent();

  const [local, setLocal] = useState<CookieConsent>(consent);

  useEffect(() => {
    if (isSettingsOpen) setLocal(consent);
  }, [isSettingsOpen, consent]);

  const handleSave = () => {
    updateConsent(local);
    closeSettings();
  };

  const handleDatenschutz = () => {
    closeSettings();
    onNavigateDatenschutz();
  };

  return (
    <>
      {!hasConsented && (
        <div className={styles.banner} role="dialog" aria-label="Cookie-Banner">
          <div className={styles.bannerInner}>
            <p className={styles.bannerText}>
              Wir verwenden Cookies, um Ihnen ein bestmögliches Erlebnis zu bieten.
              Weitere Informationen finden Sie in unserer{' '}
              <a onClick={handleDatenschutz}>Datenschutzerklärung</a>.
            </p>
            <div className={styles.bannerButtons}>
              <button className={styles.btnNecessary} onClick={acceptNecessary}>
                Nur notwendige
              </button>
              <button className={styles.btnAcceptAll} onClick={acceptAll}>
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className={styles.overlay} onClick={closeSettings}>
          <div
            className={styles.modal}
            role="dialog"
            aria-label="Cookie-Einstellungen"
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.btnClose} onClick={closeSettings} aria-label="Schließen">
              ×
            </button>

            <h2 className={styles.modalTitle}>Cookie-Einstellungen</h2>
            <p className={styles.modalDesc}>
              Wählen Sie, welche Cookies Sie zulassen möchten. Notwendige Cookies
              können nicht deaktiviert werden.{' '}
              <a onClick={handleDatenschutz}>Datenschutzerklärung</a>
            </p>

            <div className={styles.categoryList}>
              <div className={styles.category}>
                <div className={styles.categoryInfo}>
                  <div className={styles.categoryName}>Notwendig</div>
                  <div className={styles.categoryDesc}>
                    Erforderlich für grundlegende Funktionen wie Navigation und Sicherheit.
                  </div>
                  <div className={styles.alwaysOn}>Immer aktiv</div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" className={styles.toggleInput} checked disabled />
                  <span className={styles.toggleSlider} />
                </label>
              </div>

              <div className={styles.category}>
                <div className={styles.categoryInfo}>
                  <div className={styles.categoryName}>Funktional</div>
                  <div className={styles.categoryDesc}>
                    Erweiterte Funktionen wie eingebettete Inhalte und Kartendienste.
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    className={styles.toggleInput}
                    checked={local.functional}
                    onChange={e => setLocal(p => ({ ...p, functional: e.target.checked }))}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </div>

              <div className={styles.category}>
                <div className={styles.categoryInfo}>
                  <div className={styles.categoryName}>Analyse</div>
                  <div className={styles.categoryDesc}>
                    Helfen uns zu verstehen, wie Besucher die Website nutzen.
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    className={styles.toggleInput}
                    checked={local.analytics}
                    onChange={e => setLocal(p => ({ ...p, analytics: e.target.checked }))}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </div>
            </div>

            <div className={styles.modalButtons}>
              <button
                className={styles.btnNecessary}
                onClick={() => { acceptNecessary(); closeSettings(); }}
              >
                Nur notwendige
              </button>
              <button className={styles.btnAcceptAll} onClick={handleSave}>
                Auswahl speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
