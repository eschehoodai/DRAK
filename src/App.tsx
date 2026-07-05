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
import { CookieBanner } from './components/CookieBanner';
import BackgroundMusic from './components/BackgroundMusic';
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

  // Per-view title and meta description for SEO
  useEffect(() => {
    const meta = SCREEN_META[currentScreen];
    document.title = meta.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', meta.description);
    }
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag && currentScreen !== Screen.NOT_FOUND) {
      const path = SCREEN_PATHS[currentScreen];
      canonicalTag.setAttribute('href', `https://drakzittau.de${path === '/' ? '/' : path}`);
    }
  }, [currentScreen]);

  const handleClearNotes = () => {
    setInitialReserveNotes(undefined);
  };

  return (
    <CookieProvider>
      <div id="app-root" className="min-h-screen flex flex-col bg-void-black text-cream-parchment font-serif selection:bg-gold-primary selection:text-void-black">
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
