import type { FilamentColor, FilamentSection, FilamentType } from './types';
import { getDefaultFilaments } from './bambu-colors';

const INVENTORY_KEY = 'filament-inventory';

// ── Migration: map old category strings → new section + type ──
const OLD_TO_SECTION: Record<string, FilamentSection> = {
  PLA: 'PLA', 'PLA Basic': 'PLA', 'PLA Matte': 'PLA', 'PLA Silk': 'PLA', 'PLA Sparkle': 'PLA', 'PLA Translucent': 'PLA', 'PLA Luminous': 'PLA',
  PETG: 'PETG', 'PETG Basic': 'PETG', 'PETG HF': 'PETG', 'PETG Translucent': 'PETG', 'PETG-CF': 'PETG', 'PETG Luminous': 'PETG',
  ABS: 'Other', 'ABS-GF': 'Other', ASA: 'Other', 'TPU 95A': 'Other', Other: 'Other',
};

const OLD_TO_TYPE: Record<string, FilamentType> = {
  PLA: 'PLA Basic', 'PLA Basic': 'PLA Basic', 'PLA Matte': 'PLA Matte',
  'PLA Silk': 'PLA Silk', 'PLA Sparkle': 'PLA Sparkle', 'PLA Translucent': 'PLA Translucent', 'PLA Luminous': 'PLA Luminous',
  PETG: 'PETG Basic', 'PETG Basic': 'PETG Basic', 'PETG HF': 'PETG HF',
  'PETG Translucent': 'PETG Translucent', 'PETG-CF': 'PETG-CF', 'PETG Luminous': 'PETG Luminous',
  ABS: 'ABS', 'ABS-GF': 'ABS-GF', ASA: 'ASA', 'TPU 95A': 'TPU 95A', Other: 'Other',
};

function migrate(raw: Record<string, unknown>): FilamentColor {
  const oldCat = (raw.category ?? '') as string;
  const section: FilamentSection = OLD_TO_SECTION[oldCat] ?? (
    oldCat === 'PLA' || oldCat.startsWith('PLA') ? 'PLA' :
    oldCat === 'PETG' || oldCat.startsWith('PETG') ? 'PETG' : 'Other'
  );
  let type: FilamentType = (raw.type as FilamentType) ?? OLD_TO_TYPE[oldCat] ?? 'Other';

  // Auto-correct: any color named "Luminous …" belongs in its section's Luminous type
  const name = (raw.name as string) ?? '';
  if (name.startsWith('Luminous ')) {
    if (section === 'PLA' && type !== 'PLA Luminous') type = 'PLA Luminous';
    if (section === 'PETG' && type !== 'PETG Luminous') type = 'PETG Luminous';
  }

  return {
    id: raw.id as string,
    name: raw.name as string,
    hex: raw.hex as string,
    category: section,
    type,
    brand: (raw.brand as string) ?? 'Bambu Lab',
    count: (raw.count as number) ?? 0,
    status: (raw.status as FilamentColor['status']) ?? 'sealed',
    isCustom: (raw.isCustom as boolean) ?? false,
    ...(raw.imageSrc ? { imageSrc: raw.imageSrc as string } : {}),
  };
}

export function migrateInventory(raw: unknown[]): FilamentColor[] {
  return (raw as Record<string, unknown>[]).map(migrate);
}

// ── Local cache ────────────────────────────────────────────────

export function getLocalInventory(): FilamentColor[] {
  if (typeof window === 'undefined') return getDefaultFilaments();
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return getDefaultFilaments();
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    return parsed.map(migrate);
  } catch {
    return getDefaultFilaments();
  }
}

export function setLocalInventory(inventory: FilamentColor[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}
