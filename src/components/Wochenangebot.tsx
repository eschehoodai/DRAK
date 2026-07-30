/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WochenangebotItem } from '../types';

function GildedCorners() {
  return (
    <>
      <div className="gilded-corner gilded-corner-tl" />
      <div className="gilded-corner gilded-corner-tr" />
      <div className="gilded-corner gilded-corner-bl" />
      <div className="gilded-corner gilded-corner-br" />
    </>
  );
}

export default function Wochenangebot() {
  const [angebote, setAngebote] = useState<WochenangebotItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const timestamp = new Date().getTime();

    fetch(`/angebote.json?t=${timestamp}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}`);
        }
        return res.json();
      })
      .then((data: WochenangebotItem[]) => {
        if (!isMounted) return;

        if (!Array.isArray(data)) {
          setAngebote([]);
          setLoading(false);
          return;
        }

        // Filter valid dishes (must have non-empty name)
        const validDishes = data.filter(
          (item) => item && typeof item.name === 'string' && item.name.trim().length > 0
        );

        setAngebote(validDishes);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Wochenangebote konnten nicht geladen werden:', err);
        if (isMounted) {
          setAngebote([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Während des Fetches oder wenn keine gültigen Angebote vorliegen: komplett unsichtbar (return null)
  if (loading || !angebote || angebote.length === 0) {
    return null;
  }

  return (
    <section id="section-wochenangebot" className="mt-12 mb-16">
      <div className="relative border-2 border-gold-primary/60 bg-tavern-dark/60 pb-12 pt-16 px-6 md:px-12 max-w-4xl mx-auto shadow-[0_0_25px_rgba(212,175,55,0.12)]">
        <GildedCorners />

        {/* Section Header Badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-void-black border border-gold-bright px-6 py-2 flex items-center space-x-3 whitespace-nowrap shadow-lg">
          <svg
            className="h-5 w-5 text-gold-bright animate-pulse"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
          </svg>
          <h2 className="font-cinzel text-lg md:text-xl font-black tracking-widest text-gold-bright uppercase">
            AKTUELLES WOCHENANGEBOT
          </h2>
          <svg
            className="h-5 w-5 text-gold-bright animate-pulse"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
          </svg>
        </div>

        <p className="text-center font-serif text-sm italic text-gold-primary/90 tracking-widest -mt-6 mb-10">
          ~ Vom Wirt frisch zubereitet – nur für kurze Zeit auf der Tafel ~
        </p>

        {/* Grid der Wochenangebote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {angebote.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded border border-gold-secondary/20 bg-gold-primary/5 hover:border-gold-secondary/50 transition-colors"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h3 className="font-cinzel text-[15px] font-bold tracking-wider uppercase text-gold-bright">
                    {item.name}
                  </h3>
                  <span className="inline-block border border-gold-primary/80 bg-gold-primary/10 px-1.5 py-0.5 text-[9px] font-mono tracking-widest text-gold-bright font-bold uppercase shrink-0">
                    ANGEBOT
                  </span>
                </div>
                {item.preis && (
                  <span className="shrink-0 font-cinzel text-xs font-semibold uppercase text-gold-secondary">
                    {item.preis}
                  </span>
                )}
              </div>

              {item.beschreibung && (
                <p className="mt-2 font-serif text-sm text-cream-parchment/80 leading-relaxed">
                  {item.beschreibung}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
