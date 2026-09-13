/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AllergenInfo {
  code: string;
  name: string;
  shortName: string;
  description: string;
}

export const ALLERGENS_LIST: AllergenInfo[] = [
  {
    code: 'A',
    name: 'Glutenhaltiges Getreide',
    shortName: 'Gluten',
    description: 'Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut oder Hybridstämme davon',
  },
  {
    code: 'B',
    name: 'Krebstiere & Krebstiererzeugnisse',
    shortName: 'Krebstiere',
    description: 'Krebse, Garnelen, Krabben, Hummer, Scampi etc.',
  },
  {
    code: 'C',
    name: 'Eier & Eierzeugnisse',
    shortName: 'Eier',
    description: 'Hühnerei und Eier von anderem Geflügel, Panaden, Mayonnaise',
  },
  {
    code: 'D',
    name: 'Fisch & Fischerzeugnisse',
    shortName: 'Fisch',
    description: 'Alle Fischarten, Kaviar und daraus gewonnene Erzeugnisse',
  },
  {
    code: 'E',
    name: 'Erdnüsse & Erdnusserzeugnisse',
    shortName: 'Erdnüsse',
    description: 'Erdnüsse, Erdnussöl, Erdnussbutter',
  },
  {
    code: 'F',
    name: 'Sojabohnen & Sojaerzeugnisse',
    shortName: 'Soja',
    description: 'Sojabohnen, Sojasauce, Tofu, Sojalecithin',
  },
  {
    code: 'G',
    name: 'Milch & Milcherzeugnisse (inkl. Laktose)',
    shortName: 'Milch / Laktose',
    description: 'Kuh-, Schafs-, Ziegenmilch, Butter, Käse, Sahne, Joghurt',
  },
  {
    code: 'H',
    name: 'Schalenfrüchte (Nüsse)',
    shortName: 'Schalenfrüchte',
    description: 'Mandeln, Haselnüsse, Walnüsse, Cashewnüsse, Pecannüsse, Paranüsse, Pistazien, Macadamianüsse',
  },
  {
    code: 'I',
    name: 'Sellerie & Sellerieerzeugnisse',
    shortName: 'Sellerie',
    description: 'Knollen- und Staudensellerie, Gewürzmischungen, Brühen',
  },
  {
    code: 'J',
    name: 'Senf & Senferzeugnisse',
    shortName: 'Senf',
    description: 'Senfkörner, Senfpulver, Tafelsenf, Dressings',
  },
  {
    code: 'K',
    name: 'Sesamsamen & Sesamerzeugnisse',
    shortName: 'Sesam',
    description: 'Sesamsaat, Sesamöl, Tahin',
  },
  {
    code: 'L',
    name: 'Schwefeldioxid & Sulfite',
    shortName: 'Sulfite',
    description: 'Konzentrationen von mehr als 10 mg/kg oder 10 mg/l (z. B. in Weinen, Trockenobst)',
  },
  {
    code: 'M',
    name: 'Lupinen & Lupinenerzeugnisse',
    shortName: 'Lupinen',
    description: 'Lupinenmehl in Back- und Teigwaren',
  },
  {
    code: 'N',
    name: 'Weichtiere & Weichtiererzeugnisse',
    shortName: 'Weichtiere',
    description: 'Schnecken, Muscheln, Tintenfische, Oktopus, Calamari',
  },
];

export const ALLERGENS_MAP: Record<string, AllergenInfo> = ALLERGENS_LIST.reduce(
  (acc, item) => {
    acc[item.code] = item;
    return acc;
  },
  {} as Record<string, AllergenInfo>,
);

export function getAllergensFromCodes(codes?: string[]): AllergenInfo[] {
  if (!codes || !Array.isArray(codes)) return [];
  return codes
    .map((code) => ALLERGENS_MAP[code.toUpperCase()])
    .filter((info): info is AllergenInfo => Boolean(info));
}
