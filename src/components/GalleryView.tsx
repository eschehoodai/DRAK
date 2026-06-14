/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Screen } from '../types';
import { Camera, ZoomIn, X, Calendar } from 'lucide-react';
import feastHallImage from '../assets/images/feast_hall_1781370910972.jpg';
import roastedPigImage from '../assets/images/roasted_pig_1781370924159.jpg';
import candlelitGobletImage from '../assets/images/candlelit_goblet_1781370897386.jpg';
import speiseImage from '../assets/images/Speise2.webp';

interface GalleryViewProps {
  onNavigate: (screen: Screen) => void;
}

/* ============================================================
 *  GALLERY DATA — impressions of the tavern
 * ============================================================ */

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  caption: string;
  /** Grid span classes that control the masonry layout on larger screens. */
  span: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 'g1',
    src: feastHallImage,
    title: 'Der große Festsaal',
    caption: 'Schwere Eichentische unter kreuzförmigen Deckenbögen — bereit für königliche Gelage.',
    span: 'sm:col-span-2 lg:col-span-2 lg:row-span-2',
  },
  {
    id: 'g2',
    src: roastedPigImage,
    title: 'Vom offenen Feuer',
    caption: 'Knuspriger Braten, langsam über glühenden Kohlen gegart.',
    span: 'sm:col-span-2 lg:col-span-2',
  },
  {
    id: 'g3',
    src: candlelitGobletImage,
    title: 'Beim Kerzenschein',
    caption: 'Ein voller Becher und gedämpftes Licht in behaglicher Atmosphäre.',
    span: '',
  },
  {
    id: 'g4',
    src: speiseImage,
    title: 'Edle Tafelfreuden',
    caption: 'Deftige Speisen, angerichtet nach uralten Rezepten.',
    span: '',
  },
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

function GalleryCard({ image, onSelect }: { image: GalleryImage; onSelect: (image: GalleryImage) => void }) {
  return (
    <button
      id={`gallery-item-${image.id}`}
      onClick={() => onSelect(image)}
      className={`group relative overflow-hidden border border-gold-secondary/30 bg-void-black text-left transition-all duration-300 hover:border-gold-primary ${image.span}`}
    >
      <GildedCorners />

      <img
        src={image.src}
        alt={image.title}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="h-full w-full object-cover opacity-80 filter contrast-110 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
      />

      {/* Dark gradient overlay for caption legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/20 to-transparent" />

      {/* Hover zoom hint */}
      <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center border border-gold-primary bg-void-black/80 text-gold-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <ZoomIn className="h-4 w-4" />
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-cinzel text-base font-bold uppercase tracking-widest text-gold-bright drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {image.title}
        </h3>
        <p className="mt-1 font-serif text-xs italic leading-relaxed text-cream-parchment/70">
          {image.caption}
        </p>
      </div>
    </button>
  );
}

/* ============================================================
 *  MAIN VIEW
 * ============================================================ */

export default function GalleryView({ onNavigate }: GalleryViewProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 md:px-8">
      {/* Background radial highlight */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gold-primary/5 blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center">
        <div className="mb-4 inline-flex items-center space-x-2 border border-gold-primary/40 bg-void-black/80 px-4 py-1 font-cinzel text-[10px] tracking-widest text-gold-primary uppercase font-bold">
          <Camera className="h-3 w-3" />
          <span>Impressionen aus der Taverne</span>
        </div>

        <h1 id="gallery-title" className="font-cinzel text-4xl font-extrabold tracking-widest text-gold-bright sm:text-5xl">
          DIE BILDERGALERIE
        </h1>

        {/* Filigree Diamond Divider */}
        <div className="my-6 flex items-center justify-center space-x-4">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold-secondary" />
          <svg className="h-4 w-4 text-gold-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor" />
          </svg>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold-secondary" />
        </div>

        <p id="gallery-subtitle" className="mx-auto max-w-2xl font-serif text-lg italic text-cream-parchment/80 leading-relaxed">
          Werft einen Blick in unsere Gewölbe — von flackerndem Kerzenschein bis zu dampfenden Festtafeln. Klickt auf ein Bild, um es in voller Pracht zu betrachten.
        </p>
      </div>

      {/* ================= IMAGE GRID ================= */}
      <div className="mt-16 grid auto-rows-[260px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {galleryImages.map((image) => (
          <GalleryCard key={image.id} image={image} onSelect={setSelectedImage} />
        ))}
      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      {selectedImage && (
        <div
          id="gallery-lightbox"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-black/90 backdrop-blur-sm transition-all duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl border-2 border-gold-primary bg-tavern-dark p-3 text-cream-parchment animate-in fade-in zoom-in-95 duration-200"
          >
            <GildedCorners />

            {/* Close Button */}
            <button
              id="close-gallery-lightbox"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center border border-gold-secondary bg-void-black/80 text-gold-secondary hover:text-gold-bright p-1 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Enlarged Image */}
            <div className="relative max-h-[70vh] w-full overflow-hidden border border-gold-secondary/30 bg-void-black">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            {/* Caption */}
            <div className="px-3 pb-2 pt-4 text-center">
              <h3 className="font-cinzel text-xl font-bold tracking-widest text-gold-primary uppercase">
                {selectedImage.title}
              </h3>
              <p className="mt-2 font-serif text-sm italic text-cream-parchment/80 leading-relaxed">
                "{selectedImage.caption}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= CLOSING CTA ================= */}
      <div className="mt-20 border border-gold-primary/30 p-12 bg-tavern-dark/45 relative overflow-hidden text-center">
        <GildedCorners />

        <h3 className="font-cinzel text-xl md:text-2xl font-black text-gold-bright tracking-widest uppercase mb-4">
          Lust bekommen, selbst einzukehren?
        </h3>
        <p className="font-serif text-sm text-cream-parchment/70 max-w-xl mx-auto leading-relaxed mb-8">
          Was Ihr hier auf den Bildern seht, erlebt Ihr in unseren Gewölben am eigenen Leibe. Sichert Euch Euren Platz an der Festtafel.
        </p>
        <button
          id="gallery-cta-reserve"
          onClick={() => onNavigate(Screen.RESERVE)}
          className="inline-flex items-center space-x-2 bg-gold-primary border border-gold-primary px-8 py-4 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer"
        >
          <Calendar className="h-4 w-4" />
          <span>Tisch Reservieren</span>
        </button>
      </div>
    </section>
  );
}
