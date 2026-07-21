/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { JobApplication, JobPosition } from '../types';
import { Briefcase, User, Mail, Phone, ScrollText } from 'lucide-react';

const POSITIONS: JobPosition[] = ['Servicekraft', 'Koch/Köchin'];

export default function JobsView() {
  const [position, setPosition] = useState<JobPosition>('Servicekraft');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [submitted, setSubmitted] = useState<JobApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert number to roman numerals to match the tavern's certificate style
  const toRoman = (num: number): string => {
    const lookup: { [key: string]: number } = {
      M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1,
    };
    let roman = '';
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Seid gegrüßt! Bitte hinterlasst zumindest Euren Namen und Eure Inschrift (E-Mail).');
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const id = `DRAK-ZUNFT-${toRoman(2026)}-${randomSuffix}`;

    const application: JobApplication = {
      id,
      position,
      name,
      email,
      phone: phone || undefined,
      about: about || undefined,
    };

    // Send email notification to server via PHP mail()
    try {
      await fetch('/send-job-application.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
      });
    } catch (err) {
      console.warn('E-Mail-Versand fehlgeschlagen (evtl. lokale Entwicklungsumgebung):', err);
    } finally {
      setIsSubmitting(false);
    }

    setSubmitted(application);
  };

  const resetForm = () => {
    setSubmitted(null);
    setPosition('Servicekraft');
    setName('');
    setEmail('');
    setPhone('');
    setAbout('');
  };

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 md:px-8">
      {/* Visual background lights */}
      <div className="absolute top-[10%] left-[20%] h-72 w-72 rounded-full bg-gold-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] h-72 w-72 rounded-full bg-gold-secondary/5 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        {submitted ? (
          /* ================= SUCCESS: Application received ================= */
          <div
            id="application-certificate-card"
            className="relative border-4 border-double border-gold-primary bg-void-black p-8 md:p-12 text-center text-cream-parchment animate-in fade-in duration-300"
          >
            <div className="gilded-corner gilded-corner-tl" />
            <div className="gilded-corner gilded-corner-tr" />
            <div className="gilded-corner gilded-corner-bl" />
            <div className="gilded-corner gilded-corner-br" />

            <div className="flex justify-center mb-6 text-gold-primary candle-glow">
              <Briefcase className="h-16 w-16" strokeWidth={1} />
            </div>

            <h2 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest text-gold-bright uppercase mb-2">
              Bewerbung empfangen
            </h2>
            <p className="font-serif text-sm italic text-gold-secondary/80 mb-6">
              ~ Eingetragen in das Zunftregister der Drachen Taverne ~
            </p>

            <div className="my-8 border-y border-gold-secondary/30 py-6 max-w-md mx-auto text-left space-y-4 font-serif">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-cream-parchment/50 font-cinzel tracking-wider">ZUNFT-NR:</span>
                <span className="font-mono text-gold-bright font-black tracking-wider text-base">{submitted.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-cream-parchment/50 font-cinzel tracking-wider">ANGEHENDER GESELLE:</span>
                <span className="font-bold text-cream-parchment">{submitted.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-cream-parchment/50 font-cinzel tracking-wider">GEWÜNSCHTES AMT:</span>
                <span className="font-cinzel text-xs text-gold-primary tracking-widest font-bold uppercase">{submitted.position}</span>
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-cream-parchment/50 font-cinzel tracking-wider">INSCHRIFT:</span>
                <span className="font-bold">{submitted.email}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-cream-parchment/60 leading-relaxed mb-8 max-w-md mx-auto">
              Habt Dank für Euer Interesse! Unser Burgherr meldet sich innerhalb von 3 Werktagen bei Euch.
            </div>

            <button
              id="btn-new-application"
              onClick={resetForm}
              className="border border-gold-secondary px-6 py-3 font-cinzel text-xs tracking-wider uppercase text-gold-secondary hover:text-gold-bright hover:bg-gold-secondary/10 transition-all cursor-pointer"
            >
              Weitere Bewerbung senden
            </button>
          </div>
        ) : (
          /* ================= APPLICATION FORM ================= */
          <form
            id="jobs-form"
            onSubmit={handleSubmit}
            className="relative border border-gold-secondary/40 bg-tavern-dark/40 p-6 md:p-12"
          >
            <div className="gilded-corner gilded-corner-tl" />
            <div className="gilded-corner gilded-corner-tr" />
            <div className="gilded-corner gilded-corner-bl" />
            <div className="gilded-corner gilded-corner-br" />

            <div className="flex justify-center mb-4 text-gold-primary">
              <Briefcase className="h-10 w-10" strokeWidth={1.25} />
            </div>

            <h2 className="text-center font-cinzel text-xl md:text-2xl font-black tracking-widest text-gold-primary uppercase mb-2">
              Direkt-Kurzbewerbung
            </h2>
            <p className="text-center font-serif text-sm italic text-cream-parchment/50 mb-10 max-w-lg mx-auto leading-relaxed">
              Sendet uns einfach Eure Eckdaten. Kein stundenlanges Schreiben nötig – wir melden uns innerhalb von 3 Werktagen bei Euch.
            </p>

            <div className="space-y-8">
              {/* Position */}
              <div className="flex flex-col space-y-2">
                <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Gewünschte Stelle *</span>
                </label>
                <select
                  id="select-position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value as JobPosition)}
                  className="border-0 border-b-2 border-gold-secondary/40 bg-tavern-dark py-2.5 font-serif text-base text-cream-parchment outline-none focus:border-gold-primary transition-all cursor-pointer"
                >
                  {POSITIONS.map((p) => (
                    <option key={p} value={p} className="bg-void-black text-cream-parchment">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-2">
                  <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Name, Vorname *</span>
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    placeholder="z.B. Lehmann, Maria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-base text-cream-parchment placeholder:text-cream-parchment/30 outline-none focus:border-gold-primary focus:drop-shadow-[0_4px_6px_rgba(212,175,55,0.15)] transition-all"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Inschrift (E-Mail) *</span>
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    required
                    placeholder="name@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-base text-cream-parchment placeholder:text-cream-parchment/30 outline-none focus:border-gold-primary focus:drop-shadow-[0_4px_6px_rgba(212,175,55,0.15)] transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col space-y-2">
                <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Telefonnummer für Rückruf (optional)</span>
                </label>
                <input
                  id="input-phone"
                  type="tel"
                  placeholder="z.B. +49 176 12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-base text-cream-parchment placeholder:text-cream-parchment/30 outline-none focus:border-gold-primary focus:drop-shadow-[0_4px_6px_rgba(212,175,55,0.15)] transition-all"
                />
              </div>

              {/* About */}
              <div className="flex flex-col space-y-2">
                <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                  <ScrollText className="h-4 w-4" />
                  <span>Erzählt uns kurz von Euch (optional)</span>
                </label>
                <textarea
                  id="input-about"
                  rows={3}
                  placeholder="Warum möchtet Ihr Teil der Drachen Taverne werden? Welche Erfahrungen bringt Ihr mit?"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="border-0 border-b-2 border-gold-secondary/40 bg-transparent py-2 font-serif text-sm text-cream-parchment placeholder:text-cream-parchment/30 outline-none focus:border-gold-primary transition-all resize-none"
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                id="btn-submit-application"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gold-primary border border-gold-primary px-10 py-4 font-cinzel text-sm font-black tracking-widest uppercase text-void-black hover:bg-gold-bright transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Brieftaube fliegt...' : 'Kurzbewerbung jetzt absenden'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
