import React from 'react';

interface DrakLogoProps {
  /** 'header' for the main sticky navbar, 'drawer' for the compact mobile menu pill */
  variant?: 'header' | 'drawer';
}

/**
 * Brand wordmark combining a custom heraldic dragon crest SVG with the DRAK Cinzel logotype.
 */
export const DrakLogo: React.FC<DrakLogoProps> = ({ variant = 'header' }) => {
  const isDrawer = variant === 'drawer';

  return (
    <span className="inline-flex items-center space-x-2 sm:space-x-2.5">
      {/* Heraldic Dragon Crest */}
      <svg
        viewBox="0 0 40 40"
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
          <linearGradient id="drak-gold-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5D061" />
            <stop offset="50%" stopColor="#C99738" />
            <stop offset="100%" stopColor="#8F651E" />
          </linearGradient>
        </defs>

        {/* Subtle Shield / Crest Frame */}
        <path
          d="M20 2.5L34.5 8.5V19.5C34.5 28.2 28.2 34.8 20 37.5C11.8 34.8 5.5 28.2 5.5 19.5V8.5L20 2.5Z"
          stroke="url(#drak-gold-grad)"
          strokeWidth="1.5"
          fill="rgba(201, 151, 56, 0.08)"
        />
        <path
          d="M20 5L32 10V19.5C32 26.6 26.8 32 20 34.5C13.2 32 8 26.6 8 19.5V10L20 5Z"
          stroke="url(#drak-gold-grad)"
          strokeOpacity="0.35"
          strokeWidth="0.75"
        />

        {/* Stylized Heraldic Dragon Silhouette */}
        <path
          d="M26.5 12.5C24.8 11.2 22.3 11 20.5 12.1C19.2 12.9 18.7 14.3 19.1 15.6C17.4 15.2 15.6 15.7 14.4 17C13 18.5 12.8 20.8 13.8 22.6C14.6 24 16.1 24.8 17.6 25C16.8 26.1 15.5 26.8 14 27C15.8 28.2 18.2 28.4 20.2 27.4C22.4 26.3 23.7 24.2 23.8 21.8C23.9 20.3 23.3 19 22.3 18.1C23.5 18.3 24.8 17.9 25.7 17C26.4 16.3 26.8 15.3 26.7 14.3L28.5 13.8L26.5 12.5Z"
          fill="url(#drak-gold-grad)"
        />
        {/* Dragon Wing Accent */}
        <path
          d="M15.2 16.5C13.5 15.2 12.2 13.5 12 11.5C13.6 12.2 15.1 13.3 16.2 14.8"
          stroke="url(#drak-gold-grad)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dragon Horn / Crown */}
        <path
          d="M24.2 11.6L26 9.5L25.6 12.1"
          stroke="url(#drak-gold-grad)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
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
