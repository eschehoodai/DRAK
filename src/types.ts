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

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  currency: 'KUPFER' | 'SILBER' | 'GOLD';
  description: string;
  type: 'vorspeise' | 'hauptgang' | 'special';
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
