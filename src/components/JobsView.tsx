/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { JobApplication, JobPosition } from '../types';
import { Briefcase, User, Mail, Phone, MessageCircle, UploadCloud, ScrollText, FileText, X } from 'lucide-react';

const POSITIONS: JobPosition[] = ['Servicekraft', 'Koch/Köchin'];

const WHATSAPP_OPTIONS = [
  'Ja gerne, unkompliziert per WhatsApp schreiben',
  'Nein, lieber per E-Mail oder Telefon',
];

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function JobsView() {
  const [position, setPosition] = useState<JobPosition>('Servicekraft');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState(WHATSAPP_OPTIONS[0]);
  const [about, setAbout] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState<JobApplication | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const validateAndSetFile = (selected: File | null) => {
    setFileError('');
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFileError('Euer Schriftstück ist zu schwer (max. 10 MB). Bitte wählt eine kleinere Datei.');
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Seid gegrüßt! Bitte hinterlasst zumindest Euren Namen und Eure Inschrift (E-Mail).');
      return;
    }

    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const id = `DRAK-ZUNFT-${toRoman(2026)}-${randomSuffix}`;

    const application: JobApplication = {
      id,
      position,
      name,
      email,
      phone: phone || undefined,
      whatsapp,
      about: about || undefined,
      fileName: file?.name,
    };

    setSubmitted(application);
  };

  const resetForm = () => {
    setSubmitted(null);
    setPosition('Servicekraft');
    setName('');
    setEmail('');
    setPhone('');
    setWhatsapp(WHATSAPP_OPTIONS[0]);
    setAbout('');
    setFile(null);
    setFileError('');
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
              {submitted.fileName && (
                <div className="flex justify-between items-center gap-3 text-xs md:text-sm">
                  <span className="text-cream-parchment/50 font-cinzel tracking-wider shrink-0">FOLIANT:</span>
                  <span className="font-serif text-cream-parchment/90 truncate">{submitted.fileName}</span>
                </div>
              )}
            </div>

            <div className="pt-2 text-xs text-cream-parchment/60 leading-relaxed mb-8 max-w-md mx-auto">
              Habt Dank für Euer Interesse! Unser Burgherr meldet sich innerhalb von 3 Werktagen per Telefon oder WhatsApp bei Euch.
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
              Sendet uns einfach Eure Eckdaten. Kein stundenlanges Schreiben nötig – wir melden uns innerhalb von 3 Werktagen per Telefon oder WhatsApp.
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

              {/* Phone + WhatsApp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                <div className="flex flex-col space-y-2">
                  <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp erwünscht?</span>
                  </label>
                  <select
                    id="select-whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="border-0 border-b-2 border-gold-secondary/40 bg-tavern-dark py-2.5 font-serif text-base text-cream-parchment outline-none focus:border-gold-primary transition-all cursor-pointer"
                  >
                    {WHATSAPP_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-void-black text-cream-parchment">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
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

              {/* CV / cover letter upload */}
              <div className="flex flex-col space-y-3">
                <label className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase">
                  Lebenslauf / Bewerbungsschreiben (optional)
                </label>

                <input
                  ref={fileInputRef}
                  id="input-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  className="hidden"
                  onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)}
                />

                {file ? (
                  <div
                    id="file-selected"
                    className="flex items-center justify-between gap-4 border-2 border-gold-primary/60 bg-gold-primary/5 p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-6 w-6 text-gold-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="font-serif text-sm text-cream-parchment truncate">{file.name}</p>
                        <p className="font-mono text-[10px] text-cream-parchment/50">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      id="btn-remove-file"
                      onClick={() => validateAndSetFile(null)}
                      className="p-1.5 text-cream-parchment/60 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                      title="Datei entfernen"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    id="file-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-gold-primary bg-gold-primary/10'
                        : 'border-gold-secondary/30 bg-void-black/20 hover:border-gold-secondary/60'
                    }`}
                  >
                    <UploadCloud className="h-9 w-9 text-gold-secondary" />
                    <p className="font-cinzel text-xs tracking-wider text-cream-parchment/80 uppercase">
                      Lebenslauf hierher ziehen
                    </p>
                    <span className="font-serif text-[11px] italic text-cream-parchment/40">oder</span>
                    <span className="border border-gold-secondary px-5 py-2 font-cinzel text-[11px] tracking-wider uppercase text-gold-secondary hover:text-gold-bright hover:bg-gold-secondary/10 transition-all">
                      Datei auswählen
                    </span>
                    <p className="mt-2 font-serif text-[11px] text-cream-parchment/40">
                      PDF, Word oder Bild (max. 10 MB)
                    </p>
                  </div>
                )}

                {fileError && (
                  <p id="file-error-msg" className="text-rose-400 font-serif text-xs italic">
                    {fileError}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                id="btn-submit-application"
                type="submit"
                className="w-full sm:w-auto bg-gold-primary border border-gold-primary px-10 py-4 font-cinzel text-sm font-black tracking-widest uppercase text-void-black hover:bg-gold-bright transition-all cursor-pointer"
              >
                Kurzbewerbung jetzt absenden
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
