import type { FilamentColor, FilamentCategory } from './types';
import { getDefaultFilaments } from './bambu-colors';

const SYNC_ID_KEY = 'filament-sync-id';
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

// ── Sync ID ────────────────────────────────────────────────────

export function getSyncId(): string {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(SYNC_ID_KEY);
  if (existing) return existing;
  const newId = crypto.randomUUID();
  localStorage.setItem(SYNC_ID_KEY, newId);
  return newId;
}

export function setSyncId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SYNC_ID_KEY, id.trim());
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
