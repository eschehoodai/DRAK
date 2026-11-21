import { useState, useEffect } from 'react';

export interface TimeShift {
  open: string;
  close: string;
  kitchenClose?: string;
  lastSlot: string;
  name?: string;
}

export interface DayHours {
  isOpen: boolean;
  shifts: TimeShift[];
  label: string;
  open?: string;
  close?: string;
  kitchenClose?: string;
  lastSlot?: string;
}

export const OPENING_HOURS: Record<number, DayHours> = {
  0: {
    isOpen: true,
    shifts: [
      { open: '11:00', close: '14:00', lastSlot: '13:30', name: 'Mittag' },
      { open: '17:00', close: '21:00', kitchenClose: '20:00', lastSlot: '20:00', name: 'Abend' },
    ],
    label: 'So: 11:00–14:00 & 17:00–21:00',
  },
  1: {
    isOpen: true,
    shifts: [
      { open: '17:00', close: '22:00', kitchenClose: '21:00', lastSlot: '21:00', name: 'Abend' },
    ],
    label: 'Mo: 17:00–22:00',
  },
  2: {
    isOpen: false,
    shifts: [],
    label: 'Di: Geschlossen',
  },
  3: {
    isOpen: true,
    shifts: [
      { open: '17:00', close: '22:00', kitchenClose: '21:00', lastSlot: '21:00', name: 'Abend' },
    ],
    label: 'Mi: 17:00–22:00',
  },
  4: {
    isOpen: true,
    shifts: [
      { open: '17:00', close: '22:00', kitchenClose: '21:00', lastSlot: '21:00', name: 'Abend' },
    ],
    label: 'Do: 17:00–22:00',
  },
  5: {
    isOpen: true,
    shifts: [
      { open: '17:00', close: '22:00', kitchenClose: '21:00', lastSlot: '21:00', name: 'Abend' },
    ],
    label: 'Fr: 17:00–22:00',
  },
  6: {
    isOpen: true,
    shifts: [
      { open: '11:00', close: '14:00', lastSlot: '13:30', name: 'Mittag' },
      { open: '17:00', close: '22:00', kitchenClose: '21:00', lastSlot: '21:00', name: 'Abend' },
    ],
    label: 'Sa: 11:00–14:00 & 17:00–22:00',
  },
};

/**
 * Datumsbezogene Sonderöffnungszeiten (Format: 'YYYY-MM-DD').
 * Überschreiben die regulären Wochentags-Öffnungszeiten für einzelne Tage.
 */
export const SPECIAL_OPENING_HOURS: Record<string, DayHours> = {
  '2026-12-26': {
    isOpen: true,
    shifts: [
      { open: '11:00', close: '15:00', lastSlot: '14:00', name: 'Mittag' },
      { open: '17:00', close: '22:00', kitchenClose: '21:00', lastSlot: '21:00', name: 'Abend' },
    ],
    label: 'Sa (26.12.): 11:00–15:00 & 17:00–22:00',
  },
};

function formatLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gibt die gültige Tageskonfiguration inkl. eventueller Sonderöffnungszeiten zurück.
 */
export function getOpeningHoursForDate(dateOrStr: Date | string): DayHours | undefined {
  if (typeof dateOrStr === 'string') {
    if (!dateOrStr) return undefined;
    if (SPECIAL_OPENING_HOURS[dateOrStr]) {
      return SPECIAL_OPENING_HOURS[dateOrStr];
    }
    const parts = dateOrStr.split('-').map(Number);
    if (parts.length !== 3) return undefined;
    const dayOfWeek = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
    return OPENING_HOURS[dayOfWeek];
  }

  const dateKey = formatLocalDateKey(dateOrStr);
  if (SPECIAL_OPENING_HOURS[dateKey]) {
    return SPECIAL_OPENING_HOURS[dateKey];
  }
  return OPENING_HOURS[dateOrStr.getDay()];
}

/**
 * Check if the tavern is currently open for phone calls / visits based on local time.
 */
export function isTavernOpen(date: Date = new Date()): boolean {
  const config = getOpeningHoursForDate(date);

  if (!config || !config.isOpen || !config.shifts || config.shifts.length === 0) {
    return false;
  }

  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  return config.shifts.some((shift) => {
    const [openHour, openMin] = shift.open.split(':').map(Number);
    const [closeHour, closeMin] = shift.close.split(':').map(Number);

    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  });
}

/**
 * React hook that returns whether the tavern is currently open,
 * updating every 60 seconds.
 */
export function useIsTavernOpen(): boolean {
  const [isOpen, setIsOpen] = useState<boolean>(() => isTavernOpen());

  useEffect(() => {
    const checkStatus = () => {
      setIsOpen(isTavernOpen());
    };

    // Check status immediately
    checkStatus();

    // Re-check every 60 seconds
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return isOpen;
}

export interface TavernStatusInfo {
  isOpen: boolean;
  closingTime?: string;
  nextOpenText?: string;
  statusBadgeText: string;
}

const DAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function getTavernStatusInfo(date: Date = new Date()): TavernStatusInfo {
  const dayOfWeek = date.getDay();
  const config = getOpeningHoursForDate(date);
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  if (config && config.isOpen && config.shifts && config.shifts.length > 0) {
    for (const shift of config.shifts) {
      const [openHour, openMin] = shift.open.split(':').map(Number);
      const [closeHour, closeMin] = shift.close.split(':').map(Number);
      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        return {
          isOpen: true,
          closingTime: shift.close,
          statusBadgeText: `Jetzt geöffnet • bis ${shift.close} Uhr`,
        };
      }

      if (currentMinutes < openMinutes) {
        return {
          isOpen: false,
          nextOpenText: `heute ab ${shift.open} Uhr`,
          statusBadgeText: `Jetzt geschlossen • Öffnet heute ${shift.open} Uhr`,
        };
      }
    }
  }

  // Find next opening day
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
    const nextDay = nextDate.getDay();
    const nextConfig = getOpeningHoursForDate(nextDate);
    if (nextConfig && nextConfig.isOpen && nextConfig.shifts && nextConfig.shifts.length > 0) {
      const nextShift = nextConfig.shifts[0];
      const dayName = i === 1 ? 'morgen' : DAY_NAMES[nextDay];
      return {
        isOpen: false,
        nextOpenText: `${dayName} ab ${nextShift.open} Uhr`,
        statusBadgeText: `Jetzt geschlossen • Öffnet ${dayName} ${nextShift.open} Uhr`,
      };
    }
  }

  return {
    isOpen: false,
    statusBadgeText: 'Jetzt geschlossen',
  };
}

export function useTavernStatus(): TavernStatusInfo {
  const [status, setStatus] = useState<TavernStatusInfo>(() => getTavernStatusInfo());

  useEffect(() => {
    const check = () => setStatus(getTavernStatusInfo());
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
