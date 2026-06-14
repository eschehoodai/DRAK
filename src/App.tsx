/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import MenuView from './components/MenuView';
import GalleryView from './components/GalleryView';
import ImpressumView from './components/ImpressumView';
import ReservationView from './components/ReservationView';
import { Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [initialReserveNotes, setInitialReserveNotes] = useState<string | undefined>(undefined);

  const handleNavigate = (screen: Screen, notesMsg?: string) => {
    if (notesMsg) {
      setInitialReserveNotes(notesMsg);
    }
    setCurrentScreen(screen);
    // Smoothly scroll to the top of the viewport for seamless medieval transition
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleClearNotes = () => {
    setInitialReserveNotes(undefined);
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-void-black text-cream-parchment font-serif selection:bg-gold-primary selection:text-void-black">
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
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
