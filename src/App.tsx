/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import MenuView from './components/MenuView';
import GalleryView from './components/GalleryView';
import ImpressumView from './components/ImpressumView';
import ReservationView from './components/ReservationView';
import JobsView from './components/JobsView';
import DatenschutzView from './components/DatenschutzView';
import NotFoundView from './components/NotFoundView';
import { CookieBanner } from './components/ConsentNotice';
import BackgroundMusic from './components/BackgroundMusic';
import StructuredData from './components/StructuredData';
import { CookieProvider } from './context/CookieContext';
import { Screen } from './types';
import { SCREEN_PATHS, SCREEN_META, screenFromPath } from './routes';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() =>
    screenFromPath(window.location.pathname),
  );
  const [initialReserveNotes, setInitialReserveNotes] = useState<string | undefined>(undefined);

  const handleNavigate = (screen: Screen, notesMsg?: string) => {
    if (notesMsg) {
      setInitialReserveNotes(notesMsg);
    }
    const path = SCREEN_PATHS[screen];
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentScreen(screen);
    // Smoothly scroll to the top of the viewport for seamless medieval transition
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentScreen(screenFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Per-view title, canonical and meta tags for SEO & Sitelinks
  useEffect(() => {
    const meta = SCREEN_META[currentScreen];
    document.title = meta.title;

    const setOrCreateMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setOrCreateMeta('name', 'description', meta.description);
    setOrCreateMeta('property', 'og:title', meta.ogTitle || meta.title);
    setOrCreateMeta('property', 'og:description', meta.ogDescription || meta.description);
    setOrCreateMeta('property', 'og:url', meta.canonical);
    setOrCreateMeta('property', 'og:type', meta.ogType);
    setOrCreateMeta('name', 'twitter:title', meta.ogTitle || meta.title);
    setOrCreateMeta('name', 'twitter:description', meta.ogDescription || meta.description);

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    if (currentScreen !== Screen.NOT_FOUND) {
      canonicalTag.setAttribute('href', meta.canonical);
    }
  }, [currentScreen]);

  const handleClearNotes = () => {
    setInitialReserveNotes(undefined);
  };

  return (
    <CookieProvider>
      <div id="app-root" className="min-h-screen flex flex-col bg-void-black text-cream-parchment font-serif selection:bg-gold-primary selection:text-void-black">
        {/* Schema.org / JSON-LD Structured Data for Sitelinks & Search Engines */}
        <StructuredData />

        {/* Headless looping tavern ambience — no visible controls, renders nothing */}
        <BackgroundMusic />

        {/* Immersive subtle ambient grain pattern placeholder overlay */}
        <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.02] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Global Header Navigation */}
        <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

        {/* Main Content Area */}
        <main className="flex-grow">
          {currentScreen === Screen.HOME && (
            <HomeView onNavigate={handleNavigate} />
          )}

          {currentScreen === Screen.MENU && (
            <MenuView onNavigate={handleNavigate} />
          )}

          {currentScreen === Screen.GALLERY && (
            <GalleryView onNavigate={handleNavigate} />
          )}

          {currentScreen === Screen.IMPRESSUM && (
            <ImpressumView />
          )}

          {currentScreen === Screen.RESERVE && (
            <ReservationView
              initialNotes={initialReserveNotes}
              onClearNotes={handleClearNotes}
            />
          )}

          {currentScreen === Screen.JOBS && (
            <JobsView />
          )}

          {currentScreen === Screen.DATENSCHUTZ && (
            <DatenschutzView />
          )}

          {currentScreen === Screen.NOT_FOUND && (
            <NotFoundView onNavigate={handleNavigate} />
          )}
        </main>

        {/* Global Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* DSGVO Cookie Banner */}
        <CookieBanner onNavigateDatenschutz={() => handleNavigate(Screen.DATENSCHUTZ)} />
      </div>
    </CookieProvider>
  );
}
