import React, { useId } from 'react';

interface DrakLogoProps {
  /** 'header' for the main sticky navbar, 'drawer' for the compact mobile menu pill */
  variant?: 'header' | 'drawer';
}

/**
 * Brand wordmark combining a custom heraldic dragon crest SVG with the DRAK Cinzel logotype.
 */
export const DrakLogo: React.FC<DrakLogoProps> = ({ variant = 'header' }) => {
  const isDrawer = variant === 'drawer';
  const uid = useId();
  const gradId = `drak-gold-grad-${uid}`;
  const maskId = `drak-dragon-cutouts-${uid}`;

  return (
    <span className="inline-flex items-center space-x-2 sm:space-x-2.5">
      {/* Heraldic Dragon Crest */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={`shrink-0 transition-all duration-300 ${
          isDrawer
            ? 'h-5 w-5'
            : 'h-7 w-7 sm:h-9 sm:w-9 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(201,151,56,0.5)]'
        }`}
      >
        <defs>
          <linearGradient id={gradId} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8DC7A" />
            <stop offset="50%" stopColor="#D4A23E" />
            <stop offset="100%" stopColor="#9A6E20" />
          </linearGradient>
          <mask id={maskId}>
            <rect width="64" height="64" fill="white" />
            {/* Fierce slanted dragon eye cutout */}
            <path d="M39.8 15.6 L42.9 14.8 L41.7 16.5 Z" fill="black" />
          </mask>
        </defs>

        {/* Heraldic Shield Frame */}
        <path
          d="M32 3.5 L55.5 12.8 V30.5 C55.5 45.5 45.2 56 32 60 C18.8 56 8.5 45.5 8.5 30.5 V12.8 L32 3.5 Z"
          stroke={`url(#${gradId})`}
          strokeWidth={isDrawer ? '2.6' : '2.2'}
          fill="rgba(201, 151, 56, 0.08)"
        />

        {/* Rampant Heraldic Dragon Silhouette */}
        <path
          mask={`url(#${maskId})`}
          fill={`url(#${gradId})`}
          d="M26.8 9.4C30.6 10.1 33.8 11.6 36.2 13.6C38.8 12.6 41.8 12.7 44.2 13.5L45.2 12.2L46.1 14C48 14.6 49.6 15.4 50.6 16.4L47.4 17.6L46.4 18.8L45.4 17.5L41.2 18.4L48 20.6C47 21.8 45 22.3 42.6 21.8L39 21.2C37.2 22.8 36.8 24.8 38 27.2L42.8 26.8L46.8 24.8L45.4 26.9L48 27.3L45.2 28.5L46.6 30.2L43.4 29.2L38 30.8C36.2 33.2 33.6 35.2 32 37.8C31.2 39.2 31.5 40.3 33 41.2C35.8 42.2 37.8 43.4 37.8 45.2C37.8 46.8 36 48.2 35.6 49.5L40.4 50.4L38 51L39.4 52.4L36.2 51.6L33.4 52.3L33.9 50.4C33.2 49.3 33.8 47.4 34.5 45.8C33 44.6 30.8 43.8 28.8 43.6C26.2 44.5 24.8 46.6 25 49C25.2 51.2 27.4 52.6 30.4 53C27.6 54.8 23 54.4 19.8 51.6C16.4 48.6 15.6 44 17.3 39.6L15 39.3L18.6 34.8L21.3 39.8L19.2 39.6C18.3 43 19.2 46.6 21.6 48.8C21.8 45.6 23 42.4 25.6 39.8C24.4 37.6 24.2 35 25.2 32.6C22.4 31.2 20.2 30.6 17.8 31.8C18.4 29 19.4 27.6 21.2 26.8C18.2 26.4 16 26.6 13.8 27.8C15 25 16.6 23.4 19 22.6C16.2 21.8 14 21.8 12 22.6C13.8 19.6 16.4 17.8 19.2 17C17 15.2 15.6 13.8 14.8 12.2C20.2 14 25 18 29.2 23.8C30 22 30.8 20.4 31.4 19L29.4 18.2L31.8 17.4C32.3 16.4 32.7 15.5 33.1 14.8L29.2 13.6L33.2 13.4C31.4 11.8 29.2 10.4 26.8 9.4Z"
        />
      </svg>

      {/* Wordmark */}
      <span
        id={isDrawer ? undefined : 'hdr-logo-text'}
        className={`font-cinzel font-extrabold tracking-widest text-gold-primary transition-colors group-hover:text-gold-bright ${
          isDrawer ? 'text-base font-black' : 'text-xl sm:text-3xl'
        }`}
      >
        DRAK
      </span>
    </span>
  );
};
