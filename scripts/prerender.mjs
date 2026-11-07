#!/usr/bin/env node

/**
 * Prerender Script for Drachen Taverne Zittau
 * 
 * Generates static HTML files for each route after `vite build`
 * so search engine crawlers (especially Googlebot) receive the exact
 * <title>, <meta description>, canonical link, OpenGraph tags, and
 * Schema.org structured data directly without waiting for JavaScript execution.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

const BASE_URL = 'https://drakzittau.de';

const ROUTES = [
  {
    path: '/',
    title: 'Mittelalter-Restaurant & Taverne in Zittau | Drachen Taverne',
    description:
      'Erlebe die Drachen Taverne in Zittau: Deftige Speisen, süffiger Met und authentische Tavernenatmosphäre im historischen Gewölbe. Jetzt Tisch reservieren!',
    canonical: `${BASE_URL}/`,
    ogType: 'restaurant',
    ogTitle: 'Drachen Taverne – Mittelalter-Restaurant in Zittau',
    ogDescription:
      'Deftige Speisen, Met und Tavernenatmosphäre im historischen Gewölbe von Zittau. Jetzt Tisch reservieren.',
  },
  {
    path: '/speisekarte',
    title: 'Speisekarte & Deftige Tavernenküche | Drachen Taverne Zittau',
    description:
      'Die Speisekarte der Drachen Taverne Zittau: Herzhafte Pfannen, saftiger Braten, vegetarische Gaumenfreuden, Met und Biere wie anno dazumal genießen.',
    canonical: `${BASE_URL}/speisekarte`,
    ogType: 'restaurant',
    ogTitle: 'Speisekarte & Tavernenkost – Drachen Taverne Zittau',
    ogDescription:
      'Entdecke unsere Speisekarte mit deftigen Hauptgängen, Vorspeisen, Met, Bier und Cocktails im mittelalterlichen Ambiente.',
  },
  {
    path: '/reservierung',
    title: 'Tisch online reservieren | Drachen Taverne Zittau',
    description:
      'Reserviert Euren Tisch in der Drachen Taverne Zittau bequem online. Genießt unvergessliche Abende im historischen Kreuzgewölbe oder im Biergarten.',
    canonical: `${BASE_URL}/reservierung`,
    ogType: 'restaurant',
    ogTitle: 'Tisch reservieren – Drachen Taverne Zittau',
    ogDescription:
      'Reserviert Euren Tisch in der Drachen Taverne Zittau online für das historische Gewölbe oder den Biergarten.',
  },
  {
    path: '/galerie',
    title: 'Galerie & Gewölbe-Impressionen | Drachen Taverne Zittau',
    description:
      'Fotogalerie der Drachen Taverne Zittau: Entdeckt urige Tavernenräume, stimmungsvolle Dekorationen, mittelalterliche Feste und historische Gewölbe.',
    canonical: `${BASE_URL}/galerie`,
    ogType: 'website',
    ogTitle: 'Galerie & Impressionen – Drachen Taverne Zittau',
    ogDescription:
      'Bilder und Videos aus der Drachen Taverne Zittau: Gastraum, historisches Gewölbe, Dekoration und Veranstaltungen.',
  },
  {
    path: '/jobs',
    title: 'Jobs & Tavernen-Zunft Karriere | Drachen Taverne Zittau',
    description:
      'Werde Teil unserer Tavernen-Zunft! Aktuelle Stellenangebote für Servicekräfte, Küchenhilfen und Köche in der Drachen Taverne Zittau. Jetzt bewerben.',
    canonical: `${BASE_URL}/jobs`,
    ogType: 'website',
    ogTitle: 'Karriere & Jobs – Drachen Taverne Zittau',
    ogDescription:
      'Offene Stellen in der Drachen Taverne Zittau: Werdet Teil unserer Tavernen-Zunft in Service und Küche.',
  },
  {
    path: '/impressum',
    title: 'Impressum & Kontakt | Drachen Taverne Zittau',
    description:
      'Impressum und rechtliche Anbieterkennzeichnung der Drachen Taverne in Zittau: Kontaktdaten, Anschrift, Vertretungsberechtigte und rechtliche Angaben.',
    canonical: `${BASE_URL}/impressum`,
    ogType: 'website',
    ogTitle: 'Impressum – Drachen Taverne Zittau',
    ogDescription:
      'Impressum und Anbieterkennzeichnung der Drachen Taverne Zittau gemäß § 5 TMG.',
  },
  {
    path: '/datenschutz',
    title: 'Datenschutzerklärung & DSGVO | Drachen Taverne Zittau',
    description:
      'Datenschutzerklärung der Drachen Taverne Zittau: Detaillierte Informationen über die Erhebung, Verarbeitung und Nutzung personenbezogener Daten nach DSGVO.',
    canonical: `${BASE_URL}/datenschutz`,
    ogType: 'website',
    ogTitle: 'Datenschutzerklärung – Drachen Taverne Zittau',
    ogDescription:
      'Datenschutzerklärung der Drachen Taverne Zittau nach Vorgaben der DSGVO.',
  },
  {
    path: '/404',
    title: 'Seite nicht gefunden (404) | Drachen Taverne Zittau',
    description:
      'Die gesuchte Seite der Drachen Taverne Zittau konnte leider nicht gefunden werden. Kehre hier zurück zu unserer Startseite oder zur Speisekarte.',
    canonical: `${BASE_URL}/404`,
    ogType: 'website',
    ogTitle: '404 - Seite nicht gefunden – Drachen Taverne Zittau',
    ogDescription: 'Diese Seite existiert nicht. Zurück zur Drachen Taverne Zittau.',
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function prerenderRoute(templateHtml, route) {
  let html = templateHtml;

  // 1. Title
  html = html.replace(
    /<title>.*?<\/title>/is,
    `<title>${escapeHtml(route.title)}</title>`
  );

  // 2. Meta description
  if (html.includes('name="description"')) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeAttr(route.description)}" />`
    );
  }

  // 3. Canonical link
  if (html.includes('rel="canonical"')) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${route.canonical}" />`
    );
  }

  // 4. OpenGraph tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(route.ogTitle || route.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(route.ogDescription || route.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${route.ogType}" />`
  );

  // 5. Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(route.ogTitle || route.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(route.ogDescription || route.description)}" />`
  );

  return html;
}

function run() {
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`[prerender] Error: Template file not found: ${indexHtmlPath}`);
    console.error('[prerender] Please run "vite build" before running prerender.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(indexHtmlPath, 'utf8');
  console.log('[prerender] Starting static HTML generation for all routes...');

  let generatedCount = 0;

  for (const route of ROUTES) {
    const rendered = prerenderRoute(baseTemplate, route);

    let targetFile;
    if (route.path === '/') {
      targetFile = indexHtmlPath;
    } else if (route.path === '/404') {
      targetFile = path.join(distDir, '404.html');
    } else {
      const cleanSubDir = route.path.replace(/^\/+/, '');
      const routeDir = path.join(distDir, cleanSubDir);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      targetFile = path.join(routeDir, 'index.html');
    }

    fs.writeFileSync(targetFile, rendered, 'utf8');
    console.log(`[prerender]  ✓ ${route.path.padEnd(16)} -> ${path.relative(distDir, targetFile)}`);
    generatedCount++;
  }

  console.log(`[prerender] Finished! Generated ${generatedCount} static pages with SEO & Sitelink tags.`);
}

run();

