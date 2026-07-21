# Übergabe- & Produktdokumentation
## Website: Drachen Taverne Zittau (drakzittau.de)

---

### Herzlich willkommen!
Diese Dokumentation bietet Ihnen als Eigentümer und Betreiber der **Drachen Taverne Zittau** (Innere Weberstraße 11, 02763 Zittau) einen vollständigen, transparenten Überblick über Ihre neue Website. Sie erfahren hier genau, welche technischen Standards eingesetzt wurden, welche Funktionen Ihre Website bietet und wie der Betrieb optimal gestaltet ist.

---

## 1. Übersicht & Qualitätsversprechen

Ihre neue Website wurde als hochmoderne **Single-Page-Application (SPA)** konzipiert. Im Gegensatz zu traditionellen, oft langsamen Baukasten-Systemen (wie WordPress ohne Optimierung) bietet diese Lösung entscheidende Vorteile:

- **Blitzschnelle Ladezeiten:** Beim Aufruf der Seite wird die Anwendung einmal geladen – der Wechsel zwischen Unterseiten (Speisekarte, Galerie, Reservierung) geschieht sofort und ohne störendes Seitenneuladen.
- **Maximale Sicherheit & Stabilität:** Da die Website im Betrieb keine anfällige Datenbank benötigt, ist sie extrem unempfindlich gegenüber Hackerangriffen, Ausfällen oder Serverüberlastungen.
- **Perfekte Darstellung auf allen Geräten (Responsive Design):** Ob Smartphone, Tablet oder Desktop-PC – das Layout passt sich automatisch und harmonisch an jede Bildschirmgröße an.
- **Authentisches Tavernen-Erlebnis:** Edle Farbpaletten (Warmes Gold, tiefes Schiefergrau), mittelalterliche Typografie und eine optional zuschaltbare Hintergrundmusik sorgen für ein einzigartiges Gästeerlebnis.

---

## 2. Der Funktionsumfang im Detail

### 🏰 Startseite (`/`)
- **Hero-Bereich:** Stimmungsvoller erster Eindruck mit direktem Call-to-Action zur Tischreservierung und Speisekarte.
- **Atmosphärische Einführung:** Vorstellung des historischen Gewölbes ("Die Grosse Kathedrale", "Biergarten").
- **Schnellübersicht:** Öffnungszeiten, Standort und Highlights der Küche direkt auf einen Blick.

### 📜 Interaktive Speisekarte (`/speisekarte`)
- **Übersichtliche Kategorien:** Deftige Hauptgänge, Vorspeisen, Nachspeisen sowie eine umfangreiche Getränkekarte (Met, Biere, Weine & Tavernen-Cocktails).
- **Besonderes Highlight (Pre-Fill):** Gäste können Lieblingsgerichte direkt anklicken und mit einer Notiz nahtlos in die Tischreservierung übernehmen.

### 🖼️ Galerie (`/galerie`)
- **Visuelle Impressionen:** Hochwertige Bilder und Videos präsentieren den Gastraum, die Dekoration und historische Veranstaltungen.
- **Optimierte Medienübertragung:** Komprimierte Formate garantieren schnelle Ladezeiten auch im mobilen Netz.

### 📅 Interaktive Tischreservierung (`/reservierung`)
- **Gäste-Formular:** Erfassung von Datum, Uhrzeit, Personenanzahl, Wunschbereich im Gewölbe und Sonderwünschen.
- **Buchungscode-System:** Nach Absenden der Reservierung erhält der Gast einen eindeutigen Buchungscode zur Bestätigung und Abfrage.
- **Technischer Hinweis zur Flexibilität:** Aktuell speichert das System Reservierungen als interaktiven Prototyp im Browser. Bei Bedarf kann dieses Modul problemlos an ein E-Mail-System (PHP/SMTP) oder an Ihr bestehendes Reservierungssystem (z. B. OpenTable, Resmio, Gastronovi) angebunden werden.

### ⚔️ Jobs & Karriere (`/jobs`)
- **Mittelalterliche Stellenausschreibungen:** Einladende Präsentation offener Positionen in Service und Küche zur Personalgewinnung.

### ⚖️ Rechtssicherheit & DSGVO (`/impressum`, `/datenschutz`)
- **Impressum:** Rechtskonforme Anbieterkennzeichnung (Innere Weberstraße 11, 02763 Zittau).
- **Datenschutzerklärung:** Ausführliche, DSGVO-konforme Information über Datenverarbeitung und Cookies.
- **Cookie-Consent-Banner:** Integriertes Banner zur rechtskonformen Einwilligung der Besucher.

---

## 3. Suchmaschinenoptimierung (SEO) & Google-Integration

Damit die Drachen Taverne von Gästen aus Zittau und Touristen optimal gefunden wird, sind führende SEO-Standards fest integriert:

1. **Schema.org Structured Data (`Restaurant`):**
   - Google erkennt die Website automatisch als lokales Restaurant mit Adresse (Innere Weberstraße 11, 02763 Zittau), Telefonnummer, Öffnungszeiten und Preisklasse (`€€`).
2. **Dynamische Metadaten je Unterseite:**
   - Jede Unterseite (Home, Speisekarte, Reservierung etc.) besitzt eigene Titel und Beschreibungen für perfekte Suchergebnisse.
3. **Social-Media-Vorschau (Open Graph & Twitter Cards):**
   - Wird der Link `https://drakzittau.de` per WhatsApp, Facebook oder Instagram geteilt, erscheint automatisch ein Vorschaubild und eine ansprechende Beschreibung.
4. **Sitemap (`sitemap.xml`) & Robots (`robots.txt`):**
   - Sorgen für ein schnelles und vollständiges Indexieren durch Suchmaschinen-Crawler.
5. **Registrierung in der Google Search Console:**
   - Die Website wurde bereits offiziell in der **Google Search Console** registriert und eingereicht. Damit wird die Indexierung der Domain (`https://drakzittau.de`) bei Google aktiv überwacht und für beste Suchergebnisse optimiert.

---

## 4. Technologie-Stack & Zukunftssicherheit

Die Website wurde mit modernen, branchenführenden Technologien der professionellen Softwareentwicklung realisiert:

| Technologie | Einsatzzweck & Vorteil |
| :--- | :--- |
| **React 19** | Modernste Benutzeroberfläche für flüssige Interaktionen ohne Wartezeiten |
| **TypeScript 5** | Maximale Code-Qualität, Fehlerfreiheit und Wartbarkeit |
| **Vite 6** | Hochleistung-Build-System mit automatischem Cache-Busting (Besucher sehen immer sofort die neueste Version) |
| **Tailwind CSS 4** | Flexibles, modernes Design-System mit exzellenter Performance |
| **Apache `.htaccess`** | Perfektes Single-Page-App-Routing auf Webservern wie Netcup |

---

## 5. Betrieb, Hosting & Pflege

### Ihre Zugangsdaten zum Netcup Kundenportal (CCP)
Wir freuen uns, Sie als Kunden bei netcup begrüßen zu dürfen! Anbei erhalten Sie Ihre Zugangsdaten zum netcup CCP (Customer Control Panel). Sie haben dort die Möglichkeit, Ihre Daten und Produkte zu pflegen sowie vergangene Rechnungen einzusehen.

- **Login-URL:** [https://www.customercontrolpanel.de](https://www.customercontrolpanel.de)
- **Kundennummer:** `384871`
- **Passwort:** `Ds3FU,fZ/amDw93Yz`

> [!IMPORTANT]
> Bitte bewahren Sie diese Zugangsdaten sicher auf, damit Sie jederzeit vollen Zugriff auf Ihre Vertrags- und Domainverwaltung haben.

### Reibungsloser Betrieb bei Netcup
- Die Website erfordert **keine teuren Server oder Datenbank-Wartungen**.
- Der fertig komprimierte Website-Ordner (`dist/`) läuft auf Ihrem Webhosting (Netcup) extrem ressourcenschonend und stabil.
- Vollständige SSL/TLS-Unterstützung (`https://drakzittau.de`) sorgt für Vertrauen und Datensicherheit.

### Wie werden Änderungen vorgenommen?
1. Texte, Speisen oder Preise werden direkt im sauberen Quellcode (`src/`) angepasst.
2. Mit dem Befehl `npm run build` wird eine neue, optimierte Version erzeugt.
3. Die Dateien aus dem Ordner `dist/` werden einfach per FTP (oder automatisch über GitHub Actions) hochgeladen.

---

## 6. Zusammenfassung für Ihre Sicherheit

Mit dieser Website erhalten Sie ein **technisch exzellentes, maßgeschneidertes digitales Aushängeschild** für die Drachen Taverne Zittau:
- ✅ **Optisch beeindruckend:** Ein einzigartiges Mittelalter-Flair, das Gäste begeistert.
- ✅ **Technisch robust:** Höchste Ladegeschwindigkeit, mobiloptimiert und ausfallsicher.
- ✅ **Rechtlich abgesichert:** DSGVO-konforme Struktur inklusive Cookie-Banner und Impressum.
- ✅ **Bereit für die Zukunft:** Einfach erweiterbar und bestens aufgestellt für Google & Gäste.
