# Drachen Taverne Zittau – Website

Website des mittelalterlichen Restaurants **Drachen Taverne** in Zittau
(Innere Weberstraße 11, 02763 Zittau) — https://drakzittau.de/

Single-Page-Anwendung mit React 19, Vite 6, Tailwind CSS 4 und TypeScript.

## Voraussetzungen

- Node.js 20 oder neuer

## Entwicklung

```bash
npm install     # Abhängigkeiten installieren
npm run dev     # Entwicklungsserver auf http://localhost:3000
```

## Veröffentlichung

```bash
npm run build   # erzeugt den Ordner dist/
```

Den kompletten Inhalt von `dist/` in das Web-Verzeichnis des Hosters hochladen
(statisches Hosting mit HTTPS genügt).

## Projektstruktur

| Pfad | Inhalt |
|---|---|
| `index.html` | HTML-Grundgerüst, SEO-Metadaten, Schema.org-Markup |
| `src/App.tsx` | Zentrale Navigation zwischen den Ansichten |
| `src/components/` | Alle Seiten und Bausteine (Home, Speisekarte, Galerie, Reservierung, Jobs, Impressum, Datenschutz, Cookie-Banner) |
| `src/assets/images/` | Bilder, Videos, Musik, Speisekarten-PDF |
| `public/` | Favicons, robots.txt, sitemap.xml, .htaccess |

Ausführliche Kunden- und Projektdokumentation: siehe [`KUNDENDOKUMENTATION.md`](file:///c:/Users/X/Desktop/Drachentaerne/KUNDENDOKUMENTATION.md).

## Hinweis Reservierung

Das Reservierungsformular speichert Buchungen derzeit nur im Browser des
Gastes (localStorage) — es wird **keine Benachrichtigung an das Restaurant**
versendet. Für den Produktivbetrieb muss ein E-Mail-Versand oder ein
Reservierungssystem angebunden werden.
