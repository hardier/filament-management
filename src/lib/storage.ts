import type { FilamentColor, FilamentCategory } from './types';
import { getDefaultFilaments } from './bambu-colors';

const INVENTORY_KEY = 'filament-inventory';

// ── Category migration for data saved with old category names ──
const CATEGORY_MIGRATION: Record<string, FilamentCategory> = {
  PLA: 'PLA Basic',
  PETG: 'PETG Basic',
};

function migrateRecord(f: FilamentColor): FilamentColor {
  return {
    ...f,
    category: (CATEGORY_MIGRATION[f.category as string] ?? f.category) as FilamentCategory,
    status: f.status ?? 'sealed',
  };
}

// ── Local cache ────────────────────────────────────────────────

export function getLocalInventory(): FilamentColor[] {
  if (typeof window === 'undefined') return getDefaultFilaments();
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return getDefaultFilaments();
    const parsed = JSON.parse(raw) as FilamentColor[];
    return parsed.map(migrateRecord);
  } catch {
    return getDefaultFilaments();
  }
}

export function setLocalInventory(inventory: FilamentColor[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}
