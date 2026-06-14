/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Screen } from '../types';
import { ShieldAlert, Calendar } from 'lucide-react';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Header({ currentScreen, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-secondary/20 bg-void-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <div 
          id="hdr-logo-container"
          onClick={() => onNavigate(Screen.HOME)}
          className="group flex items-center space-x-2 cursor-pointer select-none"
        >
          <span id="hdr-logo-text" className="font-cinzel text-3xl font-extrabold tracking-widest text-gold-primary transition-colors group-hover:text-gold-bright">
            DRAK
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            id="nav-link-home"
            onClick={() => onNavigate(Screen.HOME)}
            className={`font-cinzel text-sm font-bold tracking-wider uppercase transition-all duration-300 relative py-2 ${
              currentScreen === Screen.HOME
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-bright'
            }`}
          >
            Startseite
            {currentScreen === Screen.HOME && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </button>
          
          <button
            id="nav-link-menu"
            onClick={() => onNavigate(Screen.MENU)}
            className={`font-cinzel text-sm font-bold tracking-wider uppercase transition-all duration-300 relative py-2 ${
              currentScreen === Screen.MENU
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-bright'
            }`}
          >
            Speisekarte
            {currentScreen === Screen.MENU && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </button>
          
          <button
            id="nav-link-gallery"
            onClick={() => onNavigate(Screen.GALLERY)}
            className={`font-cinzel text-sm font-bold tracking-wider uppercase transition-all duration-300 relative py-2 ${
              currentScreen === Screen.GALLERY
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-bright'
            }`}
          >
            Galerie
            {currentScreen === Screen.GALLERY && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </button>

          <button
            id="nav-link-impressum"
            onClick={() => onNavigate(Screen.IMPRESSUM)}
            className={`font-cinzel text-sm font-bold tracking-wider uppercase transition-all duration-300 relative py-2 ${
              currentScreen === Screen.IMPRESSUM
                ? 'text-gold-bright'
                : 'text-cream-parchment/70 hover:text-gold-bright'
            }`}
          >
            Impressum
            {currentScreen === Screen.IMPRESSUM && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary" />
            )}
          </button>
        </nav>

        {/* CTA Button */}
        <div>
          <button
            id="hdr-cta-reserve"
            onClick={() => onNavigate(Screen.RESERVE)}
            className="flex items-center space-x-2 border border-gold-primary bg-gold-primary px-5 py-2.5 text-center font-cinzel text-xs font-black uppercase tracking-wider text-void-black transition-all duration-300 hover:bg-gold-bright hover:border-gold-bright active:scale-95 cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            <span>Tisch Reservieren</span>
          </button>
        </div>
      </div>

      {/* Mobile nav indicator bar */}
      <div className="flex md:hidden justify-around border-t border-gold-secondary/10 bg-void-black px-2 py-2 text-xs font-semibold">
        <button 
          id="mob-nav-home"
          onClick={() => onNavigate(Screen.HOME)} 
          className={`font-cinzel tracking-wider px-3 py-1 ${currentScreen === Screen.HOME ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'}`}
        >
          Startseite
        </button>
        <button 
          id="mob-nav-menu"
          onClick={() => onNavigate(Screen.MENU)} 
          className={`font-cinzel tracking-wider px-3 py-1 ${currentScreen === Screen.MENU ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'}`}
        >
          Speisekarte
        </button>
        <button
          id="mob-nav-gallery"
          onClick={() => onNavigate(Screen.GALLERY)}
          className={`font-cinzel tracking-wider px-3 py-1 ${currentScreen === Screen.GALLERY ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'}`}
        >
          Galerie
        </button>
        <button
          id="mob-nav-impressum"
          onClick={() => onNavigate(Screen.IMPRESSUM)}
          className={`font-cinzel tracking-wider px-3 py-1 ${currentScreen === Screen.IMPRESSUM ? 'text-gold-primary font-bold' : 'text-cream-parchment/60'}`}
        >
          Impressum
        </button>
      </div>
    </header>
  );
}
