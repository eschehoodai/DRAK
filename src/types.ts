/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Screen {
  HOME = 'HOME',
  MENU = 'MENU',
  GALLERY = 'GALLERY',
  IMPRESSUM = 'IMPRESSUM',
  RESERVE = 'RESERVE',
  JOBS = 'JOBS',
  DATENSCHUTZ = 'DATENSCHUTZ',
}

export interface MenuVariant {
  label: string;
  price: string;
}

export interface MenuItem {
  id: string;
  name: string;
  /** Single price. Omit when the dish has multiple `variants` instead. */
  price?: string;
  currency?: 'KUPFER' | 'SILBER' | 'GOLD';
  description?: string;
  type: 'vorspeise' | 'hauptgang' | 'nachspeise' | 'special' | 'getraenk';
  /** Optional price variants (e.g. burger with different meats). */
  variants?: MenuVariant[];
  isSpecial?: boolean;
}

export interface Reservation {
  name: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  vault: string;
  notes?: string;
  id: string;
}

export type JobPosition = 'Servicekraft' | 'Koch/Köchin';

export interface JobApplication {
  id: string;
  position: JobPosition;
  name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  about?: string;
  fileName?: string;
}
