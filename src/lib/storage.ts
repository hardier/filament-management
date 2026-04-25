import type { FilamentColor } from './types';
import { getDefaultFilaments } from './bambu-colors';

const STORAGE_KEY = 'filament-inventory';

export function loadInventory(): FilamentColor[] {
  if (typeof window === 'undefined') return getDefaultFilaments();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultFilaments();
    return JSON.parse(raw) as FilamentColor[];
  } catch {
    return getDefaultFilaments();
  }
}

export function saveInventory(inventory: FilamentColor[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}
