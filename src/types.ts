/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Screen {
  HOME = 'HOME',
  MENU = 'MENU',
  IMPRESSUM = 'IMPRESSUM',
  RESERVE = 'RESERVE',
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
  description: string;
  type: 'vorspeise' | 'hauptgang' | 'nachspeise' | 'special';
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
