export const BASE_URL = 'https://drakzittau.de';

export interface SiteNavItem {
  name: string;
  url: string;
  description: string;
}

export const MAIN_NAVIGATION_ITEMS: SiteNavItem[] = [
  {
    name: 'Startseite',
    url: `${BASE_URL}/`,
    description: 'Startseite der Drachen Taverne Zittau mit Neuigkeiten und Tavernenschild.',
  },
  {
    name: 'Speisekarte',
    url: `${BASE_URL}/speisekarte`,
    description: 'Deftige Gerichte, Pfannen, Braten, Met und Tavernentränke in historischem Ambiente.',
  },
  {
    name: 'Tisch reservieren',
    url: `${BASE_URL}/reservierung`,
    description: 'Tischreservierung online für das historische Gewölbe oder den Biergarten.',
  },
  {
    name: 'Galerie',
    url: `${BASE_URL}/galerie`,
    description: 'Fotogalerie und Impressionen aus dem historischen Gewölbe der Drachen Taverne.',
  },
  {
    name: 'Zunft (Jobs)',
    url: `${BASE_URL}/jobs`,
    description: 'Offene Stellen in Service und Küche: Werde Teil unserer Tavernen-Zunft.',
  },
  {
    name: 'Impressum',
    url: `${BASE_URL}/impressum`,
    description: 'Rechtliche Anbieterkennzeichnung, Anschrift und Kontakt der Drachen Taverne.',
  },
  {
    name: 'Datenschutz',
    url: `${BASE_URL}/datenschutz`,
    description: 'Datenschutzerklärung und Hinweise zur DSGVO-konformen Datenverarbeitung.',
  },
];

export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: 'Drachen Taverne',
        alternateName: ['Drachen Taverne Zittau', 'Drak Zittau'],
        inLanguage: 'de-DE',
        description:
          'Mittelalterliches Restaurant mit deftigen Speisen, Met und Tavernenatmosphäre im historischen Gewölbe von Zittau.',
      },
      {
        '@type': 'Restaurant',
        '@id': `${BASE_URL}/#restaurant`,
        name: 'Drachen Taverne',
        alternateName: 'Drachen Taverne Zittau',
        description:
          'Mittelalterliches Erlebnis-Restaurant mit deftigen Speisen, Met und Tavernenatmosphäre im historischen Gewölbe von Zittau.',
        url: `${BASE_URL}/`,
        image: `${BASE_URL}/android-chrome-512x512.png`,
        logo: `${BASE_URL}/android-chrome-512x512.png`,
        telephone: '+49 3583 5495389',
        email: 'drakzittau@dlr-gastro-event.de',
        servesCuisine: ['Deutsch', 'Mittelalterlich', 'Rustikal'],
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Innere Weberstraße 11',
          postalCode: '02763',
          addressLocality: 'Zittau',
          addressRegion: 'Sachsen',
          addressCountry: 'DE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 50.8971,
          longitude: 14.8044,
        },
        hasMap: 'https://maps.google.com/?q=Innere+Weberstra%C3%9Fe+11,+02763+Zittau',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '11:00',
            closes: '14:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '17:00',
            closes: '21:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '17:00',
            closes: '22:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '11:00',
            closes: '14:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '17:00',
            closes: '22:00',
          },
        ],
        acceptsReservations: 'True',
        menu: `${BASE_URL}/speisekarte`,
      },
      ...MAIN_NAVIGATION_ITEMS.map((item, index) => ({
        '@type': 'SiteNavigationElement',
        '@id': `${BASE_URL}/#nav-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        position: index + 1,
        name: item.name,
        url: item.url,
        description: item.description,
      })),
    ],
  };
}

