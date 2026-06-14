/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Screen, MenuItem } from '../types';
import { Sparkles, X, ChevronRight, Coins, FileText, Download } from 'lucide-react';
import roastedPigImage from '../assets/images/roasted_pig_1781370924159.jpg';
import candlelitGobletImage from '../assets/images/Speise2.webp';
import speisekartePdf from '../assets/images/Speisekarte1.pdf';

interface MenuViewProps {
  onNavigate: (screen: Screen, initialNotes?: string) => void;
}

export default function MenuView({ onNavigate }: MenuViewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const vorspeisen: MenuItem[] = [
    {
      id: 'v1',
      name: 'DRAKS FEUER-SÄCHSISCHER FEUERFLEISCH',
      price: '16 SILBER & 90 KUPFER',
      currency: 'SILBER',
      description: 'Feuriger Schweinegulasch mit Zwiebeln und Möhren im scharfen Sud.',
      type: 'vorspeise',
    },
    {
      id: 'v2',
      name: 'SUPPE DER KLERIKER',
      price: '7 KUPFER',
      currency: 'KUPFER',
      description: 'Kräftige Rinderbrühe mit Wurzelgemüse und Markklößchen zur Stärkung der Lebensgeister.',
      type: 'vorspeise',
    },
    {
      id: 'v3',
      name: 'GERÄUCHERTE FORELLE',
      price: '12 KUPFER',
      currency: 'KUPFER',
      description: 'Frisch aus dem Silberbach, serviert mit Apfel-Meerrettich und Roggenschrot.',
      type: 'vorspeise',
    },
  ];

  const hauptgaenge: MenuItem[] = [
    {
      id: 'h1',
      name: 'DRACHENSTEAK',
      price: '45 SILBER',
      currency: 'SILBER',
      description: 'Scharf angebratenes Rind (blutig wie vom Drachenodem geküsst), gereicht mit Rosmarinkartoffeln und Drachenblut-Jus.',
      type: 'hauptgang',
      isSpecial: true,
    },
    {
      id: 'h2',
      name: 'GESCHMORTE LAMMKEULE',
      price: '38 SILBER',
      currency: 'SILBER',
      description: 'Stundenlang in dunklem Bier geschmort, serviert auf einem Bett aus Wurzelpüree und geschmolzenen Zwiebeln.',
      type: 'hauptgang',
    },
    {
      id: 'h3',
      name: 'EINTOPF DER NORDMÄNNER',
      price: '22 SILBER',
      currency: 'SILBER',
      description: 'Ein deftiger Eintopf aus dreierlei Fleisch, weißen Bohnen und kräftigen Kräutern. Wärmt bis auf die Knochen.',
      type: 'hauptgang',
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleReserveDish = (item: MenuItem) => {
    const textMsg = `Ich möchte einen Tisch reservieren und freue mich besonders auf das Gericht: ${item.name} (${item.price})`;
    onNavigate(Screen.RESERVE, textMsg);
    setSelectedItem(null);
  };

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-16 md:px-8">
      {/* Background radial highlight */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gold-primary/5 blur-3xl" />

      {/* Title */}
      <div className="text-center">
        <h1 id="menu-title" className="font-cinzel text-4xl font-extrabold tracking-widest text-gold-bright sm:text-5xl">
          DIE SPEISEKARTE
        </h1>

        {/* Filigree Diamond Divider */}
        <div className="my-6 flex items-center justify-center space-x-4">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold-secondary" />
          <svg className="h-4 w-4 text-gold-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor" />
          </svg>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold-secondary" />
        </div>

        {/* Immersive Subtitle */}
        <p id="menu-subtitle" className="mx-auto max-w-2xl font-serif text-lg italic text-cream-parchment/80 leading-relaxed">
          Edle Speisen und kräftige Tränke, zubereitet nach uralten Rezepten aus den tiefsten Gewölben unserer Taverne.
        </p>
      </div>

      {/* ================= VORSPEISEN SECTION ================= */}
      <div id="section-vorspeisen" className="relative border border-gold-secondary/40 bg-tavern-dark/40 pb-12 pt-16 px-6 md:px-12 mt-16 max-w-4xl mx-auto">
        {/* Absolute Positioning Corner Flourishes */}
        <div className="gilded-corner gilded-corner-tl" />
        <div className="gilded-corner gilded-corner-tr" />
        <div className="gilded-corner gilded-corner-bl" />
        <div className="gilded-corner gilded-corner-br" />

        {/* Section Title Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-void-black border border-gold-secondary/60 px-8 py-2">
          <h2 className="font-cinzel text-lg md:text-xl font-black tracking-widest text-gold-primary uppercase">
            Vorspeisen
          </h2>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {vorspeisen.map((item) => (
            <div
              key={item.id}
              id={`menu-item-${item.id}`}
              onClick={() => handleItemClick(item)}
              className="group cursor-pointer p-2 transition-all hover:bg-gold-secondary/5 border border-transparent hover:border-gold-secondary/15"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-cinzel text-[15px] font-bold tracking-wider text-gold-bright group-hover:text-gold-primary transition-colors">
                  {item.name}
                </h3>
                <span className="shrink-0 font-cinzel text-xs font-semibold text-gold-secondary">
                  {item.price}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm text-cream-parchment/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Divider */}
      <div className="my-16 flex items-center justify-center space-x-4">
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent to-gold-secondary/60" />
        <svg className="h-6 w-6 text-gold-secondary/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor" />
        </svg>
        <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-gold-secondary/60" />
      </div>

      {/* ================= HAUPTGÄNGE SECTION ================= */}
      <div id="section-hauptgaenge" className="relative border border-gold-secondary/40 bg-tavern-dark/40 pb-12 pt-16 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Absolute Positioning Corner Flourishes */}
        <div className="gilded-corner gilded-corner-tl" />
        <div className="gilded-corner gilded-corner-tr" />
        <div className="gilded-corner gilded-corner-bl" />
        <div className="gilded-corner gilded-corner-br" />

        {/* Section Title Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-void-black border border-gold-secondary/60 px-8 py-2">
          <h2 className="font-cinzel text-lg md:text-xl font-black tracking-widest text-gold-primary uppercase">
            Hauptgänge
          </h2>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {hauptgaenge.map((item) => (
            <div
              key={item.id}
              id={`menu-item-${item.id}`}
              onClick={() => handleItemClick(item)}
              className="group cursor-pointer p-2 transition-all hover:bg-gold-secondary/5 border border-transparent hover:border-gold-secondary/15"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h3 className="font-cinzel text-[15px] font-bold tracking-wider text-gold-bright group-hover:text-gold-primary transition-colors inline-block">
                    {item.name}
                  </h3>
                  {item.isSpecial && (
                    <span className="inline-block border border-gold-primary px-1.5 py-0.5 text-[9px] font-mono tracking-widest text-gold-primary font-bold uppercase shrink-0">
                      HAUS-SPEZIALITÄT
                    </span>
                  )}
                </div>
                <span className="shrink-0 font-cinzel text-xs font-semibold text-gold-secondary">
                  {item.price}
                </span>
              </div>
              <p className="mt-2 font-serif text-sm text-cream-parchment/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative interactive tip */}
      <div className="mt-12 text-center">
        <p className="font-serif text-xs italic text-gold-secondary/60">
          * Klickt auf ein Gericht, um mehr über dessen mittelalterliche Zubereitung und Empfehlungen zu erfahren.
        </p>
      </div>

      {/* ================= PDF SPEISEKARTE SECTION ================= */}
      <div id="section-pdf-speisekarte" className="relative border border-gold-secondary/40 bg-tavern-dark/40 pb-12 pt-16 px-6 md:px-12 mt-20 max-w-4xl mx-auto">
        {/* Absolute Positioning Corner Flourishes */}
        <div className="gilded-corner gilded-corner-tl" />
        <div className="gilded-corner gilded-corner-tr" />
        <div className="gilded-corner gilded-corner-bl" />
        <div className="gilded-corner gilded-corner-br" />

        {/* Section Title Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-void-black border border-gold-secondary/60 px-8 py-2 flex items-center space-x-3">
          <FileText className="h-4 w-4 text-gold-primary" />
          <h2 className="font-cinzel text-lg md:text-xl font-black tracking-widest text-gold-primary uppercase">
            Gesamt-Speisekarte (PDF)
          </h2>
        </div>

        {/* Description */}
        <p className="text-center font-serif text-sm italic text-cream-parchment/70 leading-relaxed mb-6 max-w-2xl mx-auto">
          Hier findet Ihr die vollständige Gesamt-Speisekarte unserer Taverne als Pergament-Dokument zum Betrachten und Herunterladen.
        </p>

        {/* PDF Viewer Container */}
        <div className="relative w-full h-[600px] md:h-[750px] border border-gold-secondary/30 bg-void-black overflow-hidden">
          <iframe
            id="pdf-speisekarte-viewer"
            src={speisekartePdf}
            title="DRAK Gesamt-Speisekarte (PDF)"
            className="w-full h-full"
            style={{ backgroundColor: '#1a120b' }}
          />
        </div>

        {/* Download Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            id="pdf-download-link"
            href={speisekartePdf}
            download="DRAK_Speisekarte.pdf"
            className="inline-flex items-center space-x-2 bg-gold-primary border border-gold-primary px-6 py-3 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Speisekarte herunterladen</span>
          </a>
          <a
            id="pdf-open-newtab"
            href={speisekartePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 border border-gold-secondary bg-void-black/60 backdrop-blur-sm px-6 py-3 font-cinzel text-xs font-bold uppercase tracking-widest text-gold-secondary hover:text-gold-bright hover:bg-gold-secondary/15 transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>In neuem Fenster öffnen</span>
          </a>
        </div>
      </div>

      {/* ================= DETAIL POPUP WINDOW (Interactive Modality) ================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-black/85 backdrop-blur-sm transition-all duration-300">
          <div
            id="dish-detail-modal"
            className="relative w-full max-w-xl border-2 border-gold-primary bg-tavern-dark p-6 md:p-8 text-cream-parchment animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Absolute Positioning Corner Flourishes */}
            <div className="gilded-corner gilded-corner-tl" />
            <div className="gilded-corner gilded-corner-tr" />
            <div className="gilded-corner gilded-corner-bl" />
            <div className="gilded-corner gilded-corner-br" />

            {/* Close Button */}
            <button
              id="close-dish-modal"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gold-secondary hover:text-gold-bright p-1 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Dish Image Context */}
            <div className="mb-6 relative h-48 w-full border border-gold-secondary/30 bg-void-black overflow-hidden">
              <img
                src={selectedItem.isSpecial || selectedItem.type === 'hauptgang' ? roastedPigImage : candlelitGobletImage}
                alt={selectedItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-75 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tavern-dark to-transparent" />
              <div className="absolute bottom-4 left-4 border border-gold-primary bg-void-black/80 px-3 py-1 font-mono text-[10px] tracking-widest text-gold-primary font-bold uppercase">
                {selectedItem.type === 'vorspeise' ? 'Edle Vorspeise' : 'Deftiger Hauptgang'}
              </div>
            </div>

            {/* Details */}
            <div className="flex items-baseline justify-between border-b border-gold-secondary/20 pb-2 mb-4">
              <h3 className="font-cinzel text-xl font-bold tracking-widest text-gold-primary">
                {selectedItem.name}
              </h3>
              <span className="font-cinzel text-sm font-semibold text-gold-bright">
                {selectedItem.price}
              </span>
            </div>

            <p className="font-serif text-base text-cream-parchment/90 leading-relaxed mb-6 italic">
              "{selectedItem.description}"
            </p>

            {/* Tavern Lore Description */}
            <div className="bg-void-black/55 border-l-2 border-gold-primary p-4 mb-6 text-sm">
              <p className="font-cinzel text-xs font-bold text-gold-secondary tracking-widest uppercase mb-1">
                KULINARISCHE EMPFEHLUNG:
              </p>
              <p className="font-serif text-cream-parchment/70 leading-relaxed">
                {selectedItem.id === 'h1' && 'Dieses herrschaftliche Fleisch bedarf eines kräftigen dunklen Doppelbocks. Bereitet aus bestem Hochland-Rind, gebraten auf Buchenholz.'}
                {selectedItem.id === 'h2' && 'Unsere geschmorte Lammkeule reift mehrere Stunden im gusseisernen Kessel mit Drachenfels-Dunkelbier. Perfekt für einen kalten Winternachmittag.'}
                {selectedItem.id === 'h3' && 'Ein kulinarischer Schatz nach Art der nördlichen Plünderer. Dreierlei Wildfleisch und kräftige Kräuter wärmen Eure müden Krieger-Knochen.'}
                {selectedItem.type === 'vorspeise' && 'Wir empfehlen ein frisches Met (Honigwein) aus der Region, um die feinen Kräuteraromen perfekt abzurunden.'}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                id="modal-cancel"
                onClick={() => setSelectedItem(null)}
                className="border border-gold-secondary/40 px-5 py-2 font-cinzel text-xs uppercase tracking-wider text-cream-parchment hover:bg-gold-secondary/10 transition-colors cursor-pointer"
              >
                Zurück zur Karte
              </button>
              <button
                id="modal-reserve-dish"
                onClick={() => handleReserveDish(selectedItem)}
                className="flex items-center justify-center space-x-2 bg-gold-primary text-void-black border border-gold-primary px-5 py-2 font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-gold-bright transition-colors cursor-pointer"
              >
                <span>Dieses Gericht Reservieren</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
