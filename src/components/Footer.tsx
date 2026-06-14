/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Screen } from '../types';
import { Phone, Mail, Clock, MapPin, Compass } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative mt-auto border-t-2 border-gold-primary/30 bg-void-black text-cream-parchment/80 pt-16 pb-12">
      {/* Visual top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gold-primary/20" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col space-y-4">
            <h3 
              id="ftr-logo"
              className="font-cinzel text-3xl font-extrabold tracking-widest text-gold-primary cursor-pointer hover:text-gold-bright transition-all"
              onClick={() => onNavigate(Screen.HOME)}
            >
              DRACHEN TAVERNE
            </h3>
            <p className="font-serif text-sm leading-relaxed max-w-xs text-cream-parchment/60">
              Edle Speisen und kräftige Tränke, zubereitet nach uralten Rezepten aus den tiefsten Gewölben unserer Taverne.
            </p>
            <div className="pt-4 text-xs font-mono text-gold-secondary/80">
              © MMXIV Drachen Taverne. Alle Rechte vorbehalten.
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-4">
            <h4 id="ftr-hdr-kontakt" className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-primary border-b border-gold-secondary/20 pb-2">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="mt-0.5 h-4 w-4 text-gold-secondary shrink-0" />
                <span className="font-serif">Telefon: 03583 5495389</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold-secondary shrink-0" />
                <span className="font-serif">Email: post@drachen-taverne.de</span>
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
                  <p><span className="font-bold">So:</span> <span className="text-cream-parchment/60">11:00–21:00</span></p>
                  <p><span className="font-bold">Mo:</span> <span className="text-cream-parchment/60">17:00–21:00</span></p>
                  <p><span className="font-bold">Di:</span> <span className="text-cream-parchment/60 italic">Geschlossen</span></p>
                  <p><span className="font-bold">Mi–Do:</span> <span className="text-cream-parchment/60">17:00–21:00</span></p>
                  <p><span className="font-bold">Fr:</span> <span className="text-cream-parchment/60">17:00–22:00</span></p>
                  <p><span className="font-bold">Sa:</span> <span className="text-cream-parchment/60">11:00–22:00</span></p>
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
              <button 
                id="ftr-shortcut-impressum"
                onClick={() => onNavigate(Screen.IMPRESSUM)}
                className="font-cinzel text-[11px] font-bold text-gold-secondary hover:text-gold-bright transition-colors uppercase tracking-widest underline underline-offset-4 cursor-pointer"
              >
                Impressum anzeigen
              </button>
            </div>
          </div>

        </div>

        {/* Bottom fine line & small maps grounding info */}
        <div className="mt-12 pt-8 border-t border-gold-secondary/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif text-cream-parchment/40">
          <div className="flex space-x-6">
            <button id="ftr-lnk-home" onClick={() => onNavigate(Screen.HOME)} className="hover:text-gold-primary transition-colors">Startseite</button>
            <button id="ftr-lnk-menu" onClick={() => onNavigate(Screen.MENU)} className="hover:text-gold-primary transition-colors">Speisekarte</button>
            <button id="ftr-lnk-gallery" onClick={() => onNavigate(Screen.GALLERY)} className="hover:text-gold-primary transition-colors">Galerie</button>
            <button id="ftr-lnk-impressum" onClick={() => onNavigate(Screen.IMPRESSUM)} className="hover:text-gold-primary transition-colors">Impressum</button>
            <button id="ftr-lnk-reserve" onClick={() => onNavigate(Screen.RESERVE)} className="hover:text-gold-primary transition-colors">Reservierung</button>
          </div>
          <div>
            Entworfen in herrschaftlicher Pracht nach altgothischen Vorgaben.
          </div>
        </div>
      </div>
    </footer>
  );
}
