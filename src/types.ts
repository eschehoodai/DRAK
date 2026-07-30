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
  NOT_FOUND = 'NOT_FOUND',
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
  phone?: string;
  email?: string;
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
  about?: string;
}

export interface WochenangebotItem {
  name: string;
  preis: string;
  beschreibung?: string;
}

