import React from 'react';
import { Calendar, Flame, Sparkles } from 'lucide-react';
import silvesterBgVideo from '../assets/images/silvester-bg.webm';

interface SilvesterBannerProps {
  onReserveSilvester: () => void;
}

export default function SilvesterBanner({ onReserveSilvester }: SilvesterBannerProps) {
  return (
    <section
      aria-label="Silvester-Veranstaltung am 31. Dezember"
      className="mx-auto max-w-6xl px-4 pt-12 sm:pt-16 pb-0 md:px-8 relative z-20"
    >
      <div
        id="silvester-event-banner"
        className="relative overflow-hidden border border-gold-primary/45 bg-tavern-dark/95 shadow-[0_12px_40px_rgba(0,0,0,0.75),inset_0_0_40px_rgba(212,175,55,0.05)] group"
      >
        {/* Gilded Corners */}
        <div className="gilded-corner gilded-corner-tl z-20" />
        <div className="gilded-corner gilded-corner-tr z-20" />
        <div className="gilded-corner gilded-corner-bl z-20" />
        <div className="gilded-corner gilded-corner-br z-20" />

        {/* Subtle gold shimmer beam */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          <div className="w-[120px] h-[300%] bg-gradient-to-r from-transparent via-gold-bright/10 to-transparent animate-gold-shimmer -top-1/2" />
        </div>

        {/* Balanced 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Panel: Crisp, Data-Efficient Video Showcase */}
          <div className="relative lg:col-span-5 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] overflow-hidden bg-void-black">
            <video
              src={silvesterBgVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center brightness-90 contrast-110 transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Soft edge blend into the content panel */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-tavern-dark via-tavern-dark/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-tavern-dark/95" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold-primary/15" />

            {/* Compact Date Badge */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 border border-gold-primary/50 bg-void-black/85 backdrop-blur-sm px-3 py-1.5 shadow-lg">
              <Calendar className="h-3.5 w-3.5 text-gold-primary shrink-0" />
              <span className="font-cinzel text-[11px] font-black tracking-widest text-gold-bright uppercase">
                31. Dezember
              </span>
            </div>
          </div>

          {/* Right Panel: Editorial Copy & Action */}
          <div className="relative lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
            {/* Warm candlelight radial glow */}
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-gold-primary/10 blur-3xl" />

            <div className="relative z-10 space-y-4">
              {/* Top Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 border border-gold-primary/45 bg-void-black/70 px-3 py-1 font-cinzel text-[10px] sm:text-[11px] font-bold tracking-widest text-gold-bright uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-gold-bright shrink-0" />
                  <span>Silvester-Special</span>
                </span>

                <span className="inline-flex items-center gap-1.5 border border-amber-500/40 bg-amber-950/45 px-3 py-1 font-cinzel text-[10px] sm:text-[11px] font-bold tracking-wider text-amber-200 uppercase">
                  <Flame className="h-3.5 w-3.5 text-amber-400 candle-glow shrink-0" />
                  <span>Solange die Plätze reichen</span>
                </span>
              </div>

              {/* Balanced Headline */}
              <h2 className="font-cinzel text-xl sm:text-2xl lg:text-[1.75rem] font-extrabold tracking-wider text-gold-bright uppercase leading-snug">
                Silvester bei Kerzenschein
              </h2>

              {/* Concise Copy */}
              <p className="font-serif text-sm sm:text-base leading-relaxed text-cream-parchment/85">
                Zum Jahresausklang am 31. Dezember erwartet Euch in der Drachentaverne ein gemütlicher Abend bei Kerzenschein in stimmungsvoller Atmosphäre — nur solange die Plätze reichen.
              </p>

              {/* Action Row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  id="btn-silvester-reserve"
                  type="button"
                  onClick={onReserveSilvester}
                  className="bg-gold-primary border border-gold-primary px-6 py-3.5 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer text-center inline-flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(212,175,55,0.25)] group/cta"
                >
                  <span>Silvester-Plätze reservieren</span>
                  <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                </button>

                <span className="font-serif text-xs italic text-cream-parchment/60">
                  Begrenztes Platzkontingent für den 31.12.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
