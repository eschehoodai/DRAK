/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Screen, MenuItem, MenuVariant } from '../types';
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

/**
 * Convert a price in Talern (Euro-Gegenwert) into the tavern's coinage.
 * 1 Silber = 100 Kupfer.  coin(5.9) → "5 Silber & 90 Kupfer", coin(7) → "7 Silber".
 */
function coin(taler: number): string {
  const total = Math.round(taler * 100);
  const silber = Math.floor(total / 100);
  const kupfer = total % 100;
  return kupfer === 0 ? `${silber} Silber` : `${silber} Silber & ${kupfer} Kupfer`;
}

/** Build size/price variants, e.g. variants(['0,2L', 3.2], ['0,4L', 4.1]). */
function variants(...pairs: [string, number][]): MenuVariant[] {
  return pairs.map(([label, taler]) => ({ label, price: coin(taler) }));
}

/* ============================================================
 *  DRINKS DATA — grouped by section & sub-category
 * ============================================================ */

/* ---- Geistiges aus der Alchemistenküche (Liköre, 2cl / 4cl) ---- */
const likoere: MenuItem[] = [
  { id: 'lik1', name: 'Maraska Kršikovac', description: 'Fruchtiger Birnenlikör', variants: variants(['2cl', 2.9], ['4cl', 5.1]), type: 'getraenk' },
  { id: 'lik2', name: 'Maraska Orahovec', description: 'Kräuterlikör', variants: variants(['2cl', 2.9], ['4cl', 5.1]), type: 'getraenk' },
  { id: 'lik3', name: 'Maraska Pelinkovac', description: 'Bitterlikör mit Wermut', variants: variants(['2cl', 2.9], ['4cl', 5.1]), type: 'getraenk' },
  { id: 'lik4', name: 'Bärenjäger', description: 'Honiglikör', variants: variants(['2cl', 3.7], ['4cl', 7.0]), type: 'getraenk' },
  { id: 'lik5', name: 'Marie Brizard Menthe Verte', description: 'Minzlikör', variants: variants(['2cl', 3.7], ['4cl', 7.0]), type: 'getraenk' },
  { id: 'lik6', name: 'Waldgeist', description: 'Waldmeisterlikör', variants: variants(['2cl', 2.0], ['4cl', 4.0]), type: 'getraenk' },
  { id: 'lik7', name: 'Bols', description: 'Holunderblütenlikör', variants: variants(['2cl', 3.0], ['4cl', 5.1]), type: 'getraenk' },
];

/* ---- Agrest & Verjus (Fruchtsäfte, 0,2L / 0,4L) ---- */
const saefte: MenuItem[] = [
  { id: 'saf1', name: 'Orange', variants: variants(['0,2L', 3.2], ['0,4L', 4.1]), type: 'getraenk' },
  { id: 'saf2', name: 'Multivitamin', variants: variants(['0,2L', 3.2], ['0,4L', 4.1]), type: 'getraenk' },
  { id: 'saf3', name: 'Banane', variants: variants(['0,2L', 3.2], ['0,4L', 4.1]), type: 'getraenk' },
  { id: 'saf4', name: 'Sauerkirsche', variants: variants(['0,2L', 3.2], ['0,4L', 4.1]), type: 'getraenk' },
  { id: 'saf5', name: 'Apfel', variants: variants(['0,2L', 3.2], ['0,4L', 4.1]), type: 'getraenk' },
  { id: 'saf6', name: 'Apfelschorle', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
];

/* ---- Wasser (0,2L / 0,4L / 0,75L) ---- */
const wasser: MenuItem[] = [
  { id: 'was1', name: 'Still', variants: variants(['0,2L', 2.5], ['0,4L', 3.8], ['0,75L', 6.5]), type: 'getraenk' },
  { id: 'was2', name: 'Medium', variants: variants(['0,2L', 2.5], ['0,4L', 3.8], ['0,75L', 6.5]), type: 'getraenk' },
  { id: 'was3', name: 'Spritzig', variants: variants(['0,2L', 2.5], ['0,4L', 3.8], ['0,75L', 6.5]), type: 'getraenk' },
];

/* ---- Absud & Kraut (Heißgetränke) ---- */
const heissGetraenke: MenuItem[] = [
  { id: 'heg1', name: 'Tee nach Wahl', price: coin(3.8), type: 'getraenk' },
  { id: 'heg2', name: 'Tschechischer Tee', description: 'Becherovka, Orangen- & Zitronensaft, Orange', price: coin(4.8), type: 'getraenk' },
  { id: 'heg3', name: 'Tschechischer Türkischer Kaffee', price: coin(2.8), type: 'getraenk' },
];

/* ---- Vinum (Weine, 0,2L / 0,75L) ---- */
const weine: MenuItem[] = [
  { id: 'win1', name: 'Dornfelder Rot', description: 'Trocken', variants: variants(['0,2L', 5.9], ['0,75L', 18.9]), type: 'getraenk' },
  { id: 'win2', name: 'Dornfelder Rot', description: 'Halbtrocken', variants: variants(['0,2L', 5.9], ['0,75L', 18.9]), type: 'getraenk' },
  { id: 'win3', name: 'Dornfelder Rosé', description: 'Halbtrocken', variants: variants(['0,2L', 5.9], ['0,75L', 18.9]), type: 'getraenk' },
  { id: 'win4', name: 'Grauburgunder Weiß', description: 'Trocken', variants: variants(['0,2L', 5.9], ['0,75L', 18.9]), type: 'getraenk' },
  { id: 'win5', name: 'Vinumschorle', description: 'Weinschorle · 0,2 L', price: coin(5.1), type: 'getraenk' },
  { id: 'win6', name: 'Rotkäppchen Piccolo', description: 'Piccolo 0,2 L · trocken, rosé oder alkoholfrei', price: coin(4.5), type: 'getraenk' },
];

/* ---- Trunk der Asen (Met, je 0,25 L) ---- */
const met: MenuItem[] = [
  { id: 'met1', name: 'Thors Trunk', description: 'Weißer Met', price: coin(5.5), type: 'getraenk' },
  { id: 'met2', name: 'Drachenblut', description: 'Roter Met', price: coin(5.5), type: 'getraenk' },
  { id: 'met3', name: 'Hanf-Met', price: coin(5.5), type: 'getraenk' },
];

/* ---- Ungebrautes (alkoholfrei) ---- */
const zuckerwasserFass: MenuItem[] = [
  { id: 'zwf1', name: 'Himbeere', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
  { id: 'zwf2', name: 'Cola', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
  { id: 'zwf3', name: 'Traube', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
];

const zuckerwasserFlasche: MenuItem[] = [
  { id: 'zwv1', name: 'Fanta', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
  { id: 'zwv2', name: 'Sprite', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
  { id: 'zwv3', name: 'Mezzo Mix', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
  { id: 'zwv4', name: 'Kofola', variants: variants(['0,2L', 3.1], ['0,4L', 4.2]), type: 'getraenk' },
];

const bitterzuckerwasser: MenuItem[] = [
  { id: 'biz1', name: 'Ginger Ale', price: coin(3.2), type: 'getraenk' },
  { id: 'biz2', name: 'Tonic Water', price: coin(3.2), type: 'getraenk' },
];

/* ---- Gebräu (Biere, 0,3L / 0,5L) ---- */
const biere: MenuItem[] = [
  { id: 'bie1', name: 'Cervisia – Der Mönche Gebräu', description: 'Wechselnde Sorten: Svijany 450, Geschnittenes Bier, Baronin Dunkles u. a.', variants: variants(['0,3L', 3.1], ['0,5L', 4.9]), type: 'getraenk' },
  { id: 'bie2', name: 'Radler', variants: variants(['0,3L', 3.1], ['0,5L', 4.9]), type: 'getraenk' },
  { id: 'bie3', name: 'Lübzer', description: 'Alkoholfrei', variants: variants(['0,3L', 3.8], ['0,5L', 4.9]), type: 'getraenk' },
  { id: 'bie4', name: 'Erdinger Weizen', description: 'Alkoholfrei', variants: variants(['0,3L', 3.8], ['0,5L', 4.9]), type: 'getraenk' },
];

/* ---- Spezialitäten (2cl / 4cl) ---- */
const spezialitaeten: MenuItem[] = [
  { id: 'spz1', name: 'Madame Geneva Gin', description: '44 %', variants: variants(['2cl', 5.1], ['4cl', 9.0]), type: 'getraenk' },
  { id: 'spz2', name: 'Madame Geneva Gin', description: '41,9 %', variants: variants(['2cl', 4.7], ['4cl', 8.5]), type: 'getraenk' },
  { id: 'spz3', name: 'Herzdame', description: '21 %', variants: variants(['2cl', 4.0], ['4cl', 7.1]), type: 'getraenk' },
  { id: 'spz4', name: 'Kreuzritter', description: 'Kräuterschnaps · 30 %', variants: variants(['2cl', 4.1], ['4cl', 9.0]), type: 'getraenk' },
  { id: 'spz5', name: 'Zingiba Aperitivum', description: '20 %', variants: variants(['2cl', 3.0], ['4cl', 5.1]), type: 'getraenk' },
  { id: 'spz6', name: 'Williams Birne', description: 'Birnenlikör', variants: variants(['2cl', 4.4], ['4cl', 7.9]), type: 'getraenk' },
];

/* ---- Hexens Gebräu (Cocktails, je 0,4 L) ---- */
const cocktails: MenuItem[] = [
  { id: 'cok1', name: 'Aperol Spritz', price: coin(7.9), type: 'getraenk' },
  { id: 'cok2', name: 'Gin Tonic', price: coin(7.9), type: 'getraenk' },
  { id: 'cok3', name: '43er Kirsch', price: coin(7.9), type: 'getraenk' },
];

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

      {item.description && (
        <p className="mt-2 font-serif text-sm text-cream-parchment/60 leading-relaxed">
          {item.description}
        </p>
      )}

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

function GroupHeading({
  label,
  note,
  className = '',
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center space-x-4">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold-secondary/70" />
        <h3 className="font-cinzel text-xl font-bold tracking-[0.2em] text-gold-primary uppercase sm:text-2xl">
          {label}
        </h3>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold-secondary/70" />
      </div>
      {note && (
        <p className="mt-2 font-serif text-sm italic text-cream-parchment/50 tracking-wide">
          {note}
        </p>
      )}
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

      <SectionDivider />

      {/* ================= DIE TRÄNKE (sub-hero) ================= */}
      <div id="section-traenke" className="text-center">
        <h2 className="font-cinzel text-3xl font-extrabold tracking-widest text-gold-bright sm:text-4xl">
          DIE TRÄNKE
        </h2>

        <div className="my-6 flex items-center justify-center space-x-4">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold-secondary" />
          <svg className="h-4 w-4 text-gold-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor" />
          </svg>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold-secondary" />
        </div>

        <p className="mx-auto max-w-2xl font-serif text-lg italic text-cream-parchment/80 leading-relaxed">
          Edle Weine, kräftiger Met und allerlei Gebräu – gereicht in Silber und Kupfer.
        </p>
      </div>

      {/* ----- Gruppe: Alkoholfrei ----- */}
      <GroupHeading label="Ohne Gehalt" note="Alkoholfreie Tränke – kalt & warm" className="mt-12" />

      {/* ================= AGREST & VERJUS ================= */}
      <MenuPanel id="section-saefte" title="Agrest & Verjus" className="mt-16">
        <SubHeader label="Fruchtsäfte" note="0,2L / 0,4L" />
        <DishGrid items={saefte} />
      </MenuPanel>

      <SectionDivider />

      {/* ================= WASSER ================= */}
      <MenuPanel id="section-wasser" title="Wasser" subtitle="Aqua">
        <SubHeader label="Quellwasser" note="Still · Medium · Spritzig" />
        <DishGrid items={wasser} />
      </MenuPanel>

      <SectionDivider />

      {/* ================= UNGEBRAUTES ================= */}
      <MenuPanel id="section-ungebrautes" title="Ungebrautes">
        <SubHeader label="Zuckerwasser vom Fass" note="0,2L / 0,4L" />
        <DishGrid items={zuckerwasserFass} />

        <div className="mt-14">
          <SubHeader label="Zuckerwasser aus der Vlesche" note="0,2L / 0,4L" />
          <DishGrid items={zuckerwasserFlasche} />
        </div>

        <div className="mt-14">
          <SubHeader label="Bitterzuckerwasser" note="Je 0,2 Liter" />
          <DishGrid items={bitterzuckerwasser} />
        </div>
      </MenuPanel>

      <SectionDivider />

      {/* ================= ABSUD & KRAUT ================= */}
      <MenuPanel id="section-absud" title="Absud & Kraut">
        <SubHeader label="Heiße Tränke" />
        <DishGrid items={heissGetraenke} />
      </MenuPanel>

      {/* ----- Gruppe: Alkoholisch ----- */}
      <GroupHeading label="Mit Gehalt" note="Geistreiche & gegorene Tränke" className="mt-20" />

      {/* ================= GEISTIGES ================= */}
      <MenuPanel id="section-geistiges" title="Geistiges" subtitle="Aqua vitae" className="mt-16">
        <SubHeader label="Aus der Alchemistenküche" note="Liköre & Geistiges · Preise je 2cl / 4cl" />
        <DishGrid items={likoere} />
      </MenuPanel>

      <SectionDivider />

      {/* ================= AEGIS TRUNK ================= */}
      <MenuPanel id="section-aegis" title="Aegis Trunk" subtitle="Aus den deutschen Grafschaften & Fürstentümern">
        <SubHeader label="Vinum" note="Weine · 0,2L / 0,75L" />
        <DishGrid items={weine} />

        <div className="mt-14">
          <SubHeader label="Trunk der Asen" note="Met · je 0,25 Liter" />
          <DishGrid items={met} />
        </div>
      </MenuPanel>

      <SectionDivider />

      {/* ================= GEBRÄU ================= */}
      <MenuPanel id="section-gebraeu" title="Gebräu" subtitle="Cervisia">
        <SubHeader label="Biere" note="0,3L / 0,5L" />
        <DishGrid items={biere} />
      </MenuPanel>

      <SectionDivider />

      {/* ================= SPEZIALITÄTEN ================= */}
      <MenuPanel id="section-spezialitaeten" title="Spezialitäten">
        <SubHeader label="Hochprozentiges" note="Preise je 2cl / 4cl" />
        <DishGrid items={spezialitaeten} />

        <div className="mt-14">
          <SubHeader label="Hexens Gebräu" note="Cocktails · je 0,4 Liter" />
          <DishGrid items={cocktails} />
        </div>
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
