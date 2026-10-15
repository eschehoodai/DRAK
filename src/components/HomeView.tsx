import React from 'react';
import { Screen } from '../types';
import { Shield, Sparkles, BookOpen, Quote, Flame, MapPin, Phone, Snowflake } from 'lucide-react';
import { useIsTavernOpen } from '../utils/openingHours';
import { trackPhoneCallClick } from '../utils/gtag';
import candlelitGobletImage from '../assets/images/Speise2.webp';
import essenDrakImage from '../assets/images/essen-restaurant-zittau-drak.jpg';
import logoDrak from '../assets/images/logo-drak.webp';
import headerVideo from '../assets/images/headervideo.webm';
import gewoelbeVideo from '../assets/images/gewölbe.mp4';
import tafelVideo from '../assets/images/tafel.webm';

const WINTER_SNOWFLAKES = [
  { id: 1, left: '8%', size: 14, duration: '7.5s', delay: '0s', opacity: 0.75 },
  { id: 2, left: '22%', size: 10, duration: '10.5s', delay: '2.8s', opacity: 0.5 },
  { id: 3, left: '38%', size: 16, duration: '8.2s', delay: '1.1s', opacity: 0.8 },
  { id: 4, left: '54%', size: 9, duration: '12s', delay: '4.5s', opacity: 0.45 },
  { id: 5, left: '68%', size: 15, duration: '9.2s', delay: '0.6s', opacity: 0.7 },
  { id: 6, left: '82%', size: 11, duration: '11.2s', delay: '3.4s', opacity: 0.55 },
  { id: 7, left: '92%', size: 13, duration: '8.8s', delay: '5.2s', opacity: 0.6 },
  { id: 8, left: '30%', size: 8, duration: '13s', delay: '6.5s', opacity: 0.4 },
  { id: 9, left: '74%', size: 12, duration: '9.8s', delay: '2.1s', opacity: 0.65 },
];

interface HomeViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const isTavernOpenNow = useIsTavernOpen();

  return (
    <div className="relative overflow-hidden">
      {/* ================= HERO BANNER SECTION ================= */}
      <section className="relative min-h-[580px] sm:h-[650px] w-full border-b border-gold-secondary/30 bg-void-black">
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
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center sm:justify-end px-4 py-8 sm:py-0 sm:pb-20 md:px-8">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 border border-gold-primary/40 bg-void-black/80 px-4 py-1 font-cinzel text-[10px] tracking-widest text-gold-primary uppercase font-bold">
              <Flame className="h-3 w-3 text-gold-primary candle-glow" />
              <span>Gegründet im Jahre des Herrn MMXIV</span>
            </div>

            <h1 className="font-cinzel text-[clamp(1.5rem,6.5vw,4.5rem)] font-black tracking-normal text-gold-bright sm:tracking-widest leading-tight sm:leading-none">
              DRACHENTAVERNE ZITTAU
            </h1>

            <p className="font-cinzel text-xs tracking-widest text-gold-primary/80 -mt-2 sm:-mt-4">
              Mittelalterliches Erlebnis-Restaurant in Zittau · Biergarten · Tischreservierung
            </p>

            <p className="font-serif text-lg leading-relaxed text-cream-parchment/90 md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Wo edle Recken, kluge Kleriker und dürstige Abenteurer an schweren Eichentischen zusammenkommen. Tretet ein und labt Euch an unseren Braten — regionale Küche aus Zittau, frisch zubereitet im Herzen der Oberlausitz. Reserviert jetzt Euren Tisch in unserem Restaurant &amp; Gasthaus oder im schattigen Biergarten.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                id="hero-btn-menu"
                onClick={() => onNavigate(Screen.MENU)}
                className="bg-gold-primary border border-gold-primary px-6 py-3.5 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer text-center"
              >
                Die Speisekarte studieren
              </button>
              <button
                id="hero-btn-reserve"
                onClick={() => onNavigate(Screen.RESERVE)}
                className="border border-gold-secondary bg-void-black/60 backdrop-blur-sm px-6 py-3.5 font-cinzel text-xs font-bold uppercase tracking-widest text-gold-secondary hover:text-gold-bright hover:bg-gold-secondary/15 transition-all cursor-pointer text-center"
              >
                Hoftafel Reservieren
              </button>
              {isTavernOpenNow && (
                <a
                  id="hero-btn-phone"
                  href="tel:035835495389"
                  onClick={trackPhoneCallClick}
                  className="border border-gold-primary/60 bg-gold-primary/10 backdrop-blur-sm px-6 py-3.5 font-cinzel text-xs font-bold uppercase tracking-widest text-gold-bright hover:bg-gold-primary hover:text-void-black transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>03583 5495389</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEGEND STORY SECTION ================= */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:px-8 relative">
        <div id="home-glow-1" className="absolute top-[40%] right-0 h-80 w-80 rounded-full bg-gold-primary/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Tier 1–3: the legend, with logo watermark behind */}
          <div className="relative">
            <img
              src={logoDrak}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute inset-0 h-full w-full opacity-30 object-contain"
            />
            <div className="relative z-10 space-y-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-gold-primary font-cinzel text-xs font-extrabold tracking-widest uppercase">
                <BookOpen className="h-4 w-4" />
                <span>Unsere Sage</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-widest text-gold-bright uppercase text-center">
                Die Drachentaverne - Euer Mittelalter-Restaurant in Zittau mit Regionaler Küche und Geschichte
              </h2>

              <p className="font-serif text-cream-parchment/80 leading-relaxed text-base pt-2 text-center">
                Im Herzen von Zittau, am Fuße des Zittauer Gebirges und unweit der berühmten Zittauer Fastentücher, lädt die Drachentaverne als einzigartiges Mittelalter-Restaurant in Zittau zu regionalen Genüssen aus der Oberlausitz ein. Was vor Jahrhunderten als Herberge für Reisende, Handwerker und Händler begann, ist heute ein Gasthaus mit Charakter: deftige Hausmannskost, Fleischgerichte vom heimischen Metzger, täglich frisches Brot aus der Region und ein kühles Bier aus sächsischer Brautradition.
              </p>

              <p className="font-serif text-cream-parchment/80 leading-relaxed text-base text-center">
                Ob nach einem Bummel durch Zittaus Altstadt, einem Besuch der Frauenkirche oder einer Wanderung durch das Zittauer Gebirge — in der Drachentaverne kehrt Ihr ein, wo seit jeher Gäste willkommen sind.
              </p>

              {/* Facts + reserve CTA */}
              <div className="border-t border-gold-secondary/25 pt-6 flex flex-col gap-5 items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gold-secondary/25 w-full text-center">
                  <div className="px-2">
                    <p className="font-cinzel text-base sm:text-lg font-bold text-gold-primary tracking-wider uppercase leading-snug">
                      Mittelalter Restaurant
                    </p>
                    <p className="font-serif text-xs text-cream-parchment/60 uppercase tracking-widest mt-1">
                      Historisches Gewölbe
                    </p>
                  </div>
                  <div className="pt-3 sm:pt-0 px-2">
                    <p className="font-cinzel text-base sm:text-lg font-bold text-gold-primary tracking-wider uppercase leading-snug">
                      Regionale Küche
                    </p>
                    <p className="font-serif text-xs text-cream-parchment/60 uppercase tracking-widest mt-1">
                      + Oberlausitzer Spezialitäten
                    </p>
                  </div>
                </div>
                <button
                  id="sage-btn-reserve"
                  onClick={() => onNavigate(Screen.RESERVE)}
                  className="w-full bg-gold-primary border border-gold-primary px-6 py-4 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer text-center whitespace-nowrap"
                >
                  Jetzt Reservieren
                </button>
              </div>
            </div>
          </div>

          {/* Regional food image */}
          <div className="relative border border-gold-secondary/30 p-2 bg-void-black/40 min-h-[24rem]">
            <div className="gilded-corner gilded-corner-tl" />
            <div className="gilded-corner gilded-corner-tr" />
            <div className="gilded-corner gilded-corner-bl" />
            <div className="gilded-corner gilded-corner-br" />

            <div className="relative h-full w-full overflow-hidden border border-gold-secondary/15">
              <img
                src={essenDrakImage}
                alt="Oberlausitzer Spezialitäten in der Drachentaverne Zittau"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-90 filter saturate-100 contrast-105 brightness-100 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-black/90 via-void-black/25 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <h4 className="font-cinzel text-sm font-black text-gold-bright tracking-widest uppercase">
                  Deftige Regional-Küche
                </h4>
                <p className="font-serif text-xs text-cream-parchment/80 leading-relaxed mt-1">
                  Frisch zubereitete Oberlausitzer Spezialitäten und herzhafte Braten in behaglicher Tafelatmosphäre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VAULTS & CHAMBERS SECTION ================= */}
      <section className="relative border-y border-gold-secondary/20 py-24 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={gewoelbeVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-void-black/75" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
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
                  Massive, kreuzförmige Deckenbögen und schwere Eichentische für große Bünde, getaucht in warmes, flackerndes Kerzenlicht. Ideal für königliche Gelage.
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

            {/* Chamber 2 - Biergarten (Winterschlaf / Eingegraut mit Frost-Animationen) */}
            <div
              id="chamber-card-biergarten"
              className="relative border border-zinc-700/60 bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-void-black/95 p-8 md:p-10 flex flex-col justify-between min-h-[22rem] group hover:border-sky-400/50 transition-all duration-500 overflow-hidden shadow-[inset_0_0_40px_rgba(180,210,240,0.03),0_8px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Frosted Corners */}
              <div className="gilded-corner gilded-corner-frost gilded-corner-tl" />
              <div className="gilded-corner gilded-corner-frost gilded-corner-tr" />
              <div className="gilded-corner gilded-corner-frost gilded-corner-bl" />
              <div className="gilded-corner gilded-corner-frost gilded-corner-br" />

              {/* Frost Ambient Radial Glow */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-sky-500/10 blur-2xl pointer-events-none animate-frost-pulse" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-slate-400/5 blur-2xl pointer-events-none" />

              {/* Shimmering Ice Sheen Light Beam */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-[120px] h-[300%] bg-gradient-to-r from-transparent via-sky-200/10 to-transparent animate-frost-shimmer -top-1/2" />
              </div>

              {/* Falling Snowflakes Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {WINTER_SNOWFLAKES.map((flake) => (
                  <div
                    key={flake.id}
                    className="absolute -top-6 text-sky-200/90 animate-snowfall"
                    style={{
                      left: flake.left,
                      animationDuration: flake.duration,
                      animationDelay: flake.delay,
                      opacity: flake.opacity,
                    }}
                  >
                    <Snowflake
                      style={{ width: `${flake.size}px`, height: `${flake.size}px` }}
                      className="drop-shadow-[0_0_6px_rgba(186,230,253,0.7)]"
                    />
                  </div>
                ))}
              </div>

              {/* Content Header & Body */}
              <div className="relative z-10 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-cinzel text-xs font-black tracking-widest text-zinc-400 uppercase block">
                    II. Der Biergarten
                  </span>

                  {/* Frosted Seasonal Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-wider uppercase bg-sky-950/70 text-sky-200 border border-sky-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                    <Snowflake className="w-3.5 h-3.5 text-sky-300 animate-spin-slow shrink-0" />
                    <span>Winterschlaf</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-zinc-300 group-hover:text-zinc-100 transition-colors">
                    Unter den alten Linden
                  </h3>
                  <p className="font-cinzel text-[11px] font-semibold tracking-wider text-sky-300/80 uppercase">
                    Ruht zur kalten Jahreszeit · Wiedereröffnung im Frühjahr
                  </p>
                </div>

                <p className="font-serif text-base leading-relaxed text-zinc-400">
                  Ein lauschiger Biergarten im Schatten uralter Linden, mit rustikalen Holzbänken. Wenn Frost und Schnee über die Zittauer Gassen ziehen, hält unser Freisitz winterliche Rast.
                </p>

                {/* Seasonal Notice Callout */}
                <div className="border border-sky-900/40 bg-zinc-900/70 rounded p-3.5 backdrop-blur-sm shadow-inner flex items-start gap-3">
                  <div className="p-2 rounded bg-sky-950/80 border border-sky-500/30 text-sky-300 shrink-0 mt-0.5">
                    <Snowflake className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-cinzel text-xs font-bold tracking-wider text-sky-200 uppercase">
                      Im Frühjahr wieder für Euch da
                    </p>
                    <p className="font-serif text-xs text-zinc-300/85 leading-relaxed">
                      Sobald die Frühlingssonne den Lindengarten erwärmt, öffnen wir die Pforten erneut für kühles Fassbier & deftige Brotzeiten unter freiem Himmel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer / Smart Transition Action */}
              <div className="relative z-10 mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="font-serif text-xs text-zinc-400 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  Freisitz pausiert
                </span>
                <button
                  id="btn-chamber-biergarten"
                  onClick={() => onNavigate(Screen.RESERVE)}
                  className="text-left font-cinzel text-xs tracking-widest font-bold text-zinc-300 hover:text-gold-bright transition-colors uppercase cursor-pointer flex items-center gap-1.5 group/btn"
                >
                  <span>Im warmen Saal Platz nehmen</span>
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </button>
              </div>
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

        <h2 className="font-cinzel text-3xl font-bold tracking-widest text-gold-bright uppercase mb-4">
          Ein Wort von unseren Gästen
        </h2>
        <p className="font-serif text-base text-cream-parchment/60 leading-relaxed mb-16">
          So kürzlich verlautet aus dem Munde zufriedener Besucher:
        </p>

        {/* Testimonials Carousel or Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {/* Review 1 */}
          <div className="relative border border-gold-primary/40 p-8 md:p-10 bg-tavern-dark/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:border-gold-primary/70 transition-all duration-300">
            <p className="font-serif text-base italic text-cream-parchment/85 leading-relaxed">
              "Wir waren am Samstag im Drak mit guten Freunden. Wir wurden sehr freundlich empfangen und das Ambiente ist richtig gut. Das Essen und die Getränke kamen sehr schnell. Die Portionen sind reichlich und es hat uns sehr gut geschmeckt. Wir kommen auf alle Fälle wieder."
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-0.5 w-6 bg-gold-secondary" />
              <div>
                <p className="font-cinzel text-sm font-bold text-gold-primary tracking-widest uppercase">Peggy Simon</p>
                <p className="font-serif text-xs text-cream-parchment/50">Bewertung on Google</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="relative border border-gold-primary/40 p-8 md:p-10 bg-tavern-dark/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:border-gold-primary/70 transition-all duration-300">
            <p className="font-serif text-base italic text-cream-parchment/85 leading-relaxed">
              "Geiles Feeling, nettes Personal. TOP Preis-Leistungs-Verhältnis. Waren zu 3., jeder hatte eine Vorsuppe, ein reichliches Hauptgericht und 4 Getränke für knapp 93,00€. Ich wünsche der Taverne ein langes Bestehen und immer nette Gäste! Wir kommen wieder!"
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-0.5 w-6 bg-gold-secondary" />
              <div>
                <p className="font-cinzel text-sm font-bold text-gold-primary tracking-widest uppercase">Mellanie Neumann</p>
                <p className="font-serif text-xs text-cream-parchment/50">Local Guide bei Google</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="mt-20 border border-gold-primary/30 p-12 relative overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={tafelVideo} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-void-black/60" />

          <div className="relative z-10">
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
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                id="bottom-cta-reserve"
                onClick={() => onNavigate(Screen.RESERVE)}
                className="bg-gold-primary border border-gold-primary px-8 py-4 font-cinzel text-xs font-black uppercase tracking-widest text-void-black hover:bg-gold-bright transition-all cursor-pointer text-center"
              >
                Tafel Online Buchen
              </button>
              {isTavernOpenNow && (
                <a
                  id="bottom-cta-phone"
                  href="tel:035835495389"
                  onClick={trackPhoneCallClick}
                  className="border border-gold-secondary/60 bg-gold-primary/10 px-8 py-4 font-cinzel text-xs font-bold uppercase tracking-widest text-gold-bright hover:bg-gold-primary hover:text-void-black transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>03583 5495389</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
