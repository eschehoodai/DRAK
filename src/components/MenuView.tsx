/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Screen, MenuItem } from '../types';
import { X, FileText, Download } from 'lucide-react';
import roastedPigImage from '../assets/images/roasted_pig_1781370924159.jpg';
import candlelitGobletImage from '../assets/images/Speise2.webp';
import speisekartePdf from '../assets/images/Speisekarte1.pdf';

interface MenuViewProps {
  onNavigate: (screen: Screen, initialNotes?: string) => void;
}

/* ============================================================
 *  MENU DATA — grouped by section & sub-category
 * ============================================================ */

const vorspeisenWarm: MenuItem[] = [
  {
    id: 'vw1',
    name: 'Knoblauchsuppe',
    price: '6 Silber & 90 Kupfer',
    description: 'Kräftige Knoblauchbrühe nach Wikinger Art – vertreibt Schwäche und Unholde.',
    type: 'vorspeise',
  },
  {
    id: 'vw2',
    name: 'Linsensuppe',
    price: '6 Silber & 90 Kupfer',
    description: 'Deftiger Linsentopf mit Kassler, würzig wie ein Feuerschlag.',
    type: 'vorspeise',
  },
  {
    id: 'vw3',
    name: 'Linsensuppe im Brotleib',
    price: '9 Silber & 90 Kupfer',
    description: 'Selbiger Eintopf aufgetischt im hohlen Brotleib zum Auslöffeln.',
    type: 'vorspeise',
  },
];

const vorspeisenKalt: MenuItem[] = [
  {
    id: 'vk1',
    name: 'Drakplatte',
    price: '14 Silber & 90 Kupfer',
    description: 'Brett mit Romaschinken, Pragerschinken, Braten, Käse und Beilagensalat.',
    type: 'vorspeise',
  },
  {
    id: 'vk2',
    name: 'Fischplatte',
    price: '17 Silber & 90 Kupfer',
    description: 'Geräucherter Fisch, Makrele, Spiegelkarpfen mit Krautsalat und Brot.',
    type: 'vorspeise',
  },
  {
    id: 'vk3',
    name: 'Mittelalter Salat',
    price: '14 Silber & 90 Kupfer',
    description: 'Frisches Grünzeug mit Tomate, Gurke, wahlweise mit Huhn oder Honig-Hühnerfackeln.',
    type: 'vorspeise',
  },
];

const hauptErwachsene: MenuItem[] = [
  {
    id: 'h1',
    name: 'Draks Feuer – Sächsischer Feuerfleisch',
    price: '16 Silber & 90 Kupfer',
    description: 'Feuriger Schweinegulasch mit Zwiebeln und Möhren im scharfen Sud.',
    type: 'hauptgang',
    isSpecial: true,
  },
  {
    id: 'h2',
    name: 'Honigfackel-Fleischspieß vom Schwein mit Allerlei',
    price: '18 Silber & 90 Kupfer',
    description: 'Drey süß-würziger Spieß vom Schwein mit Grillgemüse.',
    type: 'hauptgang',
  },
  {
    id: 'h3',
    name: 'Ritterpfanne – Kassler mit Sauerkraut',
    price: '15 Silber & 90 Kupfer',
    description: 'Würziger Kassler gebettet auf mildem Kraut.',
    type: 'hauptgang',
  },
  {
    id: 'h4',
    name: 'Hänschen Schenkel',
    price: '19 Silber & 90 Kupfer',
    description: 'Hähnchenschenkel in Weißwein-Orange getränkt, mit Zitronenhauch.',
    type: 'hauptgang',
  },
  {
    id: 'h5',
    name: 'Fleischklops – Hausgemachter Burger',
    description: 'Im gerösteten Wecken mit Salat, Tomate, Käse, Zwiebel, Speck und Krautsalat.',
    type: 'hauptgang',
    variants: [
      { label: 'mit Rind', price: '18 Silber & 90 Kupfer' },
      { label: 'mit Wildschwein', price: '19 Silber & 90 Kupfer' },
      { label: 'mit Hirsch', price: '19 Silber & 90 Kupfer' },
    ],
  },
  {
    id: 'h6',
    name: 'Forelle aus dem Ofen',
    price: '21 Silber & 90 Kupfer',
    description: 'Ganze Forelle frisch aus dem Rohr mit Kräutern und Petersilien-Erdäpfeln.',
    type: 'hauptgang',
  },
  {
    id: 'h7',
    name: 'Grillgemüse mit Ofenkartoffeln',
    price: '12 Silber & 95 Kupfer',
    description: 'Buntes Gemüse vom Rost mit Erdäpfeln aus dem Rohr und Joghurt-Tunke.',
    type: 'hauptgang',
  },
  {
    id: 'h8',
    name: 'Rustikal Platte',
    price: '27 Silber & 90 Kupfer',
    description: 'Schwein, Huhn und Rindersteak mit Grillgemüse, Maiskolben und Erdäpfelecken.',
    type: 'hauptgang',
  },
];

const hauptKinder: MenuItem[] = [
  {
    id: 'hk1',
    name: 'Drachennest',
    price: '7 Silber & 90 Kupfer',
    description: 'Hackbällchen, Spaghetti und milde Tomatensoße.',
    type: 'hauptgang',
  },
  {
    id: 'hk2',
    name: 'Fischstäbchen',
    price: '8 Silber & 90 Kupfer',
    description: 'Drey goldene Fischstäbchen mit Erdäpfelstangen und roter/weißer Tunke.',
    type: 'hauptgang',
  },
  {
    id: 'hk3',
    name: 'Kartoffeltaler mit Apfelmus',
    price: '4 Silber & 90 Kupfer',
    description: 'Drey Reiberkuchen mit mildem Apfelmus.',
    type: 'hauptgang',
  },
];

const nachspeisen: MenuItem[] = [
  {
    id: 'n1',
    name: 'Pfefferkirschen',
    price: '5 Silber & 90 Kupfer',
    description: 'Süßkirschen im Rotweinsud mit Pfeffer-Hauch.',
    type: 'nachspeise',
  },
  {
    id: 'n2',
    name: 'Bratapfel',
    price: '7 Silber & 90 Kupfer',
    description: 'Apfelring im Teigmantel mit Zimt und Zucker bestäubt.',
    type: 'nachspeise',
  },
  {
    id: 'n3',
    name: 'Birnenpudding',
    price: '4 Silber & 90 Kupfer',
    description: 'Hausgemachte Pudding mit saftigen Birnenstücken.',
    type: 'nachspeise',
  },
];

/* ============================================================
 *  HELPERS
 * ============================================================ */

const priceLabel = (item: MenuItem): string =>
  item.price ?? (item.variants?.length ? `ab ${item.variants[0].price}` : '');

const typeBadge = (item: MenuItem): string => {
  switch (item.type) {
    case 'vorspeise':
      return 'Edle Vorspeise';
    case 'nachspeise':
      return 'Süße Nachspeise';
    default:
      return 'Deftiger Hauptgang';
  }
};

const recommendation = (item: MenuItem): string => {
  switch (item.type) {
    case 'vorspeise':
      return 'Wir empfehlen dazu einen Becher frischen Met aus der Region, um Euren Gaumen auf das kommende Festmahl einzustimmen.';
    case 'nachspeise':
      return 'Zum süßen Ausklang reichen wir Euch gern einen Schluck warmen Gewürzwein oder einen Becher Honiglikör nach alter Klostertradition.';
    default:
      return 'Zu unseren deftigen Hauptspeisen empfehlen wir einen kräftigen dunklen Doppelbock oder einen Krug Tavernen-Dunkelbier, der jeden Recken stärkt.';
  }
};

/* ============================================================
 *  PRESENTATIONAL COMPONENTS
 * ============================================================ */

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

function MenuPanel({
  id,
  title,
  subtitle,
  icon,
  className = '',
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={`relative border border-gold-secondary/40 bg-tavern-dark/40 pb-12 pt-16 px-6 md:px-12 max-w-4xl mx-auto ${className}`}
    >
      <GildedCorners />

      {/* Section Title Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-void-black border border-gold-secondary/60 px-8 py-2 flex items-center space-x-3 whitespace-nowrap">
        {icon}
        <h2 className="font-cinzel text-lg md:text-xl font-black tracking-widest text-gold-primary uppercase">
          {title}
        </h2>
      </div>

      {subtitle && (
        <p className="text-center font-serif text-sm italic text-cream-parchment/50 tracking-widest -mt-6 mb-10">
          ~ {subtitle} ~
        </p>
      )}

      {children}
    </div>
  );
}

function SubHeader({ label, note }: { label: string; note?: string }) {
  return (
    <div className="mb-7 text-center">
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-8 bg-gold-secondary/40" />
        <span className="font-cinzel text-[13px] font-bold tracking-[0.25em] text-gold-secondary uppercase">
          {label}
        </span>
        <div className="h-px w-8 bg-gold-secondary/40" />
      </div>
      {note && <p className="mt-1.5 font-serif text-xs italic text-cream-parchment/40">{note}</p>}
    </div>
  );
}

function DishCard({ item, onSelect }: { item: MenuItem; onSelect: (item: MenuItem) => void }) {
  return (
    <div
      id={`menu-item-${item.id}`}
      onClick={() => onSelect(item)}
      className="group cursor-pointer p-2 transition-all hover:bg-gold-secondary/5 border border-transparent hover:border-gold-secondary/15"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <h3 className="font-cinzel text-[15px] font-bold tracking-wider uppercase text-gold-bright group-hover:text-gold-primary transition-colors inline-block">
            {item.name}
          </h3>
          {item.isSpecial && (
            <span className="inline-block border border-gold-primary px-1.5 py-0.5 text-[9px] font-mono tracking-widest text-gold-primary font-bold uppercase shrink-0">
              HAUS-SPEZIALITÄT
            </span>
          )}
        </div>
        {item.price && (
          <span className="shrink-0 font-cinzel text-xs font-semibold uppercase text-gold-secondary">
            {item.price}
          </span>
        )}
      </div>

      <p className="mt-2 font-serif text-sm text-cream-parchment/60 leading-relaxed">
        {item.description}
      </p>

      {/* Price variants (e.g. burger meats) */}
      {item.variants && (
        <div className="mt-3 space-y-1.5">
          {item.variants.map((variant) => (
            <div
              key={variant.label}
              className="flex items-baseline justify-between gap-2 border-t border-gold-secondary/10 pt-1.5"
            >
              <span className="font-cinzel text-[13px] tracking-wider text-cream-parchment/80">
                {variant.label}
              </span>
              <span className="shrink-0 font-cinzel text-xs font-semibold uppercase text-gold-secondary">
                {variant.price}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DishGrid({ items, onSelect }: { items: MenuItem[]; onSelect: (item: MenuItem) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
      {items.map((item) => (
        <DishCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="my-16 flex items-center justify-center space-x-4">
      <div className="h-[1px] w-32 bg-gradient-to-r from-transparent to-gold-secondary/60" />
      <svg className="h-6 w-6 text-gold-secondary/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor" />
      </svg>
      <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-gold-secondary/60" />
    </div>
  );
}

/* ============================================================
 *  MAIN VIEW
 * ============================================================ */

export default function MenuView({ onNavigate }: MenuViewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleReserveDish = (item: MenuItem) => {
    const textMsg = `Ich möchte einen Tisch reservieren und freue mich besonders auf das Gericht: ${item.name} (${priceLabel(item)})`;
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

      {/* ================= VORSPEISEN ================= */}
      <MenuPanel id="section-vorspeisen" title="Vorspeisen" subtitle="Gustatio" className="mt-16">
        <SubHeader label="Warm" />
        <DishGrid items={vorspeisenWarm} onSelect={handleItemClick} />

        <div className="mt-14">
          <SubHeader label="Kalt" />
          <DishGrid items={vorspeisenKalt} onSelect={handleItemClick} />
        </div>
      </MenuPanel>

      <SectionDivider />

      {/* ================= HAUPTSPEISEN ================= */}
      <MenuPanel id="section-hauptspeisen" title="Hauptspeisen">
        <SubHeader label="Für Erwachsene" />
        <DishGrid items={hauptErwachsene} onSelect={handleItemClick} />

        <div className="mt-14">
          <SubHeader label="Für Kinder" note="Prinzessinnen & Knaben" />
          <DishGrid items={hauptKinder} onSelect={handleItemClick} />
        </div>
      </MenuPanel>

      <SectionDivider />

      {/* ================= NACHSPEISEN ================= */}
      <MenuPanel id="section-nachspeisen" title="Nachspeisen">
        <SubHeader label="Für Kinder" />
        <DishGrid items={nachspeisen} onSelect={handleItemClick} />
      </MenuPanel>

      {/* Decorative interactive tip */}
      <div className="mt-12 text-center">
        <p className="font-serif text-xs italic text-gold-secondary/60">
          * Klickt auf ein Gericht, um mehr über dessen mittelalterliche Zubereitung und Empfehlungen zu erfahren.
        </p>
      </div>

      {/* ================= PDF SPEISEKARTE SECTION ================= */}
      <MenuPanel
        id="section-pdf-speisekarte"
        title="Gesamt-Speisekarte (PDF)"
        icon={<FileText className="h-4 w-4 text-gold-primary" />}
        className="mt-20"
      >
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
      </MenuPanel>

      {/* ================= DETAIL POPUP WINDOW (Interactive Modality) ================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-black/85 backdrop-blur-sm transition-all duration-300">
          <div
            id="dish-detail-modal"
            className="relative w-full max-w-xl border-2 border-gold-primary bg-tavern-dark p-6 md:p-8 text-cream-parchment animate-in fade-in zoom-in-95 duration-200"
          >
            <GildedCorners />

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
                src={selectedItem.type === 'hauptgang' || selectedItem.isSpecial ? roastedPigImage : candlelitGobletImage}
                alt={selectedItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-75 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tavern-dark to-transparent" />
              <div className="absolute bottom-4 left-4 border border-gold-primary bg-void-black/80 px-3 py-1 font-mono text-[10px] tracking-widest text-gold-primary font-bold uppercase">
                {typeBadge(selectedItem)}
              </div>
            </div>

            {/* Details */}
            <div className="flex items-baseline justify-between gap-3 border-b border-gold-secondary/20 pb-2 mb-4">
              <h3 className="font-cinzel text-xl font-bold tracking-widest text-gold-primary uppercase">
                {selectedItem.name}
              </h3>
              {priceLabel(selectedItem) && (
                <span className="shrink-0 font-cinzel text-sm font-semibold uppercase text-gold-bright">
                  {priceLabel(selectedItem)}
                </span>
              )}
            </div>

            <p className="font-serif text-base text-cream-parchment/90 leading-relaxed mb-6 italic">
              "{selectedItem.description}"
            </p>

            {/* Price variants in detail view */}
            {selectedItem.variants && (
              <div className="mb-6 border border-gold-secondary/20 bg-void-black/40 p-4">
                <p className="font-cinzel text-xs font-bold text-gold-secondary tracking-widest uppercase mb-3">
                  ZUR WAHL:
                </p>
                <div className="space-y-2">
                  {selectedItem.variants.map((variant) => (
                    <div key={variant.label} className="flex items-baseline justify-between gap-2">
                      <span className="font-cinzel text-sm tracking-wider text-cream-parchment/90">
                        {variant.label}
                      </span>
                      <span className="shrink-0 font-cinzel text-xs font-semibold uppercase text-gold-secondary">
                        {variant.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tavern Lore Description */}
            <div className="bg-void-black/55 border-l-2 border-gold-primary p-4 mb-6 text-sm">
              <p className="font-cinzel text-xs font-bold text-gold-secondary tracking-widest uppercase mb-1">
                KULINARISCHE EMPFEHLUNG:
              </p>
              <p className="font-serif text-cream-parchment/70 leading-relaxed">
                {recommendation(selectedItem)}
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
