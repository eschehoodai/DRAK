/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Screen, Reservation } from '../types';
import { Calendar, User, Mail, Hourglass, Shield, Search, Sparkles, Trash2 } from 'lucide-react';

interface ReservationViewProps {
  initialNotes?: string;
  onClearNotes?: () => void;
}

export default function ReservationView({ initialNotes, onClearNotes }: ReservationViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [vault, setVault] = useState('Die Grosse Kathedrale');
  const [notes, setNotes] = useState(initialNotes || '');
  
  // App states
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');
  const [lastCreated, setLastCreated] = useState<Reservation | null>(null);
  const [searchedReservation, setSearchedReservation] = useState<Reservation | null>(null);
  const [searchError, setSearchError] = useState('');

  // Handle incoming pre-filled notes (e.g. clicked dish from menu)
  useEffect(() => {
    if (initialNotes) {
      setNotes(initialNotes);
      setActiveTab('create');
      // Clean up after importing
      if (onClearNotes) onClearNotes();
    }
  }, [initialNotes]);

  // Load existing bookings
  useEffect(() => {
    try {
      const stored = localStorage.getItem('drak_reservations');
      if (stored) {
        setReservations(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveBookings = (newBookings: Reservation[]) => {
    setReservations(newBookings);
    try {
      localStorage.setItem('drak_reservations', JSON.stringify(newBookings));
    } catch (e) {
      console.error(e);
    }
  };

  // Convert number to roman numerals for flavor
  const toRoman = (num: number): string => {
    const lookup: { [key: string]: number } = {
      M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let roman = '';
    let i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date) {
      alert('Seid gegrüßt! Bitte füllt alle Pflichtfelder aus, um Eure Zunft anzumelden.');
      return;
    }

    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const currentYearRoman = toRoman(2026);
    const id = `DRAK-${currentYearRoman}-${randomSuffix}`;

    const newRes: Reservation = {
      id,
      name,
      email,
      guests,
      date,
      time,
      vault,
      notes,
    };

    const updated = [newRes, ...reservations];
    saveBookings(updated);
    setLastCreated(newRes);
    
    // Clear form
    setName('');
    setEmail('');
    setNotes('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchedReservation(null);

    if (!searchCode.trim()) {
      setSearchError('Bitte tragt eine gültige Reservierungsnummer ein.');
      return;
    }

    const target = reservations.find(
      (r) => r.id.toLowerCase() === searchCode.trim().toLowerCase() || r.email.toLowerCase() === searchCode.trim().toLowerCase()
    );

    if (target) {
      setSearchedReservation(target);
    } else {
      setSearchError('Kein Zunftbrief unter dieser Nummer oder E-Mail gefunden. Überprüft Eure Inschrift.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Seid Ihr sicher, dass Ihr Euer Mahl stornieren wollt?')) {
      const updated = reservations.filter((r) => r.id !== id);
      saveBookings(updated);
      if (searchedReservation?.id === id) {
        setSearchedReservation(null);
      }
      if (lastCreated?.id === id) {
        setLastCreated(null);
      }
      alert('Eure Reservierung wurde aus unseren Folianten gestrichen.');
    }
  };

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 md:px-8">
      {/* Visual background lights */}
      <div className="absolute top-[10%] left-[20%] h-72 w-72 rounded-full bg-gold-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] h-72 w-72 rounded-full bg-gold-secondary/5 blur-3xl pointer-events-none" />

      {/* View Header Tabs */}
      <div className="flex border-b border-gold-secondary/30 mb-8 max-w-lg mx-auto">
        <button
          id="tab-create-booking"
          onClick={() => {
            setActiveTab('create');
            setLastCreated(null);
          }}
          className={`flex-1 py-4 text-center font-cinzel text-xs font-black tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
            activeTab === 'create'
              ? 'border-gold-primary text-gold-bright'
              : 'border-transparent text-cream-parchment/50 hover:text-cream-parchment'
          }`}
        >
          Hoftafel Buchen
        </button>
        <button
          id="tab-search-booking"
          onClick={() => {
            setActiveTab('search');
            setSearchedReservation(null);
            setSearchError('');
          }}
          className={`flex-1 py-4 text-center font-cinzel text-xs font-black tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
            activeTab === 'search'
              ? 'border-gold-primary text-gold-bright'
              : 'border-transparent text-cream-parchment/50 hover:text-cream-parchment'
          }`}
        >
          Zunftbrief Suchen
        </button>
      </div>

      {/* ================= TAB 1: CREATE BOOKING ================= */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto">
          {lastCreated ? (
            /* Immersive Success Screen: Scroll */
            <div 
              id="booking-certificate-card"
              className="relative border-4 border-double border-gold-primary bg-void-black p-8 md:p-12 text-center text-cream-parchment animate-in fade-in duration-300"
            >
              <div className="gilded-corner gilded-corner-tl" />
              <div className="gilded-corner gilded-corner-tr" />
              <div className="gilded-corner gilded-corner-bl" />
              <div className="gilded-corner gilded-corner-br" />

              <div className="flex justify-center mb-6 text-gold-primary candle-glow">
                <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>

              <h2 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest text-gold-bright uppercase mb-2">
                ZUNFTBRIEF BESTÄTIGT
              </h2>
              <p className="font-serif text-sm italic text-gold-secondary/80 mb-6">
                ~ Gezeichnet im Folianten der Drachen Taverne ~
              </p>

              <div className="my-8 border-y border-gold-secondary/30 py-6 max-w-md mx-auto text-left space-y-4 font-serif">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-cream-parchment/50 font-cinzel tracking-wider">ZUNFTBRIEF-NR:</span>
                  <span className="font-mono text-gold-bright font-black tracking-wider text-base">{lastCreated.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-cream-parchment/50 font-cinzel tracking-wider">EDLER GAST:</span>
                  <span className="font-bold text-cream-parchment">{lastCreated.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-cream-parchment/50 font-cinzel tracking-wider font-semibold">TISCHZUNFT FÜR:</span>
                  <span className="font-bold text-gold-primary">{lastCreated.guests} Krieger</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-cream-parchment/50 font-cinzel tracking-wider">DATUM & STUNDE:</span>
                  <span className="font-bold">{lastCreated.date} um {lastCreated.time} Uhr</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-cream-parchment/50 font-cinzel tracking-wider">GEWÖLBE:</span>
                  <span className="font-cinzel text-xs text-gold-bright tracking-widest font-bold uppercase">{lastCreated.vault}</span>
                </div>
                {lastCreated.notes && (
                  <div className="border-t border-gold-secondary/15 pt-3 mt-3 text-xs italic text-cream-parchment/70 bg-void-black/40 p-2">
                    <span className="font-cinzel text-[10px] tracking-wider text-gold-secondary uppercase block mb-1">Botschaft an den Wirt:</span>
                    "{lastCreated.notes}"
                  </div>
                )}
              </div>

              <div className="pt-2 text-xs text-cream-parchment/60 leading-relaxed mb-8 max-w-md mx-auto">
                Bringt diesen Brief geschmückt mit dem Reservierungscode auf Eurem Gerät mit. Unser Burgherr Alric hält Euren Met bereits kalt.
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  id="btn-new-booking"
                  onClick={() => setLastCreated(null)}
                  className="border border-gold-secondary px-6 py-3 font-cinzel text-xs tracking-wider uppercase text-gold-secondary hover:text-gold-bright hover:bg-gold-secondary/10 transition-all cursor-pointer"
                >
                  Weiteren Tisch buchen
                </button>
                <button 
                  id="btn-print"
                  onClick={() => window.print()}
                  className="bg-gold-primary border border-gold-primary px-6 py-3 font-cinzel text-xs tracking-wider font-bold uppercase text-void-black hover:bg-gold-bright transition-all cursor-pointer"
                >
                  Brief drucken / sichern
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form 
              id="booking-form"
              onSubmit={handleCreateReservation} 
              className="relative border border-gold-secondary/40 bg-tavern-dark/40 p-6 md:p-12"
            >
              <div className="gilded-corner gilded-corner-tl" />
              <div className="gilded-corner gilded-corner-tr" />
              <div className="gilded-corner gilded-corner-bl" />
              <div className="gilded-corner gilded-corner-br" />

              <h2 className="text-center font-cinzel text-xl md:text-2xl font-black tracking-widest text-gold-primary uppercase mb-2">
                Eine Tafel Reservieren
              </h2>
              <p className="text-center font-serif text-sm italic text-cream-parchment/50 mb-10">
                Sichert Euch Euer Festmahl rechtzeitig bei Kerzenschein
              </p>

              <div className="space-y-8">
                {/* Grid Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Input */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Name der Truppe *</span>
                    </label>
                    <input
                      id="input-name"
                      type="text"
                      required
                      placeholder="z.B. Burgherr von Drachenfels"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-base text-cream-parchment placeholder:text-cream-parchment/30 outline-none focus:border-gold-primary focus:drop-shadow-[0_4px_6px_rgba(212,175,55,0.15)] transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Inschrift (E-Mail) *</span>
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      required
                      placeholder="barde@drak.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-base text-cream-parchment placeholder:text-cream-parchment/30 outline-none focus:border-gold-primary focus:drop-shadow-[0_4px_6px_rgba(212,175,55,0.15)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Guests Selector */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
                      Anzahl Gefährten
                    </label>
                    <select
                      id="select-guests"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="border-0 border-b-2 border-gold-secondary/40 bg-tavern-dark py-2.5 font-serif text-base text-cream-parchment outline-none focus:border-gold-primary transition-all cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num} className="bg-void-black text-cream-parchment py-2">
                          {num} {num === 1 ? 'Krieger' : 'Krieger'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Input */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
                      Tag des Festmahls *
                    </label>
                    <input
                      id="input-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-base text-cream-parchment outline-none focus:border-gold-primary transition-all cursor-pointer"
                    />
                  </div>

                  {/* Time Select */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
                      Stunde des Tages
                    </label>
                    <select
                      id="select-time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="border-0 border-b-2 border-gold-secondary/40 bg-tavern-dark py-2.5 font-serif text-base text-cream-parchment outline-none focus:border-gold-primary transition-all cursor-pointer"
                    >
                      {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((hr) => (
                        <option key={hr} value={hr} className="bg-void-black text-cream-parchment">
                          {hr} Uhr
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vault / Location Selection */}
                <div className="flex flex-col space-y-3">
                  <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase mb-2">
                    Wählt Euer Gewölbe
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Die Grosse Kathedrale',
                        desc: 'Massive, kreuzförmige Deckenbögen, schwere Eichentische für große Bünde, beleuchtet von gewaltigen, flackernden Eisenkronleuchtern über dem Kamin. Ideal für königliche Gelage.',
                      },
                      {
                        name: 'Unter den alten Linden',
                        desc: 'Ein lauschiger Biergarten im Schatten uralter Linden, mit rustikalen Holzbänken und dem sanften Plätschern des Brunnens. Kühles Bier und deftige Brotzeiten unter freiem Himmel.',
                      },
                    ].map((v) => (
                      <div
                        key={v.name}
                        id={`vault-option-${v.name.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setVault(v.name)}
                        className={`border-2 p-4 transition-all duration-300 cursor-pointer text-left flex flex-col ${
                          vault === v.name
                            ? 'border-gold-primary bg-gold-primary/10'
                            : 'border-gold-secondary/20 bg-void-black/20 hover:border-gold-secondary/50'
                        }`}
                      >
                        <span className="font-cinzel text-xs font-black tracking-wider text-gold-bright block mb-2">
                          {v.name}
                        </span>
                        <p className="font-serif text-[11px] leading-relaxed text-cream-parchment/60">
                          {v.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Input */}
                <div className="flex flex-col space-y-2">
                  <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
                    Sonderwünsche an die Taverne
                  </label>
                  <textarea
                    id="input-notes"
                    rows={3}
                    placeholder="Eintragungen über Allergien, besondere Gerichte oder Feierlichkeiten..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-sm text-cream-parchment placeholder:text-cream-parchment/30 outline-none focus:border-gold-primary transition-all resize-none"
                  />
                </div>
              </div>

              <div className="mt-12 text-center">
                <button
                  id="btn-submit-booking"
                  type="submit"
                  className="w-full sm:w-auto bg-gold-primary border border-gold-primary px-10 py-4 font-cinzel text-sm font-black tracking-widest uppercase text-void-black hover:bg-gold-bright transition-all cursor-pointer"
                >
                  Tischvertragsbrief absenden
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ================= TAB 2: SEARCH DATA ================= */}
      {activeTab === 'search' && (
        <div className="max-w-2xl mx-auto">
          {/* Query Form */}
          <form 
            onSubmit={handleSearch} 
            className="flex flex-col space-y-4 border border-gold-secondary/30 p-6 bg-tavern-dark/20 mb-8"
          >
            <label className="font-cinzel text-xs font-black tracking-widest text-gold-primary uppercase">
              RESERVIERUNGSCODE ODER SCHREIBER-EMAIL EINGEBEN
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                id="search-input"
                type="text"
                placeholder="z.B. DRAK-MMXXVI-145 oder barde@drak.de"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="flex-1 border-0 border-b-2 border-gold-secondary bg-transparent py-2.5 font-serif text-base text-cream-parchment outline-none focus:border-gold-primary tracking-wider"
              />
              <button
                id="search-submit"
                type="submit"
                className="bg-gold-primary border border-gold-primary px-8 py-3 text-void-black font-cinzel text-xs font-bold uppercase tracking-widest hover:bg-gold-bright transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>Urkunde suchen</span>
              </button>
            </div>
            {searchError && (
              <p id="search-error-msg" className="text-rose-400 font-serif text-xs italic">
                {searchError}
              </p>
            )}
          </form>

          {/* Result Card */}
          {searchedReservation ? (
            <div 
              id="searched-booking-card"
              className="relative border-2 border-gold-primary bg-void-black/80 p-6 md:p-8 animate-in fade-in duration-200"
            >
              <div className="gilded-corner gilded-corner-tl" />
              <div className="gilded-corner gilded-corner-tr" />
              <div className="gilded-corner gilded-corner-bl" />
              <div className="gilded-corner gilded-corner-br" />

              <div className="flex items-center justify-between border-b border-gold-secondary/30 pb-4 mb-4">
                <div>
                  <span className="font-mono text-gold-bright font-black tracking-widest text-base">
                    {searchedReservation.id}
                  </span>
                  <div className="font-cinzel text-[10px] tracking-wider text-cream-parchment/50">
                    STATUS: EINGETRAGEN
                  </div>
                </div>
                <button
                  id="btn-delete-searched"
                  onClick={() => handleDelete(searchedReservation.id)}
                  className="p-2 border border-rose-900/35 hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                  title="Stornieren"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-serif text-sm">
                <div>
                  <p className="text-cream-parchment/40 text-xs font-cinzel tracking-wider">GAST NAME</p>
                  <p className="font-bold text-cream-parchment">{searchedReservation.name}</p>
                </div>
                <div>
                  <p className="text-cream-parchment/40 text-xs font-cinzel tracking-wider">GAST INSCHRIFT</p>
                  <p className="text-cream-parchment">{searchedReservation.email}</p>
                </div>
                <div>
                  <p className="text-cream-parchment/40 text-xs font-cinzel tracking-wider">KRIEGER TABLE</p>
                  <p className="font-bold text-gold-primary">{searchedReservation.guests} Gefährten</p>
                </div>
                <div>
                  <p className="text-cream-parchment/40 text-xs font-cinzel tracking-wider">ZEITPUNKT</p>
                  <p className="font-bold font-serif">{searchedReservation.date} um {searchedReservation.time} Uhr</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-cream-parchment/40 text-xs font-cinzel tracking-wider">TAVERNEN GEWÖLBE</p>
                  <p className="font-cinzel text-xs text-gold-bright uppercase tracking-widest font-black leading-relaxed mt-0.5">
                    {searchedReservation.vault}
                  </p>
                </div>
                {searchedReservation.notes && (
                  <div className="sm:col-span-2 border-t border-gold-secondary/10 pt-3 mt-1 italic text-xs text-cream-parchment/60 bg-void-black/30 p-2">
                    <p className="font-cinzel text-[10px] text-gold-secondary tracking-widest uppercase mb-1">Eure Botschaft:</p>
                    "{searchedReservation.notes}"
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center font-serif text-xs italic text-cream-parchment/40 py-8">
              Sucht nach Eurem Zunftbrief, um Details einzusehen oder die Tischanzahl zu stornieren.
            </div>
          )}

          {/* All recorded listings helper (For developer testing and easy retrieval in UI) */}
          {reservations.length > 0 && (
            <div className="mt-12 border-t border-gold-secondary/25 pt-6">
              <h4 className="font-cinzel text-[10px] tracking-widest text-gold-secondary font-black uppercase mb-3">
                Aktive Zunftregister-Einträge auf diesem Applet ({reservations.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {reservations.map((res) => (
                  <div 
                    key={res.id} 
                    className="flex justify-between items-center text-xs border border-gold-secondary/15 p-2 bg-void-black/40"
                  >
                    <div>
                      <span className="font-mono text-gold-bright tracking-wider font-bold mr-3">{res.id}</span>
                      <span className="font-serif text-cream-parchment/80">{res.name} ({res.guests} Gefährten)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        id={`use-code-${res.id}`}
                        onClick={() => {
                          setSearchCode(res.id);
                          setSearchedReservation(res);
                        }}
                        className="font-cinzel text-[10px] tracking-widest uppercase text-gold-secondary hover:text-gold-bright transition-colors cursor-pointer underline"
                      >
                        Wählen
                      </button>
                      <button 
                        id={`cancel-res-${res.id}`}
                        onClick={() => handleDelete(res.id)}
                        className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                      >
                        Storno
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
