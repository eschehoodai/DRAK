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

## E-Mail-Versand & Backend

Das Reservierungs- und Bewerbungssystem ist an PHP-Endpunkte (`public/send-booking.php`, `public/send-cancellation.php`, `public/send-job-application.php`) angebunden. Auf dem Netcup-Webhosting werden Anfragen automatisch per E-Mail an den Tavernen-Betreiber zugestellt.

