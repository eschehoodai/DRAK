import { useEffect, useRef } from 'react';
import tavernTrack from '../assets/images/taverne.mp3.mp3';

/**
 * Plays looping tavern ambience with no visible UI of any kind.
 *
 * - Playback begins on the first user interaction (click, scroll, touchstart,
 *   keydown or mousemove). play() is invoked synchronously inside the gesture
 *   handler so browser autoplay policies — including iOS Safari — accept it.
 * - When the tab goes to the background the audio pauses and the "started" flag
 *   resets, so returning to the tab leaves the music off until a fresh user
 *   interaction starts it again.
 *
 * Volume is fixed at 0.3 and intentionally has no controls (no play button,
 * mute, slider or persistence).
 */
export function useBackgroundMusic(): void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  // Create the audio element imperatively (never in JSX) and tear it down on unmount.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = true;
    audio.volume = 0.3;
    audio.src = tavernTrack;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Start playback on the first user gesture. The listeners stay attached for the
  // whole lifetime of the hook; the startedRef guard turns repeated events (e.g.
  // a stream of mousemove events) into cheap no-ops once playback has begun.
  useEffect(() => {
    const startPlayback = () => {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;
      startedRef.current = true;
      // Silently ignore autoplay rejections or a missing file — never crash the UI.
      audio.play().catch(() => {});
    };

    const events = ['click', 'scroll', 'touchstart', 'keydown', 'mousemove'];
    events.forEach((event) =>
      window.addEventListener(event, startPlayback, { passive: true }),
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, startPlayback),
      );
    };
  }, []);

  // Pause when the tab is hidden and reset the flag, so the music only resumes
  // after a new user gesture once the tab becomes visible again.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
        startedRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
