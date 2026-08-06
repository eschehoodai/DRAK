import { useState, useEffect } from 'react';

export interface DayHours {
  isOpen: boolean;
  open: string;
  close: string;
  lastSlot: string;
  label: string;
}

export const OPENING_HOURS: Record<number, DayHours> = {
  0: { isOpen: true, open: '11:00', close: '21:00', lastSlot: '20:30', label: 'So: 11:00–21:00' },
  1: { isOpen: true, open: '17:00', close: '21:00', lastSlot: '20:30', label: 'Mo: 17:00–21:00' },
  2: { isOpen: false, open: '', close: '', lastSlot: '', label: 'Di: Geschlossen' },
  3: { isOpen: true, open: '17:00', close: '21:00', lastSlot: '20:30', label: 'Mi: 17:00–21:00' },
  4: { isOpen: true, open: '17:00', close: '21:00', lastSlot: '20:30', label: 'Do: 17:00–21:00' },
  5: { isOpen: true, open: '17:00', close: '22:00', lastSlot: '21:30', label: 'Fr: 17:00–22:00' },
  6: { isOpen: true, open: '11:00', close: '22:00', lastSlot: '21:30', label: 'Sa: 11:00–22:00' },
};

/**
 * Check if the tavern is currently open for phone calls / visits based on local time.
 */
export function isTavernOpen(date: Date = new Date()): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const config = OPENING_HOURS[dayOfWeek];

  if (!config || !config.isOpen) {
    return false;
  }

  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  
  const [openHour, openMin] = config.open.split(':').map(Number);
  const [closeHour, closeMin] = config.close.split(':').map(Number);

  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
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
