/**
 * Google Ads & Google Tag (gtag.js) Utility
 * Account ID: AW-18461699802
 */

export const GOOGLE_ADS_ID = 'AW-18461699802';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Updates Google Consent Mode v2 state based on user cookie choices
 */
export function updateGtagConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;

  const status = granted ? 'granted' : 'denied';

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
      analytics_storage: status,
    });
  } else if (window.dataLayer) {
    window.dataLayer.push([
      'consent',
      'update',
      {
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
        analytics_storage: status,
      },
    ]);
  }
}

/**
 * Sends a generic gtag event
 */
export function trackGtagEvent(action: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  } else if (window.dataLayer) {
    window.dataLayer.push(['event', action, params]);
  }
}

/**
 * Tracks a completed table reservation as a Google Ads conversion
 */
export function trackReservationSuccess(bookingId: string, guests: number): void {
  // Google Ads conversion event
  trackGtagEvent('conversion', {
    send_to: GOOGLE_ADS_ID,
    booking_id: bookingId,
    party_size: guests,
    event_category: 'Reservation',
    event_label: 'Online Tischreservierung',
  });

  // Additional semantic event for Google Analytics / Google Ads
  trackGtagEvent('reservation_submitted', {
    booking_id: bookingId,
    party_size: guests,
  });
}

/**
 * Tracks clicks on tavern phone links
 */
export function trackPhoneCallClick(): void {
  trackGtagEvent('conversion', {
    send_to: GOOGLE_ADS_ID,
    event_category: 'Contact',
    event_label: 'Telefonanruf Klick',
  });

  trackGtagEvent('phone_call_click', {
    event_category: 'Contact',
  });
}
