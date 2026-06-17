/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Screen, MenuItem } from '../types';
import { FileText, Download } from 'lucide-react';
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

function DishCard({ item }: { item: MenuItem }) {
  return (
    <div id={`menu-item-${item.id}`} className="p-2 border border-transparent">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <h3 className="font-cinzel text-[15px] font-bold tracking-wider uppercase text-gold-bright inline-block">
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

function DishGrid({ items }: { items: MenuItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
      {items.map((item) => (
        <DishCard key={item.id} item={item} />
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

export default function MenuView(_props: MenuViewProps) {
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
        <DishGrid items={vorspeisenWarm} />

        <div className="mt-14">
          <SubHeader label="Kalt" />
          <DishGrid items={vorspeisenKalt} />
        </div>
      </MenuPanel>

      <SectionDivider />

      {/* ================= HAUPTSPEISEN ================= */}
      <MenuPanel id="section-hauptspeisen" title="Hauptspeisen">
        <SubHeader label="Für Erwachsene" />
        <DishGrid items={hauptErwachsene} />

        <div className="mt-14">
          <SubHeader label="Für Kinder" note="Prinzessinnen & Knaben" />
          <DishGrid items={hauptKinder} />
        </div>
      </MenuPanel>

      <SectionDivider />

      {/* ================= NACHSPEISEN ================= */}
      <MenuPanel id="section-nachspeisen" title="Nachspeisen">
        <DishGrid items={nachspeisen} />
      </MenuPanel>

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
    </section>
  );
}
