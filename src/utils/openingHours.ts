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
 * Check if the tavern is currently open for phone calls / visits based on local time.
 */
export function isTavernOpen(date: Date = new Date()): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const config = OPENING_HOURS[dayOfWeek];

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
  const config = OPENING_HOURS[dayOfWeek];
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
    const nextDay = (dayOfWeek + i) % 7;
    const nextConfig = OPENING_HOURS[nextDay];
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
