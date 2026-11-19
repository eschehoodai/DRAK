/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import fireMp4 from '../assets/images/fire-loop.mp4';
import fireWebm from '../assets/images/fire-loop.webm';

interface FlameDividerProps {
  /** Height of the flame zone in pixels (default: 550) */
  height?: number;
  className?: string;
}

export default function FlameDivider({ height = 550, className = '' }: FlameDividerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mq.addEventListener('change', handleMotionChange);

    const video = videoRef.current;
    let cleanupUnlock: (() => void) | null = null;

    if (video) {
      // Essential for Android Chrome & iOS Safari mobile autoplay
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      // Attempt immediate autoplay
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Mobile autoplay policy blocked: unlock on first touch or scroll
          const unlockPlayback = () => {
            video.play().catch(() => {});
            window.removeEventListener('touchstart', unlockPlayback);
            window.removeEventListener('scroll', unlockPlayback);
          };
          window.addEventListener('touchstart', unlockPlayback, { passive: true, once: true });
          window.addEventListener('scroll', unlockPlayback, { passive: true, once: true });
          cleanupUnlock = () => {
            window.removeEventListener('touchstart', unlockPlayback);
            window.removeEventListener('scroll', unlockPlayback);
          };
        });
      }
    }

    const container = containerRef.current;
    if (!container || !video) return;

    // Autopause when far out of viewport, preload 300px before appearing
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!mq.matches && video.paused) {
              video.play().catch(() => {});
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      { rootMargin: '300px 0px 300px 0px', threshold: 0 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      mq.removeEventListener('change', handleMotionChange);
      if (cleanupUnlock) {
        cleanupUnlock();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute left-0 right-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      style={{
        top: `-${height}px`,
        height: `${height}px`,
      }}
    >
      {/* Real fire video with seamless screen blend mode and feather top mask */}
      {!isReducedMotion ? (
        <div
          className="w-full h-full relative mix-blend-screen"
          style={{
            maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
            transform: 'translateZ(0)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-bottom opacity-95"
          >
            <source src={fireMp4} type="video/mp4" />
            <source src={fireWebm} type="video/webm" />
          </video>
        </div>
      ) : (
        /* Reduced motion: warm, static ember glow */
        <div className="w-full h-full bg-gradient-to-t from-gold-primary/30 via-gold-dark/15 to-transparent" />
      )}

      {/* Radiant molten gold baseline accent directly on top of the divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-bright to-transparent shadow-[0_0_15px_rgba(245,158,11,0.85)] opacity-85 pointer-events-none" />
    </div>
  );
}
