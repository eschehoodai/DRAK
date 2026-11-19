/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Screen } from '../types';
import { SCREEN_PATHS, SCREEN_META } from '../routes';
import {
  Calendar,
  Phone,
  UtensilsCrossed,
  Menu,
  X,
  Home,
  Image as ImageIcon,
  Users,
  MapPin,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { useIsTavernOpen, useTavernStatus } from '../utils/openingHours';
import { trackPhoneCallClick } from '../utils/gtag';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Header({ currentScreen, onNavigate }: HeaderProps) {
  const isTavernOpenNow = useIsTavernOpen();
  const tavernStatus = useTavernStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (screen: Screen) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(screen);
  };

  return (
    <header role="banner" className="sticky top-0 z-50 w-full border-b border-gold-secondary/20 bg-void-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3.5 sm:px-4 sm:py-4 md:px-8">
        {/* Logo */}
        <a
          id="hdr-logo-container"
          href={SCREEN_PATHS[Screen.HOME]}
          onClick={handleNavClick(Screen.HOME)}
          title="Drachen Taverne Zittau – Zur Startseite"
          aria-label="Drachen Taverne Zittau – Zur Startseite"
          className="group flex items-center space-x-2 cursor-pointer select-none shrink-0"
        >
          <span id="hdr-logo-text" className="font-cinzel text-xl sm:text-3xl font-extrabold tracking-widest text-gold-primary transition-colors group-hover:text-gold-bright">
            DRAK
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

        </nav>

        {/* CTA Buttons (Phone & Table Reservation) */}
        {/* CTA Buttons & Mobile Navigation Toggles */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* Dynamischer Telefon-CTA (erscheint nur bei geöffneter Taverne; mobil kompakt als Icon) */}
          {isTavernOpenNow && (
            <a
              id="hdr-cta-phone"
              href="tel:035835495389"
              onClick={trackPhoneCallClick}
              className="flex items-center justify-center md:space-x-1.5 border border-gold-secondary/40 bg-gold-primary/10 p-1.5 sm:p-2 md:px-3 md:py-2 font-cinzel text-xs font-bold text-gold-bright hover:bg-gold-primary hover:text-void-black transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
              title="Direkt in der Taverne anrufen: 03583 5495389"
              aria-label="Direkt in der Taverne anrufen: 03583 5495389"
            >
              <Phone className="h-4 w-4 md:h-3.5 md:w-3.5 shrink-0" />
              <span className="hidden md:inline">03583 5495389</span>
            </a>
          )}

          {/* Reservieren Button (Desktop & Mobil) */}
          <a
            id="hdr-cta-reserve"
            href={SCREEN_PATHS[Screen.RESERVE]}
            onClick={handleNavClick(Screen.RESERVE)}
            title={SCREEN_META[Screen.RESERVE].navTooltip}
            className="flex items-center space-x-1 sm:space-x-2 border border-gold-primary bg-gold-primary px-2.5 sm:px-5 py-1.5 sm:py-2 text-center font-cinzel text-xs font-black uppercase tracking-wider text-void-black transition-all duration-300 hover:bg-gold-bright hover:border-gold-bright active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="inline sm:hidden">Reservieren</span>
            <span className="hidden sm:inline">Tisch Reservieren</span>
          </a>

          {/* Hamburger Toggle Button (< xl) */}
          <button
            type="button"
            id="hdr-hamburger-btn"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={isMobileMenuOpen}
            className="xl:hidden flex items-center justify-center p-1.5 sm:p-2 border border-gold-secondary/30 bg-gold-primary/10 text-gold-primary hover:bg-gold-primary hover:text-void-black transition-colors cursor-pointer shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

            {/* Mobile Navigation Drawer Overlay (< xl) mounted via Portal to escape header containing block */}
      {mounted && isMobileMenuOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigationsmenü"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-void-black/85 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel - Full Viewport Height (100dvh) */}
          <aside
            className="fixed top-0 right-0 bottom-0 w-[320px] sm:w-[380px] max-w-[90vw] h-full h-[100dvh] bg-[#0c0a08] border-l border-gold-primary/30 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto"
          >
            {/* Scrollable Main Content */}
            <div className="p-4 space-y-4">
              {/* Drawer Top Bar / Brand Pill & Close */}
              <div className="flex items-center justify-between pb-3 border-b border-gold-secondary/20">
                <a
                  href={SCREEN_PATHS[Screen.HOME]}
                  onClick={handleNavClick(Screen.HOME)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-gold-primary/40 bg-gold-primary/10 hover:border-gold-primary transition-all cursor-pointer shadow-[0_0_12px_rgba(201,151,56,0.1)]"
                  title="Drachen Taverne – Mittelalter Restaurant Zittau"
                >
                  <span className="font-cinzel text-base font-black tracking-widest text-gold-primary">
                    DRAK
                  </span>
                  <span className="h-3.5 w-[1px] bg-gold-primary/40" />
                  <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider text-cream-parchment/80">
                    Mittelalter Restaurant Zittau
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Menü schließen"
                  className="w-9 h-9 rounded-full border border-gold-secondary/30 bg-void-black/60 flex items-center justify-center text-cream-parchment/70 hover:text-gold-bright hover:border-gold-primary transition-colors cursor-pointer shrink-0 ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Links - 5 Kernpunkte im abgerundeten Card-Stil (wie Café Praha) */}
              <nav aria-label="Mobiles Hauptmenü" className="space-y-2">
                {[
                  {
                    screen: Screen.HOME,
                    label: 'Startseite',
                    desc: 'Zurück zur Haupttaverne',
                    icon: Home,
                  },
                  {
                    screen: Screen.MENU,
                    label: 'Speisen & Trank',
                    desc: 'Deftige Pfannen, Met & Biere',
                    icon: UtensilsCrossed,
                  },
                  {
                    screen: Screen.RESERVE,
                    label: 'Tisch reservieren',
                    desc: 'Gewölbe oder Biergarten',
                    icon: Calendar,
                  },
                  {
                    screen: Screen.GALLERY,
                    label: 'Galerie',
                    desc: 'Bilder aus dem Gewölbe',
                    icon: ImageIcon,
                  },
                  {
                    screen: Screen.JOBS,
                    label: 'Zunft (Jobs)',
                    desc: 'Werde Teil unserer Taverne',
                    icon: Users,
                  },
                ].map(({ screen, label, desc, icon: Icon }) => {
                  const isActive = currentScreen === screen;
                  return (
                    <a
                      key={screen}
                      href={SCREEN_PATHS[screen]}
                      onClick={handleNavClick(screen)}
                      title={SCREEN_META[screen].navTooltip}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gold-primary/15 border-gold-primary shadow-[0_0_15px_rgba(201,151,56,0.15)] text-gold-bright'
                          : 'bg-[#16120e]/80 border-gold-secondary/20 hover:border-gold-primary/50 hover:bg-[#1f1913] text-cream-parchment/90'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'border-gold-primary bg-gold-primary/20 text-gold-bright'
                            : 'border-gold-secondary/30 bg-gold-primary/5 text-gold-primary group-hover:border-gold-primary/60'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left truncate">
                          <div className={`font-cinzel text-sm sm:text-base font-bold tracking-wide truncate ${
                            isActive ? 'text-gold-bright' : 'text-cream-parchment group-hover:text-gold-primary'
                          }`}>
                            {label}
                          </div>
                          <div className="text-[11px] text-cream-parchment/50 font-sans truncate">
                            {desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        isActive ? 'text-gold-primary' : 'text-gold-secondary/50'
                      }`} />
                    </a>
                  );
                })}
              </nav>

              {/* Öffnungszeiten-Card (nach Café-Praha-Vorbild) */}
              <div className="rounded-2xl border border-gold-secondary/25 bg-[#14110d]/95 p-3.5 sm:p-4 text-xs font-sans space-y-2.5">
                {/* Live Status Header */}
                <div className="flex items-center space-x-2 pb-2.5 border-b border-gold-secondary/20 font-cinzel text-xs font-bold">
                  {tavernStatus.isOpen ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </span>
                      <span className="text-emerald-400 font-semibold">{tavernStatus.statusBadgeText}</span>
                    </>
                  ) : (
                    <>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)] shrink-0" />
                      <span className="text-amber-400 font-semibold">{tavernStatus.statusBadgeText}</span>
                    </>
                  )}
                </div>

                {/* Strukturierte Zeiten-Tabelle */}
                <div className="space-y-1.5 font-serif text-[11.5px] sm:text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream-parchment">Mi – Fr</span>
                    <span className="text-cream-parchment/70 font-mono">17:00 – 22:00 Uhr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream-parchment">Sa</span>
                    <span className="text-cream-parchment/70 font-mono">11:00–14:00 &amp; 17:00–22:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream-parchment">So</span>
                    <span className="text-cream-parchment/70 font-mono">11:00–14:00 &amp; 17:00–21:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream-parchment">Mo</span>
                    <span className="text-cream-parchment/70 font-mono">17:00 – 22:00 Uhr</span>
                  </div>
                  <div className="flex items-center justify-between text-cream-parchment/50">
                    <span className="font-bold">Di</span>
                    <span className="italic">Ruhetag (Geschlossen)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gold-secondary/15 text-[10px] text-gold-secondary/70 italic text-center">
                  * Küchenschluss jeweils 1 Stunde vor Schließung
                </div>
              </div>
            </div>

            {/* Drawer Actions & Footer */}
            <div className="p-4 pt-3 border-t border-gold-secondary/20 bg-void-black/90 space-y-2.5">
              {/* Haupt-CTA: Tisch online reservieren ↗ */}
              <a
                id="hdr-drawer-cta-reserve-online"
                href={SCREEN_PATHS[Screen.RESERVE]}
                onClick={handleNavClick(Screen.RESERVE)}
                title="Tisch online reservieren"
                className="w-full py-3 px-4 rounded-xl bg-gold-primary hover:bg-gold-bright active:scale-[0.98] text-void-black font-cinzel font-black text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-gold-primary/20 transition-all cursor-pointer"
              >
                <span>Tisch online reservieren</span>
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </a>

              {/* Sekundär-CTA: Telefonisch reservieren */}
              <a
                id="hdr-drawer-cta-phone"
                href="tel:035835495389"
                onClick={trackPhoneCallClick}
                title="Telefonisch reservieren: 03583 5495389"
                className="w-full py-2.5 px-3 rounded-xl border border-gold-secondary/40 bg-void-black/80 hover:bg-gold-primary/10 text-gold-bright font-cinzel text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5 text-gold-primary shrink-0" />
                <span>Telefonisch reservieren: 03583 5495389</span>
              </a>

              {/* Anschrift */}
              <div className="flex items-center justify-center space-x-1.5 text-xs text-cream-parchment/60 font-sans pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-gold-primary/70 shrink-0" />
                <span>Markt 15, 02763 Zittau</span>
              </div>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}
