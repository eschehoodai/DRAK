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
