import { Screen } from './types';

export const BASE_URL = 'https://drakzittau.de';

/** URL-Pfad je Ansicht. Muss mit public/sitemap.xml übereinstimmen. */
export const SCREEN_PATHS: Record<Screen, string> = {
  [Screen.HOME]: '/',
  [Screen.MENU]: '/speisekarte',
  [Screen.GALLERY]: '/galerie',
  [Screen.RESERVE]: '/reservierung',
  [Screen.JOBS]: '/jobs',
  [Screen.IMPRESSUM]: '/impressum',
  [Screen.DATENSCHUTZ]: '/datenschutz',
  [Screen.NOT_FOUND]: '/404',
};

export interface RouteMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'restaurant';
  canonical: string;
  navLabel: string;
  navTooltip: string;
}

/**
 * Titel und Meta-Description je Ansicht (für SEO).
 * Schema: [Seiten-Thema] | [Firmen-/Markenname]
 * Description: prägnant 140–160 Zeichen.
 */
export const SCREEN_META: Record<Screen, RouteMeta> = {
  [Screen.HOME]: {
    title: 'Mittelalter-Restaurant & Taverne in Zittau | Drachen Taverne',
    description:
      'Erlebe die Drachen Taverne in Zittau: Deftige Speisen, süffiger Met und authentische Tavernenatmosphäre im historischen Gewölbe. Jetzt Tisch reservieren!',
    ogTitle: 'Drachen Taverne – Mittelalter-Restaurant in Zittau',
    ogDescription:
      'Deftige Speisen, Met und Tavernenatmosphäre im historischen Gewölbe von Zittau. Jetzt Tisch reservieren.',
    ogType: 'restaurant',
    canonical: `${BASE_URL}/`,
    navLabel: 'Startseite',
    navTooltip: 'Startseite – Mittelalterliches Restaurant Drachen Taverne Zittau',
  },
  [Screen.MENU]: {
    title: 'Speisekarte & Deftige Tavernenküche | Drachen Taverne Zittau',
    description:
      'Die Speisekarte der Drachen Taverne Zittau: Herzhafte Pfannen, saftiger Braten, vegetarische Gaumenfreuden, Met und Biere wie anno dazumal genießen.',
    ogTitle: 'Speisekarte & Tavernenkost – Drachen Taverne Zittau',
    ogDescription:
      'Entdecke unsere Speisekarte mit deftigen Hauptgängen, Vorspeisen, Met, Bier und Cocktails im mittelalterlichen Ambiente.',
    ogType: 'restaurant',
    canonical: `${BASE_URL}/speisekarte`,
    navLabel: 'Speisen & Trank',
    navTooltip: 'Speisekarte – Deftige Speisen, Met und Getränke in Zittau',
  },
  [Screen.RESERVE]: {
    title: 'Tisch online reservieren | Drachen Taverne Zittau',
    description:
      'Reserviert Euren Tisch in der Drachen Taverne Zittau bequem online. Genießt unvergessliche Abende im historischen Kreuzgewölbe oder im Biergarten.',
    ogTitle: 'Tisch reservieren – Drachen Taverne Zittau',
    ogDescription:
      'Reserviert Euren Tisch in der Drachen Taverne Zittau online für das historische Gewölbe oder den Biergarten.',
    ogType: 'restaurant',
    canonical: `${BASE_URL}/reservierung`,
    navLabel: 'Reservierung',
    navTooltip: 'Tisch reservieren – Drachen Taverne Zittau online buchen',
  },
  [Screen.GALLERY]: {
    title: 'Galerie & Gewölbe-Impressionen | Drachen Taverne Zittau',
    description:
      'Fotogalerie der Drachen Taverne Zittau: Entdeckt urige Tavernenräume, stimmungsvolle Dekorationen, mittelalterliche Feste und historische Gewölbe.',
    ogTitle: 'Galerie & Impressionen – Drachen Taverne Zittau',
    ogDescription:
      'Bilder und Videos aus der Drachen Taverne Zittau: Gastraum, historisches Gewölbe, Dekoration und Veranstaltungen.',
    ogType: 'website',
    canonical: `${BASE_URL}/galerie`,
    navLabel: 'Galerie',
    navTooltip: 'Galerie – Fotos und Impressionen aus dem historischen Gewölbe',
  },
  [Screen.JOBS]: {
    title: 'Jobs & Tavernen-Zunft Karriere | Drachen Taverne Zittau',
    description:
      'Werde Teil unserer Tavernen-Zunft! Aktuelle Stellenangebote für Servicekräfte, Küchenhilfen und Köche in der Drachen Taverne Zittau. Jetzt bewerben.',
    ogTitle: 'Karriere & Jobs – Drachen Taverne Zittau',
    ogDescription:
      'Offene Stellen in der Drachen Taverne Zittau: Werdet Teil unserer Tavernen-Zunft in Service und Küche.',
    ogType: 'website',
    canonical: `${BASE_URL}/jobs`,
    navLabel: 'Zunft (Jobs)',
    navTooltip: 'Jobs & Karriere – Werde Teil der Tavernen-Zunft in Zittau',
  },
  [Screen.IMPRESSUM]: {
    title: 'Impressum & Kontakt | Drachen Taverne Zittau',
    description:
      'Impressum und rechtliche Anbieterkennzeichnung der Drachen Taverne in Zittau: Kontaktdaten, Anschrift, Vertretungsberechtigte und rechtliche Angaben.',
    ogTitle: 'Impressum – Drachen Taverne Zittau',
    ogDescription:
      'Impressum und Anbieterkennzeichnung der Drachen Taverne Zittau gemäß § 5 TMG.',
    ogType: 'website',
    canonical: `${BASE_URL}/impressum`,
    navLabel: 'Impressum',
    navTooltip: 'Impressum & Anbieterkennzeichnung – Drachen Taverne Zittau',
  },
  [Screen.DATENSCHUTZ]: {
    title: 'Datenschutzerklärung & DSGVO | Drachen Taverne Zittau',
    description:
      'Datenschutzerklärung der Drachen Taverne Zittau: Detaillierte Informationen über die Erhebung, Verarbeitung und Nutzung personenbezogener Daten nach DSGVO.',
    ogTitle: 'Datenschutzerklärung – Drachen Taverne Zittau',
    ogDescription:
      'Datenschutzerklärung der Drachen Taverne Zittau nach Vorgaben der DSGVO.',
    ogType: 'website',
    canonical: `${BASE_URL}/datenschutz`,
    navLabel: 'Datenschutz',
    navTooltip: 'Datenschutzerklärung & Datenschutzinformationen nach DSGVO',
  },
  [Screen.NOT_FOUND]: {
    title: 'Seite nicht gefunden (404) | Drachen Taverne Zittau',
    description:
      'Die gesuchte Seite der Drachen Taverne Zittau konnte leider nicht gefunden werden. Kehre hier zurück zu unserer Startseite oder zur Speisekarte.',
    ogTitle: '404 - Seite nicht gefunden – Drachen Taverne Zittau',
    ogDescription: 'Diese Seite existiert nicht. Zurück zur Drachen Taverne Zittau.',
    ogType: 'website',
    canonical: `${BASE_URL}/404`,
    navLabel: '404',
    navTooltip: 'Seite nicht gefunden – Zurück zur Drachen Taverne Zittau',
  },
};

/** Ermittelt die Ansicht zu einem URL-Pfad; unbekannte Pfade führen zur 404-Ansicht. */
export function screenFromPath(pathname: string): Screen {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const match = (Object.entries(SCREEN_PATHS) as [Screen, string][]).find(
    ([, path]) => path === clean,
  );
  return match ? match[0] : Screen.NOT_FOUND;
}
