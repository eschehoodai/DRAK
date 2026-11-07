import { useEffect, useRef } from 'react';
import tavernTrack from '../assets/images/taverne.mp3.mp3';

/**
 * Plays looping tavern ambience with no visible UI of any kind.
 *
 * - Attempts immediate playback on load, falling back to aggressive capture-phase
 *   listeners on any user action (pointermove, click, scroll, touch, keydown, focus).
 * - Pauses playback when the tab is hidden and automatically resumes when the tab
 *   becomes visible again.
 *
 * Volume is set to 0.2.
 */
export function useBackgroundMusic(): void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.2;
    audio.src = tavernTrack;
    audioRef.current = audio;

    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'pointermove',
      'mousedown',
      'click',
      'scroll',
      'wheel',
      'touchstart',
      'keydown',
      'focus',
    ];

    let listenersAttached = false;

    const cleanupListeners = () => {
      if (!listenersAttached) return;
      listenersAttached = false;
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction, { capture: true });
      });
    };

    const attachListeners = () => {
      if (listenersAttached) return;
      listenersAttached = true;
      events.forEach((event) => {
        window.addEventListener(event, handleInteraction, {
          capture: true,
          passive: true,
        });
      });
    };

    const playAudio = () => {
      if (!audioRef.current || startedRef.current) return;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            startedRef.current = true;
            cleanupListeners();
          })
          .catch(() => {
            // Autoplay was blocked by browser policy; wait for user interaction
            attachListeners();
          });
      }
    };

    const handleInteraction = () => {
      playAudio();
    };

    // 1. Sofortiger aggressiver Autoplay-Versuch bei Seitenaufruf
    playAudio();

    // Listener vorsorglich aktivieren, falls Autoplay fehlschlägt oder pending ist
    if (!startedRef.current) {
      attachListeners();
    }

    // 2. Tab-Sichtbarkeit handhaben
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
      } else if (startedRef.current) {
        audioRef.current?.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanupListeners();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);
}
