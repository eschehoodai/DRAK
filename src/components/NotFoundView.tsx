import React from 'react';
import { Screen } from '../types';
import { ScrollText, Home, BookOpen } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function NotFoundView({ onNavigate }: NotFoundViewProps) {
  return (
    <section className="relative mx-auto max-w-3xl px-4 py-24 md:px-8 text-center">
      {/* Background ambient highlight */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gold-secondary/5 blur-3xl pointer-events-none" />

      <div className="relative border border-gold-secondary/40 bg-tavern-dark/40 px-6 py-16 md:px-16">
        <div className="gilded-corner gilded-corner-tl" />
        <div className="gilded-corner gilded-corner-tr" />
        <div className="gilded-corner gilded-corner-bl" />
        <div className="gilded-corner gilded-corner-br" />

        <div className="flex justify-center mb-8 text-gold-primary candle-glow">
          <ScrollText className="h-16 w-16" strokeWidth={1} />
        </div>

        <p className="font-mono text-gold-secondary/80 tracking-[0.3em] text-sm mb-4">CDIV — 404</p>

        <h1 className="font-cinzel text-3xl md:text-4xl font-extrabold tracking-widest text-gold-bright uppercase mb-6">
          Verirrt im Gewölbe
        </h1>

        <p className="font-serif text-base italic text-cream-parchment/70 leading-relaxed max-w-lg mx-auto mb-12">
          Diese Schriftrolle existiert nicht in unseren Folianten, edler Wanderer.
          Der Pfad, den Ihr eingeschlagen habt, führt in dunkle, unerforschte Katakomben.
          Kehrt um, ehe der Drache erwacht!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="notfound-btn-home"
            onClick={() => onNavigate(Screen.HOME)}
            className="inline-flex items-center justify-center space-x-2 bg-gold-primary border border-gold-primary px-8 py-4 font-cinzel text-xs font-black tracking-widest uppercase text-void-black hover:bg-gold-bright transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Zurück zur Taverne</span>
          </button>
          <button
            id="notfound-btn-menu"
            onClick={() => onNavigate(Screen.MENU)}
            className="inline-flex items-center justify-center space-x-2 border border-gold-secondary px-8 py-4 font-cinzel text-xs font-bold tracking-widest uppercase text-gold-secondary hover:text-gold-bright hover:bg-gold-secondary/10 transition-all cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>Zur Speisekarte</span>
          </button>
        </div>
      </div>
    </section>
  );
}
