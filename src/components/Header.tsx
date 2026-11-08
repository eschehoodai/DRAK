/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Screen } from '../types';
import { SCREEN_PATHS, SCREEN_META } from '../routes';
import { Calendar, Phone } from 'lucide-react';
import { useIsTavernOpen } from '../utils/openingHours';
import { trackPhoneCallClick } from '../utils/gtag';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Header({ currentScreen, onNavigate }: HeaderProps) {
  const isTavernOpenNow = useIsTavernOpen();

  const handleNavClick = (screen: Screen) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(screen);
  };

  return (
    <header role="banner" className="sticky top-0 z-50 w-full border-b border-gold-secondary/20 bg-void-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <a
          id="hdr-logo-container"
          href={SCREEN_PATHS[Screen.HOME]}
          onClick={handleNavClick(Screen.HOME)}
          title="Drachen Taverne Zittau – Zur Startseite"
          aria-label="Drachen Taverne Zittau – Zur Startseite"
          className="group flex items-center space-x-2 cursor-pointer select-none shrink-0"
        >
          <span id="hdr-logo-text" className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-widest text-gold-primary transition-colors group-hover:text-gold-bright">
            DRAK
          </span>
          <span className="hidden font-cinzel text-xs uppercase tracking-widest text-cream-parchment/60 xl:inline-block">
            | Zittau
          </span>
        </a>

        {/* Desktop Navigation links (Active on xl / wide desktop) */}
        <nav aria-label="Hauptnavigation" className="hidden items-center space-x-6 xl:space-x-8 xl:flex shrink-0">
          <a
            id="hdr-nav-home"
            href={SCREEN_PATHS[Screen.HOME]}
            onClick={handleNavClick(Screen.HOME)}
            title={SCREEN_META[Screen.HOME].navTooltip}
            aria-current={currentScreen === Screen.HOME ? 'page' : undefined}
            className={`font-cinzel text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative py-1 ${
              currentScreen === Screen.HOME
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-primary'
            }`}
          >
            Start
            {currentScreen === Screen.HOME && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </a>
          <a
            id="hdr-nav-menu"
            href={SCREEN_PATHS[Screen.MENU]}
            onClick={handleNavClick(Screen.MENU)}
            title={SCREEN_META[Screen.MENU].navTooltip}
            aria-current={currentScreen === Screen.MENU ? 'page' : undefined}
            className={`font-cinzel text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative py-1 ${
              currentScreen === Screen.MENU
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-primary'
            }`}
          >
            Speisen &amp; Trank
            {currentScreen === Screen.MENU && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </a>
          <a
            id="hdr-nav-reserve"
            href={SCREEN_PATHS[Screen.RESERVE]}
            onClick={handleNavClick(Screen.RESERVE)}
            title={SCREEN_META[Screen.RESERVE].navTooltip}
            aria-current={currentScreen === Screen.RESERVE ? 'page' : undefined}
            className={`font-cinzel text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative py-1 ${
              currentScreen === Screen.RESERVE
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-primary'
            }`}
          >
            Reservierung
            {currentScreen === Screen.RESERVE && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </a>
          <a
            id="hdr-nav-gallery"
            href={SCREEN_PATHS[Screen.GALLERY]}
            onClick={handleNavClick(Screen.GALLERY)}
            title={SCREEN_META[Screen.GALLERY].navTooltip}
            aria-current={currentScreen === Screen.GALLERY ? 'page' : undefined}
            className={`font-cinzel text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative py-1 ${
              currentScreen === Screen.GALLERY
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-primary'
            }`}
          >
            Galerie
            {currentScreen === Screen.GALLERY && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </a>
          <a
            id="hdr-nav-jobs"
            href={SCREEN_PATHS[Screen.JOBS]}
            onClick={handleNavClick(Screen.JOBS)}
            title={SCREEN_META[Screen.JOBS].navTooltip}
            aria-current={currentScreen === Screen.JOBS ? 'page' : undefined}
            className={`font-cinzel text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative py-1 ${
              currentScreen === Screen.JOBS
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-primary'
            }`}
          >
            Zunft (Jobs)
            {currentScreen === Screen.JOBS && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </a>
          <a
            id="hdr-nav-impressum"
            href={SCREEN_PATHS[Screen.IMPRESSUM]}
            onClick={handleNavClick(Screen.IMPRESSUM)}
            title={SCREEN_META[Screen.IMPRESSUM].navTooltip}
            aria-current={currentScreen === Screen.IMPRESSUM ? 'page' : undefined}
            className={`font-cinzel text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative py-1 ${
              currentScreen === Screen.IMPRESSUM
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-primary'
            }`}
          >
            Impressum
            {currentScreen === Screen.IMPRESSUM && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </a>
        </nav>

        {/* CTA Buttons (Phone & Table Reservation) */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {isTavernOpenNow && (
            <a
              id="hdr-cta-phone"
              href="tel:035835495389"
              onClick={trackPhoneCallClick}
              className="flex items-center space-x-1.5 border border-gold-secondary/40 bg-gold-primary/10 px-2.5 sm:px-3 py-2 font-cinzel text-xs font-bold text-gold-bright hover:bg-gold-primary hover:text-void-black transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
              title="Direkt in der Taverne anrufen: 03583 5495389"
              aria-label="Direkt in der Taverne anrufen: 03583 5495389"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">03583 5495389</span>
              <span className="inline sm:hidden text-[11px]">Anrufen</span>
            </a>
          )}
          <a
            id="hdr-cta-reserve"
            href={SCREEN_PATHS[Screen.RESERVE]}
            onClick={handleNavClick(Screen.RESERVE)}
            title={SCREEN_META[Screen.RESERVE].navTooltip}
            className="flex items-center space-x-1.5 sm:space-x-2 border border-gold-primary bg-gold-primary px-3 sm:px-5 py-2 sm:py-2.5 text-center font-cinzel text-xs font-black uppercase tracking-wider text-void-black transition-all duration-300 hover:bg-gold-bright hover:border-gold-bright active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="inline sm:hidden">Reservieren</span>
            <span className="hidden sm:inline">Tisch Reservieren</span>
          </a>
        </div>
      </div>

      {/* Secondary navigation bar for Mobile and Tablet viewports (< xl) */}
      <nav
        aria-label="Mobile Navigation"
        className="flex xl:hidden justify-between border-t border-gold-secondary/10 bg-void-black px-1 py-2 text-xs font-semibold overflow-x-auto"
      >
        <a
          id="mob-nav-home"
          href={SCREEN_PATHS[Screen.HOME]}
          onClick={handleNavClick(Screen.HOME)}
          title={SCREEN_META[Screen.HOME].navTooltip}
          aria-current={currentScreen === Screen.HOME ? 'page' : undefined}
          className={`font-cinzel tracking-normal whitespace-nowrap px-2 py-1 ${
            currentScreen === Screen.HOME ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'
          }`}
        >
          Startseite
        </a>
        <a
          id="mob-nav-menu"
          href={SCREEN_PATHS[Screen.MENU]}
          onClick={handleNavClick(Screen.MENU)}
          title={SCREEN_META[Screen.MENU].navTooltip}
          aria-current={currentScreen === Screen.MENU ? 'page' : undefined}
          className={`font-cinzel tracking-normal whitespace-nowrap px-2 py-1 ${
            currentScreen === Screen.MENU ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'
          }`}
        >
          Speisekarte
        </a>
        <a
          id="mob-nav-reserve"
          href={SCREEN_PATHS[Screen.RESERVE]}
          onClick={handleNavClick(Screen.RESERVE)}
          title={SCREEN_META[Screen.RESERVE].navTooltip}
          aria-current={currentScreen === Screen.RESERVE ? 'page' : undefined}
          className={`font-cinzel tracking-normal whitespace-nowrap px-2 py-1 ${
            currentScreen === Screen.RESERVE ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'
          }`}
        >
          Reservierung
        </a>
        <a
          id="mob-nav-gallery"
          href={SCREEN_PATHS[Screen.GALLERY]}
          onClick={handleNavClick(Screen.GALLERY)}
          title={SCREEN_META[Screen.GALLERY].navTooltip}
          aria-current={currentScreen === Screen.GALLERY ? 'page' : undefined}
          className={`font-cinzel tracking-normal whitespace-nowrap px-2 py-1 ${
            currentScreen === Screen.GALLERY ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'
          }`}
        >
          Galerie
        </a>
        <a
          id="mob-nav-jobs"
          href={SCREEN_PATHS[Screen.JOBS]}
          onClick={handleNavClick(Screen.JOBS)}
          title={SCREEN_META[Screen.JOBS].navTooltip}
          aria-current={currentScreen === Screen.JOBS ? 'page' : undefined}
          className={`font-cinzel tracking-normal whitespace-nowrap px-2 py-1 ${
            currentScreen === Screen.JOBS ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'
          }`}
        >
          Jobs
        </a>
        <a
          id="mob-nav-impressum"
          href={SCREEN_PATHS[Screen.IMPRESSUM]}
          onClick={handleNavClick(Screen.IMPRESSUM)}
          title={SCREEN_META[Screen.IMPRESSUM].navTooltip}
          aria-current={currentScreen === Screen.IMPRESSUM ? 'page' : undefined}
          className={`font-cinzel tracking-normal whitespace-nowrap px-2 py-1 ${
            currentScreen === Screen.IMPRESSUM ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'
          }`}
        >
          Impressum
        </a>
      </nav>
    </header>
  );
}
