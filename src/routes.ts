import { Screen } from './types';

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

/** Titel und Meta-Description je Ansicht (für SEO). */
export const SCREEN_META: Record<Screen, { title: string; description: string }> = {
  [Screen.HOME]: {
    title: 'Drachen Taverne – Mittelalter-Restaurant in Zittau',
    description:
      'Die Drachen Taverne in Zittau: Mittelalterliches Restaurant mit deftigen Speisen, Met und Tavernenatmosphäre im historischen Gewölbe. Jetzt Tisch reservieren.',
  },
  [Screen.MENU]: {
    title: 'Speisekarte – Drachen Taverne Zittau',
    description:
      'Die Speisekarte der Drachen Taverne Zittau: deftige Hauptgänge, Vorspeisen, Nachspeisen, Met, Bier und Cocktails – mittelalterlich serviert.',
  },
  [Screen.GALLERY]: {
    title: 'Galerie – Drachen Taverne Zittau',
    description:
      'Bilder und Videos aus der Drachen Taverne Zittau: Gastraum, historisches Gewölbe, Dekoration und Veranstaltungen.',
  },
  [Screen.RESERVE]: {
    title: 'Tisch reservieren – Drachen Taverne Zittau',
    description:
      'Reserviert Euren Tisch in der Drachen Taverne Zittau – im Gewölbe-Gastraum oder im Biergarten unter den alten Linden.',
  },
  [Screen.JOBS]: {
    title: 'Jobs – Drachen Taverne Zittau',
    description:
      'Offene Stellen in der Drachen Taverne Zittau: Werdet Teil unserer Tavernen-Zunft in Service und Küche.',
  },
  [Screen.IMPRESSUM]: {
    title: 'Impressum – Drachen Taverne Zittau',
    description: 'Impressum und Anbieterkennzeichnung der Drachen Taverne Zittau.',
  },
  [Screen.DATENSCHUTZ]: {
    title: 'Datenschutz – Drachen Taverne Zittau',
    description: 'Datenschutzerklärung der Drachen Taverne Zittau gemäß DSGVO.',
  },
  [Screen.NOT_FOUND]: {
    title: 'Seite nicht gefunden – Drachen Taverne Zittau',
    description: 'Diese Seite existiert nicht. Zurück zur Drachen Taverne Zittau.',
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
