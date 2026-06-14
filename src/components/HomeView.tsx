/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Screen } from '../types';
import { Shield, Sparkles, BookOpen, Quote, Flame, MapPin } from 'lucide-react';
import candlelitGobletImage from '../assets/images/Speise2.webp';
import headerVideo from '../assets/images/headervideo.webm';

interface HomeViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="relative overflow-hidden">
      {/* ================= HERO BANNER SECTION ================= */}
      <section className="relative h-[650px] w-full border-b border-gold-secondary/30 bg-void-black">
        {/* Hero Video Background */}
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <video
            src={headerVideo}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-60 scale-105 filter contrast-125 saturate-75 brightness-75 transition-all duration-700 hover:scale-100"
          >
            {/* Fallback image for browsers that do not support the video tag */}
            <img
              src={candlelitGobletImage}
              alt="DRAK Festsaal Banquet"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </video>
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-void-black to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 md:px-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 border border-gold-primary/40 bg-void-black/80 px-4 py-1 font-cinzel text-[10px] tracking-widest text-gold-primary uppercase font-bold">
              <Flame className="h-3 w-3 text-gold-primary candle-glow" />
              <span>Gegründet im Jahre des Herrn MMXIV</span>
            </div>

            <h1 className="font-cinzel text-5xl font-black tracking-widest text-gold-bright sm:text-6xl md:text-7xl leading-none">
              DRACHENTAVERNE ZITTAU
            </h1>

            <p className="font-cinzel text-xs tracking-widest text-gold-primary/80 -mt-4">
              Regionale Küche · Biergarten · Tischreservierung
            </p>

            <p className="font-serif text-lg leading-relaxed text-cream-parchment/90 md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Wo edle Recken, kluge Kleriker und dürstige Abenteurer an schweren Eichentischen zusammenkommen. Tretet ein und labt Euch an unseren Braten — regionale Küche aus Zittau, frisch zubereitet im Herzen der Oberlausitz. Reserviert jetzt Euren Tisch im gemütlichen Gasthaus oder im schattigen Biergarten.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                id="hero-btn-menu"
                onClick={() => onNavigate(Screen.MENU)}
                className="bg-gold-primary border border-gold-primary px-8 py-4 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer text-center"
              >
                Die Speisekarte studieren
              </button>
              <button
                id="hero-btn-reserve"
                onClick={() => onNavigate(Screen.RESERVE)}
                className="border border-gold-secondary bg-void-black/60 backdrop-blur-sm px-8 py-4 font-cinzel text-xs font-bold uppercase tracking-widest text-gold-secondary hover:text-gold-bright hover:bg-gold-secondary/15 transition-all cursor-pointer text-center"
              >
                Hoftafel Reservieren
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEGEND STORY SECTION ================= */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:px-8 relative">
        <div id="home-glow-1" className="absolute top-[40%] right-0 h-80 w-80 rounded-full bg-gold-primary/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Legend Text */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-gold-primary font-cinzel text-xs font-extrabold tracking-widest uppercase">
              <BookOpen className="h-4 w-4" />
              <span>Unsere Sage</span>
            </div>
            <h2 className="font-cinzel text-3xl font-bold tracking-widest text-gold-bright uppercase">
              Die Drachentaverne — Regionale Küche mit Geschichte
            </h2>

            <p className="font-serif text-cream-parchment/80 leading-relaxed text-base pt-2">
              <span className="float-left mr-3 font-cinzel text-6xl font-black text-gold-primary leading-none mt-2">I</span>
              m Herzen von Zittau, am Fuße des Zittauer Gebirges und unweit der berühmten Zittauer Fastentücher, lädt die Drachentaverne zu regionalen Genüssen aus der Oberlausitz ein. Was vor Jahrhunderten als Herberge für Reisende, Handwerker und Händler begann, ist heute ein Gasthaus mit Charakter: deftige Hausmannskost, Fleischgerichte vom heimischen Metzger, täglich frisches Brot aus der Region und ein kühles Bier aus sächsischer Brautradition.
            </p>

            <p className="font-cinzel text-sm font-bold tracking-widest text-gold-primary uppercase pt-4">Was Euch erwartet:</p>
            <ul className="font-serif text-cream-parchment/80 leading-relaxed text-base space-y-2 pt-2">
              <li><strong className="text-gold-primary">Regionale Küche</strong> — ehrlich, deftig, mit Zutaten aus der Oberlausitz</li>
              <li><strong className="text-gold-primary">Biergarten</strong> — unter freiem Himmel, mit Blick auf die historische Altstadt Zittaus</li>
              <li><strong className="text-gold-primary">Tischreservierung</strong> — einfach online oder telefonisch einen Platz sichern</li>
            </ul>

            <p className="font-serif text-cream-parchment/80 leading-relaxed text-base pt-4">
              Ob nach einem Bummel durch Zittaus Altstadt, einem Besuch der Frauenkirche oder einer Wanderung durch das Zittauer Gebirge — in der Drachentaverne kehrt ihr ein, wo seit jeher Gäste willkommen sind.
            </p>

            <p className="font-cinzel text-sm font-bold tracking-widest text-gold-primary pt-4">
              Jetzt Tisch reservieren und Platz im Biergarten sichern!
            </p>

            <div className="border-t border-gold-secondary/25 pt-6 flex space-x-6">
              <div>
                <span className="font-cinzel text-3xl font-black text-gold-primary tracking-widest">XII</span>
                <p className="font-serif text-xs text-cream-parchment/50 uppercase tracking-widest mt-1">Stunden geschmort</p>
              </div>
              <div className="border-l border-gold-secondary/25 pl-6">
                <span className="font-cinzel text-3xl font-black text-gold-primary tracking-widest">100%</span>
                <p className="font-serif text-xs text-cream-parchment/50 uppercase tracking-widest mt-1">Holzkohlegrill</p>
              </div>
              <div className="border-l border-gold-secondary/25 pl-6">
                <span className="font-cinzel text-3xl font-black text-gold-primary tracking-widest">II</span>
                <p className="font-serif text-xs text-cream-parchment/50 uppercase tracking-widest mt-1">Gewölbekammern</p>
              </div>
            </div>
          </div>

          {/* Cozy candlelit image side */}
          <div className="relative border border-gold-secondary/30 p-2 bg-void-black/40">
            <div className="gilded-corner gilded-corner-tl" />
            <div className="gilded-corner gilded-corner-tr" />
            <div className="gilded-corner gilded-corner-bl" />
            <div className="gilded-corner gilded-corner-br" />

            <div className="relative h-[380px] w-full overflow-hidden border border-gold-secondary/15">
              <img
                src={candlelitGobletImage}
                alt="DRAK Cozy Candlelit Setting"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 filter saturate-100 contrast-110 brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-black/90 via-void-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="font-cinzel text-sm font-black text-gold-bright tracking-widest uppercase">
                  Kerzenschein & Gusseisen
                </h4>
                <p className="font-serif text-xs text-cream-parchment/70 leading-relaxed mt-1">
                  Verbringt Eure Abende in behaglicher, geschichtsträchtiger Atmosphäre bei authentischen Klängen und gedämpftem Licht.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VAULTS & CHAMBERS SECTION ================= */}
      <section className="bg-tavern-dark/20 border-y border-gold-secondary/20 py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-cinzel text-3xl font-bold tracking-widest text-gold-bright uppercase">
              Unsere Zwei Gewölbe
            </h2>
            <p className="font-serif text-sm text-cream-parchment/60 leading-relaxed mt-3">
              Jeder Winkel unserer Schenke erzählt seine eigene Sage. Wählt den Ort, der Eurem Zirkel am besten gefällt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chamber 1 */}
            <div id="chamber-card-grosse-kathedrale" className="relative border border-gold-secondary/30 bg-void-black p-8 md:p-10 flex flex-col justify-between min-h-[22rem] group hover:border-gold-primary transition-all duration-300">
              <div className="gilded-corner gilded-corner-tl" />
              <div className="gilded-corner gilded-corner-tr" />
              <div className="gilded-corner gilded-corner-bl" />
              <div className="gilded-corner gilded-corner-br" />

              <div className="space-y-5">
                <span className="font-cinzel text-xs font-black tracking-widest text-gold-primary uppercase block">
                  I. Der Hauptsaal
                </span>
                <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-cream-parchment group-hover:text-gold-bright transition-colors">
                  Die Große Kathedrale
                </h3>
                <p className="font-serif text-base leading-relaxed text-cream-parchment/70">
                  Massive, kreuzförmige Deckenbögen, schwere Eichentische für große Bünde, beleuchtet von gewaltigen, flackernden Eisenkronleuchtern über dem Kamin. Ideal für königliche Gelage.
                </p>
              </div>
              <button
                id="btn-chamber-kit"
                onClick={() => onNavigate(Screen.RESERVE)}
                className="mt-6 text-left font-cinzel text-xs tracking-widest font-bold text-gold-secondary hover:text-gold-bright transition-colors uppercase cursor-pointer"
              >
                Hier Platz nehmen →
              </button>
            </div>

            {/* Chamber 2 - Biergarten */}
            <div id="chamber-card-biergarten" className="relative border border-gold-secondary/30 bg-void-black p-8 md:p-10 flex flex-col justify-between min-h-[22rem] group hover:border-gold-primary transition-all duration-300">
              <div className="gilded-corner gilded-corner-tl" />
              <div className="gilded-corner gilded-corner-tr" />
              <div className="gilded-corner gilded-corner-bl" />
              <div className="gilded-corner gilded-corner-br" />

              <div className="space-y-5">
                <span className="font-cinzel text-xs font-black tracking-widest text-gold-primary uppercase block">
                  II. Der Biergarten
                </span>
                <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-cream-parchment group-hover:text-gold-bright transition-colors">
                  Unter den alten Linden
                </h3>
                <p className="font-serif text-base leading-relaxed text-cream-parchment/70">
                  Ein lauschiger Biergarten im Schatten uralter Linden, mit rustikalen Holzbänken und dem sanften Plätschern des Brunnens. Hier genießt Ihr kühles Bier, deftige Brotzeiten und schwäbische Spezialitäten unter freiem Himmel.
                </p>
              </div>
              <button
                id="btn-chamber-biergarten"
                onClick={() => onNavigate(Screen.RESERVE)}
                className="mt-6 text-left font-cinzel text-xs tracking-widest font-bold text-gold-secondary hover:text-gold-bright transition-colors uppercase cursor-pointer"
              >
                Im Biergarten anstoßen →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS / TESTIMONIALS SECTION ================= */}
      <section className="mx-auto max-w-4xl px-4 py-24 md:px-8 relative text-center">
        <div id="home-glow-2" className="absolute bottom-[30%] left-0 h-80 w-80 rounded-full bg-gold-primary/5 blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-6 text-gold-secondary">
          <Quote className="h-8 w-8 opacity-40" />
        </div>

        <h2 className="font-cinzel text-3xl font-bold tracking-widest text-gold-bright uppercase mb-16">
          Zunftstimmen aus den Königreichen
        </h2>

        {/* Testimonials Carousel or Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {/* Review 1 */}
          <div className="relative border border-gold-secondary/20 p-6 bg-tavern-dark/10">
            <p className="font-serif text-sm italic text-cream-parchment/80 leading-relaxed">
              "Beim Lichte meiner Rüstung, so zart war kein Drache zuvor! Das Drachensteak zerging auf meiner Zunge, als wäre es von reinstem Engelsodem liebkost worden. Die Kräuter-Jus ist ein Gottesgeschenk."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="h-0.5 w-6 bg-gold-secondary" />
              <div>
                <p className="font-cinzel text-xs font-bold text-gold-primary tracking-widest uppercase">Ritter Galahad</p>
                <p className="font-serif text-[10px] text-cream-parchment/40">Drachenjäger aus dem Reich</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="relative border border-gold-secondary/20 p-6 bg-tavern-dark/10">
            <p className="font-serif text-sm italic text-cream-parchment/80 leading-relaxed">
              "Ein Elixir für Geist und Glieder! Die Suppe der Kleriker hat meine uralten Knochen nach einer viertägigen Wanderung durch die Elfenwälder im Nu belebt. Die Ambiance such ihresgleichen."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="h-0.5 w-6 bg-gold-secondary" />
              <div>
                <p className="font-cinzel text-xs font-bold text-gold-primary tracking-widest uppercase">Erzmagier Balthasar</p>
                <p className="font-serif text-[10px] text-cream-parchment/40">Meister des Hohen Rats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="mt-20 border border-gold-primary/30 p-12 bg-tavern-dark/45 relative overflow-hidden">
          {/* Decorative Corner Flourishes */}
          <div className="gilded-corner gilded-corner-tl" />
          <div className="gilded-corner gilded-corner-tr" />
          <div className="gilded-corner gilded-corner-bl" />
          <div className="gilded-corner gilded-corner-br" />

          <h3 className="font-cinzel text-xl md:text-2xl font-black text-gold-bright tracking-widest uppercase mb-4">
            Bereit für das herrschaftliche Mahl?
          </h3>
          <p className="font-serif text-sm text-cream-parchment/70 max-w-xl mx-auto leading-relaxed mb-8">
            Die Kessel brutzeln und die Krüge stehen bereit. Eilt Euch, edler Gefährte – unsere Gewölbe sind begehrt im gesamten Drachenfelsland!
          </p>
          <button
            id="bottom-cta-reserve"
            onClick={() => onNavigate(Screen.RESERVE)}
            className="bg-gold-primary border border-gold-primary px-8 py-4 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer"
          >
            Tafel für heute buchen
          </button>
        </div>
      </section>
    </div>
  );
}
