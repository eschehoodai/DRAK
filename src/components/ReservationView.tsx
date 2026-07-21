/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Screen, Reservation } from '../types';
import { 
  Calendar, User, Mail, Hourglass, Shield, Search, Sparkles, Trash2,
  ChevronLeft, ChevronRight, Clock, AlertTriangle, Check, X
} from 'lucide-react';

interface ReservationViewProps {
  initialNotes?: string;
  onClearNotes?: () => void;
}

// Öffnungszeiten-Konfiguration
interface DayHours {
  isOpen: boolean;
  open: string;
  close: string;
  lastSlot: string;
  label: string;
}

const OPENING_HOURS: Record<number, DayHours> = {
  0: { isOpen: true, open: '11:00', close: '21:00', lastSlot: '20:30', label: 'So: 11:00–21:00' },
  1: { isOpen: true, open: '17:00', close: '21:00', lastSlot: '20:30', label: 'Mo: 17:00–21:00' },
  2: { isOpen: false, open: '', close: '', lastSlot: '', label: 'Di: Geschlossen' },
  3: { isOpen: true, open: '17:00', close: '21:00', lastSlot: '20:30', label: 'Mi: 17:00–21:00' },
  4: { isOpen: true, open: '17:00', close: '21:00', lastSlot: '20:30', label: 'Do: 17:00–21:00' },
  5: { isOpen: true, open: '17:00', close: '22:00', lastSlot: '21:30', label: 'Fr: 17:00–22:00' },
  6: { isOpen: true, open: '11:00', close: '22:00', lastSlot: '21:30', label: 'Sa: 11:00–22:00' },
};

/**
 * Format a Date object to YYYY-MM-DD using local time
 */
const formatYYYYMMDD = (d: Date): string => {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get weekday index (0 = Sun, 1 = Mon, ... 6 = Sat) from YYYY-MM-DD string
 */
const getDayOfWeek = (dateStr: string): number => {
  if (!dateStr) return -1;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3) return -1;
  return new Date(parts[0], parts[1] - 1, parts[2]).getDay();
};

/**
 * Generate 30-min time slots for given YYYY-MM-DD string (last slot = 30 min before closing)
 */
const getTimeSlotsForDate = (dateStr: string): string[] => {
  const dayOfWeek = getDayOfWeek(dateStr);
  const config = OPENING_HOURS[dayOfWeek];
  if (!config || !config.isOpen) return [];

  const slots: string[] = [];
  const [openHour, openMin] = config.open.split(':').map(Number);
  const [lastHour, lastMin] = config.lastSlot.split(':').map(Number);

  let currentMin = openHour * 60 + openMin;
  const endMin = lastHour * 60 + lastMin;

  while (currentMin <= endMin) {
    const h = Math.floor(currentMin / 60);
    const m = currentMin % 60;
    const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    slots.push(formatted);
    currentMin += 30;
  }
  return slots;
};

/**
 * Get next open day starting from a given date (defaults to today or tomorrow if today closed)
 */
const getNextOpenDate = (startDate: Date = new Date()): string => {
  const d = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const dayIndex = d.getDay();
    if (OPENING_HOURS[dayIndex].isOpen) {
      return formatYYYYMMDD(d);
    }
    d.setDate(d.getDate() + 1);
  }
  return formatYYYYMMDD(new Date());
};

/**
 * Formats YYYY-MM-DD into readable German date string: e.g. "Samstag, 25.07.2026"
 */
const formatGermanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const dayName = weekdays[d.getDay()];
  const formattedDay = d.getDate().toString().padStart(2, '0');
  const formattedMonth = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${dayName}, ${formattedDay}.${formattedMonth}.${d.getFullYear()}`;
};

/**
 * Generates quick selection date options for the user
 */
const getQuickChips = () => {
  const today = new Date();
  const chips: { label: string; dateStr: string }[] = [];

  // Heute
  chips.push({ label: 'Heute', dateStr: formatYYYYMMDD(today) });

  // Morgen
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  chips.push({ label: 'Morgen', dateStr: formatYYYYMMDD(tomorrow) });

  // Nächster Freitag
  const nextFriday = new Date(today);
  let daysUntilFri = (5 - today.getDay() + 7) % 7;
  nextFriday.setDate(today.getDate() + daysUntilFri);
  chips.push({ label: 'Diesen Fr', dateStr: formatYYYYMMDD(nextFriday) });

  // Nächster Samstag
  const nextSat = new Date(today);
  let daysUntilSat = (6 - today.getDay() + 7) % 7;
  nextSat.setDate(today.getDate() + daysUntilSat);
  chips.push({ label: 'Diesen Sa', dateStr: formatYYYYMMDD(nextSat) });

  // Nächster Sonntag
  const nextSun = new Date(today);
  let daysUntilSun = (0 - today.getDay() + 7) % 7;
  nextSun.setDate(today.getDate() + daysUntilSun);
  chips.push({ label: 'Diesen So', dateStr: formatYYYYMMDD(nextSun) });

  return chips;
};

/* ================= CUSTOM CALENDAR MODAL COMPONENT ================= */
interface CustomCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

function CustomCalendarModal({ isOpen, onClose, selectedDate, onSelectDate }: CustomCalendarModalProps) {
  if (!isOpen) return null;

  const initialParts = selectedDate ? selectedDate.split('-').map(Number) : [];
  const initialMonthDate = initialParts.length === 3 ? new Date(initialParts[0], initialParts[1] - 1, 1) : new Date();
  const [viewDate, setViewDate] = useState<Date>(initialMonthDate);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // European Monday=0 start
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md border-2 border-gold-primary bg-void-black p-6 shadow-2xl text-cream-parchment">
        <div className="gilded-corner gilded-corner-tl" />
        <div className="gilded-corner gilded-corner-tr" />
        <div className="gilded-corner gilded-corner-bl" />
        <div className="gilded-corner gilded-corner-br" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-secondary/30 pb-4 mb-4">
          <button 
            type="button" 
            onClick={prevMonth}
            className="p-2 text-gold-secondary hover:text-gold-bright hover:bg-gold-primary/10 rounded transition-all cursor-pointer"
            title="Vorheriger Monat"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="font-cinzel text-base font-bold text-gold-bright tracking-widest uppercase">
            {monthNames[month]} {year}
          </div>
          <button 
            type="button" 
            onClick={nextMonth}
            className="p-2 text-gold-secondary hover:text-gold-bright hover:bg-gold-primary/10 rounded transition-all cursor-pointer"
            title="Nächster Monat"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-cinzel text-xs font-bold text-gold-secondary uppercase mb-2">
          <span>Mo</span>
          <span>Di</span>
          <span>Mi</span>
          <span>Do</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>So</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-10" />;
            }

            const currentDayDate = new Date(year, month, day);
            currentDayDate.setHours(0, 0, 0, 0);

            const isPast = currentDayDate < today;
            const isTuesday = currentDayDate.getDay() === 2;
            const isDisabled = isPast || isTuesday;

            const dayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isSelected = dayStr === selectedDate;
            const isToday = currentDayDate.getTime() === today.getTime();

            return (
              <button
                key={day}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  onSelectDate(dayStr);
                  onClose();
                }}
                className={`h-10 flex flex-col items-center justify-center font-serif text-sm transition-all rounded relative cursor-pointer ${
                  isSelected
                    ? 'bg-gold-primary text-void-black font-bold shadow-md shadow-gold-primary/20 scale-105 z-10'
                    : isDisabled
                    ? 'text-cream-parchment/20 bg-tavern-dark/20 cursor-not-allowed'
                    : 'text-cream-parchment hover:bg-gold-primary/20 hover:text-gold-bright'
                } ${isToday && !isSelected ? 'border border-gold-primary/60 text-gold-primary font-bold' : ''}`}
              >
                <span>{day}</span>
                {isTuesday && (
                  <span className="text-[8px] leading-none text-red-400 font-cinzel tracking-tighter uppercase">Ruhe</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend / Info footer */}
        <div className="mt-6 pt-4 border-t border-gold-secondary/20 flex items-center justify-between text-xs text-cream-parchment/60 font-serif">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
            <span>Dienstag: Ruhetag</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-gold-secondary/40 font-cinzel text-xs text-gold-primary hover:bg-gold-primary/10 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN RESERVATION VIEW COMPONENT ================= */
export default function ReservationView({ initialNotes, onClearNotes }: ReservationViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  
  // Initialize default date to next open day
  const [date, setDate] = useState(() => getNextOpenDate(new Date()));
  const [time, setTime] = useState('18:00');
  const [vault, setVault] = useState('Die Grosse Kathedrale');
  const [notes, setNotes] = useState(initialNotes || '');
  
  // Custom Calendar Modal state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // App states
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');
  const [lastCreated, setLastCreated] = useState<Reservation | null>(null);
  const [searchedReservation, setSearchedReservation] = useState<Reservation | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize available time slots when selected date changes
  useEffect(() => {
    if (!date) return;
    const availableSlots = getTimeSlotsForDate(date);
    if (availableSlots.length > 0) {
      if (!availableSlots.includes(time)) {
        setTime(availableSlots[0]);
      }
    } else {
      setTime('');
    }
  }, [date]);

  // Handle incoming pre-filled notes (e.g. clicked dish from menu)
  useEffect(() => {
    if (initialNotes) {
      setNotes(initialNotes);
      setActiveTab('create');
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

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date) {
      alert('Seid gegrüßt! Bitte füllt alle Pflichtfelder aus, um Eure Zunft anzumelden.');
      return;
    }

    if (getDayOfWeek(date) === 2) {
      alert('An Dienstagen ruhen Drachen und Wirtsleute. Bitte wählt einen anderen Tag für Euer Festmahl!');
      return;
    }

    setIsSubmitting(true);

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

    // Send email notification to server via PHP mail()
    try {
      await fetch('/send-booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRes),
      });
    } catch (err) {
      console.warn('E-Mail-Versand fehlgeschlagen (evtl. lokale Entwicklungsumgebung):', err);
    } finally {
      setIsSubmitting(false);
    }

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

  const handleDelete = async (id: string) => {
    if (confirm('Seid Ihr sicher, dass Ihr Euer Mahl stornieren wollt?')) {
      const targetRes = reservations.find((r) => r.id === id);

      if (targetRes) {
        try {
          await fetch('/send-cancellation.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(targetRes),
          });
        } catch (err) {
          console.warn('Stornierungs-E-Mail fehlgeschlagen (evtl. lokale Entwicklungsumgebung):', err);
        }
      }

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

  const isTuesdaySelected = getDayOfWeek(date) === 2;
  const availableSlots = getTimeSlotsForDate(date);
  const quickChips = getQuickChips();

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 md:px-8">
      {/* Visual background lights */}
      <div className="absolute top-[10%] left-[20%] h-72 w-72 rounded-full bg-gold-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] h-72 w-72 rounded-full bg-gold-secondary/5 blur-3xl pointer-events-none" />

      {/* Custom Calendar Modal */}
      <CustomCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={date}
        onSelectDate={(newDate) => setDate(newDate)}
      />

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
            /* Success Certificate */
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

              <div className="my-8 border-y border-gold-secondary/30 py-6 space-y-3 font-serif text-base">
                <p><span className="text-gold-primary uppercase font-cinzel text-xs font-bold mr-2">Nummer:</span> <strong className="text-gold-bright">{lastCreated.id}</strong></p>
                <p><span className="text-gold-primary uppercase font-cinzel text-xs font-bold mr-2">Truppführer:</span> {lastCreated.name}</p>
                <p><span className="text-gold-primary uppercase font-cinzel text-xs font-bold mr-2">Gefährten:</span> {lastCreated.guests} Krieger</p>
                <p><span className="text-gold-primary uppercase font-cinzel text-xs font-bold mr-2">Festmahl-Zeit:</span> {formatGermanDate(lastCreated.date)} um {lastCreated.time} Uhr</p>
                <p><span className="text-gold-primary uppercase font-cinzel text-xs font-bold mr-2">Gewölbe:</span> {lastCreated.vault}</p>
                {lastCreated.notes && (
                  <p><span className="text-gold-primary uppercase font-cinzel text-xs font-bold mr-2">Wünsche:</span> <span className="italic">{lastCreated.notes}</span></p>
                )}
              </div>

              <p className="font-serif text-xs text-cream-parchment/60 mb-8 max-w-md mx-auto">
                Notiert Euch Euren Buchungscode <strong>{lastCreated.id}</strong>. Ihr könnt damit jederzeit Euren Zunftbrief einsehen oder stornieren. Eine Brieftaube (E-Mail) wurde versendet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  id="btn-new-booking"
                  onClick={() => setLastCreated(null)}
                  className="bg-gold-primary px-6 py-3 font-cinzel text-xs font-bold tracking-widest uppercase text-void-black hover:bg-gold-bright transition-colors cursor-pointer"
                >
                  Weiteren Tisch reservieren
                </button>
                <button
                  id="btn-cancel-this-booking"
                  onClick={() => handleDelete(lastCreated.id)}
                  className="border border-red-500/50 px-6 py-3 font-cinzel text-xs font-bold tracking-widest uppercase text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Stornieren
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form 
              onSubmit={handleCreateReservation} 
              className="relative border border-gold-secondary/30 bg-tavern-dark/30 p-6 md:p-10 shadow-2xl backdrop-blur-sm"
            >
              <div className="gilded-corner gilded-corner-tl" />
              <div className="gilded-corner gilded-corner-tr" />
              <div className="gilded-corner gilded-corner-bl" />
              <div className="gilded-corner gilded-corner-br" />

              <div className="text-center mb-8">
                <h3 className="font-cinzel text-2xl font-bold tracking-widest text-gold-bright uppercase">
                  EINE TAFEL RESERVIEREN
                </h3>
                <p className="font-serif text-xs italic text-cream-parchment/60 mt-1">
                  Sichert Euch Euer Festmahl rechtzeitig bei Kerzenschein
                </p>
              </div>

              <div className="space-y-6">
                {/* Name & Email inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Name der Truppe *
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

                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Inschrift (E-Mail) *
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

                {/* Guests, Date & Time selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
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

                  {/* Date Input with Custom Visual Calendar */}
                  <div className="flex flex-col space-y-2 col-span-1 md:col-span-1">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center justify-between">
                      <span>Tag des Festmahls *</span>
                    </label>

                    {/* Interactive Calendar Button */}
                    <div className="relative">
                      <button
                        type="button"
                        id="btn-open-calendar"
                        onClick={() => setIsCalendarOpen(true)}
                        className="w-full border-0 border-b-2 border-gold-secondary/40 bg-tavern-dark/60 py-2 px-1 font-serif text-sm md:text-base text-gold-bright text-left flex items-center justify-between hover:border-gold-primary hover:bg-gold-primary/10 transition-all cursor-pointer group"
                      >
                        <span className="truncate">{formatGermanDate(date) || 'Tag wählen...'}</span>
                        <Calendar className="h-4 w-4 text-gold-secondary group-hover:text-gold-bright shrink-0 ml-2" />
                      </button>

                      {/* Hidden native input fallback sync */}
                      <input
                        id="input-date"
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="sr-only"
                        tabIndex={-1}
                      />
                    </div>
                  </div>

                  {/* Dynamic Time Select */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center justify-between">
                      <span>Stunde des Tages *</span>
                      {date && !isTuesdaySelected && (
                        <span className="text-[10px] text-cream-parchment/50 font-serif lowercase font-normal">
                          (küchenschluss-regelung)
                        </span>
                      )}
                    </label>

                    <select
                      id="select-time"
                      disabled={isTuesdaySelected || availableSlots.length === 0}
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="border-0 border-b-2 border-gold-secondary/40 bg-tavern-dark py-2.5 font-serif text-base text-cream-parchment outline-none focus:border-gold-primary transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isTuesdaySelected ? (
                        <option value="" className="bg-void-black text-red-400">
                          Geschlossen (Ruhetag)
                        </option>
                      ) : availableSlots.length > 0 ? (
                        availableSlots.map((hr) => (
                          <option key={hr} value={hr} className="bg-void-black text-cream-parchment">
                            {hr} Uhr
                          </option>
                        ))
                      ) : (
                        <option value="" className="bg-void-black text-cream-parchment">
                          Keine Zeiten verfügbar
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Quick Date Select Chips */}
                <div className="flex items-center flex-wrap gap-2 pt-1 pb-2">
                  <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider text-gold-secondary/70 mr-1">
                    Schnellwahl:
                  </span>
                  {quickChips.map((chip) => {
                    const isSelected = date === chip.dateStr;
                    const isChipTuesday = getDayOfWeek(chip.dateStr) === 2;
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => setDate(chip.dateStr)}
                        className={`px-3 py-1 text-xs font-serif rounded transition-all border cursor-pointer ${
                          isSelected
                            ? 'border-gold-primary bg-gold-primary/20 text-gold-bright font-bold'
                            : isChipTuesday
                            ? 'border-red-500/30 bg-red-950/20 text-red-300/60 hover:border-red-500/60'
                            : 'border-gold-secondary/20 bg-void-black/40 text-cream-parchment/70 hover:border-gold-secondary/50 hover:text-cream-parchment'
                        }`}
                      >
                        {chip.label}
                        {isChipTuesday && <span className="ml-1 text-[9px] text-red-400">(Ruhe)</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Tuesday Ruhetag Warning Banner */}
                {isTuesdaySelected && (
                  <div className="p-4 border border-red-500/50 bg-red-950/30 text-red-200 text-xs md:text-sm font-serif flex items-start space-x-3 rounded animate-in fade-in duration-200">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold font-cinzel text-red-300 tracking-wide uppercase">
                        Dienstags ist die Taverne geschlossen
                      </p>
                      <p className="mt-1 text-cream-parchment/80 leading-relaxed">
                        An Dienstagen ruhen Drachen und Wirtsleute. Bitte wählt über die Schnellauswahl oder den Kalender einen anderen Tag für Eure Tischreservierung!
                      </p>
                    </div>
                  </div>
                )}

                {/* Vault / Location Selection */}
                <div className="flex flex-col space-y-3 pt-2">
                  <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase mb-1">
                    Wählt Euer Gewölbe
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Die Grosse Kathedrale',
                        desc: 'Massive, kreuzförmige Deckenbögen und schwere Eichentische für große Bünde, getaucht in warmes, flackerndes Kerzenlicht. Ideal für königliche Gelage.',
                      },
                      {
                        name: 'Unter den alten Linden',
                        desc: 'Ein lauschiger Biergarten im Schatten uralter Linden, mit rustikalen Holzbänken. Kühles Bier und deftige Brotzeiten unter freiem Himmel.',
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

              <div className="mt-10 text-center">
                <button
                  id="btn-submit-booking"
                  type="submit"
                  disabled={isSubmitting || isTuesdaySelected}
                  className="w-full sm:w-auto bg-gold-primary border border-gold-primary px-10 py-4 font-cinzel text-sm font-black tracking-widest uppercase text-void-black hover:bg-gold-bright transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Brieftaube fliegt...' : 'Tischvertragsbrief absenden'}
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
                id="btn-search"
                type="submit"
                className="bg-gold-primary text-void-black px-6 py-2.5 font-cinzel text-xs font-bold uppercase tracking-widest hover:bg-gold-bright transition-colors cursor-pointer"
              >
                Im Folianten Suchen
              </button>
            </div>
          </form>

          {searchError && (
            <div className="p-4 border border-red-500/40 bg-red-950/20 text-red-300 text-sm font-serif mb-6 text-center">
              {searchError}
            </div>
          )}

          {searchedReservation && (
            <div className="border border-gold-primary/50 bg-tavern-dark/40 p-6 space-y-4 font-serif text-sm">
              <div className="flex justify-between items-center border-b border-gold-secondary/20 pb-3">
                <span className="font-cinzel text-gold-bright font-bold">{searchedReservation.id}</span>
                <span className="text-xs text-gold-secondary">{searchedReservation.vault}</span>
              </div>
              <div className="space-y-1">
                <p><strong>Name:</strong> {searchedReservation.name}</p>
                <p><strong>E-Mail:</strong> {searchedReservation.email}</p>
                <p><strong>Krieger:</strong> {searchedReservation.guests} Personen</p>
                <p><strong>Zeitpunkt:</strong> {formatGermanDate(searchedReservation.date)} um {searchedReservation.time} Uhr</p>
                {searchedReservation.notes && <p><strong>Wünsche:</strong> {searchedReservation.notes}</p>}
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDelete(searchedReservation.id)}
                  className="text-xs text-red-400 hover:text-red-300 underline font-cinzel uppercase tracking-wider cursor-pointer"
                >
                  Reservierung Stornieren
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
