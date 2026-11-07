/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Screen } from '../types';
import { SCREEN_PATHS, SCREEN_META } from '../routes';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useCookieConsent } from '../context/CookieContext';
import { trackPhoneCallClick } from '../utils/gtag';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { openSettings } = useCookieConsent();

  const handleNavClick = (screen: Screen) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(screen);
  };

  return (
    <footer role="contentinfo" className="relative mt-auto border-t-2 border-gold-primary/30 bg-void-black text-cream-parchment/80 pt-16 pb-12">
      {/* Visual top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gold-primary/20" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col space-y-4">
            <a 
              id="ftr-logo"
              href={SCREEN_PATHS[Screen.HOME]}
              onClick={handleNavClick(Screen.HOME)}
              title="Drachen Taverne Zittau – Zur Startseite"
              className="font-cinzel text-3xl font-extrabold tracking-widest text-gold-primary cursor-pointer hover:text-gold-bright transition-all"
            >
              DRACHEN TAVERNE
            </a>
            <p className="font-serif text-sm leading-relaxed max-w-xs text-cream-parchment/60">
              Dein mittelalterliches Erlebnis-Restaurant in Zittau: Edle Speisen und kräftige Tränke, zubereitet nach uralten Rezepten aus den tiefsten Gewölben unserer Taverne.
            </p>
            <div className="pt-4 text-xs font-mono text-gold-secondary/80">
              © MMXXVI Drachen Taverne. Alle Rechte vorbehalten.
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-4">
            <h4 id="ftr-hdr-kontakt" className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-primary border-b border-gold-secondary/20 pb-2">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gold-primary shrink-0" />
                <a 
                  href="tel:035835495389" 
                  onClick={trackPhoneCallClick}
                  className="font-serif font-bold text-gold-bright hover:text-gold-primary hover:underline transition-colors"
                  title="Telefonisch kontaktieren: 03583 5495389"
                >
                  Telefon: 03583 5495389
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold-secondary shrink-0" />
                <a
                  href="mailto:drakzittau@dlr-gastro-event.de"
                  className="font-serif hover:text-gold-bright transition-colors"
                  title="E-Mail an die Drachen Taverne senden"
                >
                  Email: drakzittau@dlr-gastro-event.de
                </a>
              </li>
            </ul>
          </div>

          {/* Öffnungszeiten */}
          <div className="flex flex-col space-y-4">
            <h4 id="ftr-hdr-oeffnung" className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-primary border-b border-gold-secondary/20 pb-2">
              Öffnungszeiten
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Clock className="mt-0.5 h-4 w-4 text-gold-secondary shrink-0" />
                <div className="font-serif space-y-1">
                  <p><span className="font-bold">So:</span> <span className="text-cream-parchment/60">11:00–14:00 &amp; 17:00–21:00</span></p>
                  <p><span className="font-bold">Mo:</span> <span className="text-cream-parchment/60">17:00–22:00</span></p>
                  <p><span className="font-bold">Di:</span> <span className="text-cream-parchment/60 italic">Geschlossen</span></p>
                  <p><span className="font-bold">Mi–Fr:</span> <span className="text-cream-parchment/60">17:00–22:00</span></p>
                  <p><span className="font-bold">Sa:</span> <span className="text-cream-parchment/60">11:00–14:00 &amp; 17:00–22:00</span></p>
                  <p className="pt-2 text-[11px] text-gold-secondary/80 italic border-t border-gold-secondary/15 mt-1.5">
                    * Küchenschluss abends 1 Stunde vor Schließung
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Anfahrt */}
          <div className="flex flex-col space-y-4">
            <h4 id="ftr-hdr-anfahrt" className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-primary border-b border-gold-secondary/20 pb-2">
              Anfahrt
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold-secondary shrink-0" />
                <div className="font-serif">
                  <p>Innere Weberstraße 11</p>
                  <p className="text-cream-parchment/60">02763 Zittau</p>
                </div>
              </li>
            </ul>
            <div className="pt-2">
              <a 
                id="ftr-shortcut-impressum"
                href={SCREEN_PATHS[Screen.IMPRESSUM]}
                onClick={handleNavClick(Screen.IMPRESSUM)}
                title={SCREEN_META[Screen.IMPRESSUM].navTooltip}
                className="font-cinzel text-[11px] font-bold text-gold-secondary hover:text-gold-bright transition-colors uppercase tracking-widest underline underline-offset-4 cursor-pointer"
              >
                Impressum anzeigen
              </a>
            </div>
          </div>

        </div>

        {/* Bottom fine line & small maps grounding info */}
        <div className="mt-12 pt-8 border-t border-gold-secondary/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif text-cream-parchment/40 text-center sm:text-left">
          <nav aria-label="Footer-Navigation" className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
            <a id="ftr-lnk-home" href={SCREEN_PATHS[Screen.HOME]} onClick={handleNavClick(Screen.HOME)} title={SCREEN_META[Screen.HOME].navTooltip} className="hover:text-gold-primary transition-colors">Startseite</a>
            <a id="ftr-lnk-menu" href={SCREEN_PATHS[Screen.MENU]} onClick={handleNavClick(Screen.MENU)} title={SCREEN_META[Screen.MENU].navTooltip} className="hover:text-gold-primary transition-colors">Speisekarte</a>
            <a id="ftr-lnk-reserve" href={SCREEN_PATHS[Screen.RESERVE]} onClick={handleNavClick(Screen.RESERVE)} title={SCREEN_META[Screen.RESERVE].navTooltip} className="hover:text-gold-primary transition-colors">Reservierung</a>
            <a id="ftr-lnk-gallery" href={SCREEN_PATHS[Screen.GALLERY]} onClick={handleNavClick(Screen.GALLERY)} title={SCREEN_META[Screen.GALLERY].navTooltip} className="hover:text-gold-primary transition-colors">Galerie</a>
            <a id="ftr-lnk-jobs" href={SCREEN_PATHS[Screen.JOBS]} onClick={handleNavClick(Screen.JOBS)} title={SCREEN_META[Screen.JOBS].navTooltip} className="hover:text-gold-primary transition-colors">Jobs</a>
            <a id="ftr-lnk-impressum" href={SCREEN_PATHS[Screen.IMPRESSUM]} onClick={handleNavClick(Screen.IMPRESSUM)} title={SCREEN_META[Screen.IMPRESSUM].navTooltip} className="hover:text-gold-primary transition-colors">Impressum</a>
            <a id="ftr-lnk-datenschutz" href={SCREEN_PATHS[Screen.DATENSCHUTZ]} onClick={handleNavClick(Screen.DATENSCHUTZ)} title={SCREEN_META[Screen.DATENSCHUTZ].navTooltip} className="hover:text-gold-primary transition-colors">Datenschutz</a>
            <button id="ftr-lnk-cookies" onClick={openSettings} title="Cookie-Präferenzen anpassen" className="hover:text-gold-primary transition-colors cursor-pointer">Cookie-Einstellungen</button>
          </nav>
          <div className="text-center sm:text-right">
            Entworfen in herrschaftlicher Pracht nach altgothischen Vorgaben.
          </div>
        </div>
      </div>
    </footer>
  );
}
