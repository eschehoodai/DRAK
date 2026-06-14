/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Building2, Scale, HelpCircle } from 'lucide-react';

export default function ImpressumView() {
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 md:px-8">
      {/* Background ambient highlights */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gold-secondary/5 blur-3xl pointer-events-none" />

      {/* Main Container Frame exactly matching screen mockup */}
      <div id="impressum-gold-frame" className="relative border border-gold-secondary pb-16 pt-16 px-6 md:px-16 bg-tavern-dark/35">
        {/* Absolute Positioning Corner Flourishes */}
        <div className="gilded-corner gilded-corner-tl" />
        <div className="gilded-corner gilded-corner-tr" />
        <div className="gilded-corner gilded-corner-bl" />
        <div className="gilded-corner gilded-corner-br" />

        {/* Impressum Centered Title */}
        <h1 id="impressum-title" className="text-center font-cinzel text-4xl font-extrabold tracking-widest text-gold-bright mb-12 uppercase">
          Impressum
        </h1>

        {/* Section 1: Angaben gemäß § 5 TMG */}
        <div className="text-center flex flex-col items-center space-y-4">
          <h2 id="imp-hdr-angaben" className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
            Angaben gemäß § 5 TMG
          </h2>
          <div className="font-serif text-sm text-cream-parchment/80 leading-relaxed max-w-md">
            <p className="font-bold text-base text-cream-parchment">DRAK GmbH</p>
            <p>Innere Weberstraße 11</p>
            <p>02763 Zittau</p>
          </div>
          <div className="font-serif text-sm text-cream-parchment/80 leading-relaxed max-w-md pt-2">
            <p className="italic text-cream-parchment/60">Vertreten durch:</p>
            <p className="font-bold">Burgherr Alric von Drachenfels</p>
          </div>
        </div>

        {/* Medieval Divider 1 (Scales/Legal) */}
        <div className="my-12 flex items-center justify-center space-x-6">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold-secondary/40" />
          <Scale className="h-5 w-5 text-gold-secondary shrink-0" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold-secondary/40" />
        </div>

        {/* Section 2: Kontakt */}
        <div className="text-center flex flex-col items-center space-y-4">
          <h2 id="imp-hdr-kontakt" className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
            Kontakt
          </h2>
          <div className="font-serif text-sm text-cream-parchment/80 space-y-1">
            <p>
              <span className="text-cream-parchment/50">Telefon:</span> 03583 5495389
            </p>
            <p>
              <span className="text-cream-parchment/50">E-Mail:</span> post@drak.de
            </p>
          </div>
        </div>

        {/* Medieval Divider 2 (Shield/Security) */}
        <div className="my-12 flex items-center justify-center space-x-6">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold-secondary/40" />
          <Shield className="h-5 w-5 text-gold-secondary shrink-0" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold-secondary/40" />
        </div>

        {/* Section 3: Umsatzsteuer-ID */}
        <div className="text-center flex flex-col items-center space-y-4">
          <h2 id="imp-hdr-ustid" className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
            Umsatzsteuer-ID
          </h2>
          <div className="font-serif text-sm text-cream-parchment/80 leading-relaxed max-w-lg">
            <p className="text-cream-parchment/60 pb-1">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
            <p className="font-mono text-gold-bright tracking-wider font-bold">DE999999999</p>
          </div>
        </div>

        {/* Medieval Divider 3 (Building/Courthouse) */}
        <div className="my-12 flex items-center justify-center space-x-6">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold-secondary/40" />
          <Building2 className="h-5 w-5 text-gold-secondary shrink-0" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold-secondary/40" />
        </div>

        {/* Section 4: Streitschlichtung */}
        <div className="text-center flex flex-col items-center space-y-4">
          <h2 id="imp-hdr-streit" className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
            Streitschlichtung
          </h2>
          <div className="font-serif text-sm text-cream-parchment/70 leading-relaxed max-w-xl space-y-4">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a 
                href="https://ec.europa.eu/consumers/odr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gold-bright hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>.
            </p>
            <p>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p className="italic text-xs text-cream-parchment/50 pt-2">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
