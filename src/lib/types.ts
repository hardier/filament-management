export type FilamentSection = 'PLA' | 'PETG' | 'Other';

export type FilamentType =
  | 'PLA Basic' | 'PLA Matte' | 'PLA Silk' | 'PLA Sparkle'
  | 'PETG Basic' | 'PETG Translucent' | 'PETG HF' | 'PETG-CF'
  | 'ABS' | 'ASA' | 'TPU 95A' | 'Other';

export const ALL_SECTIONS: FilamentSection[] = ['PLA', 'PETG', 'Other'];

export const SECTION_TYPES: Record<FilamentSection, FilamentType[]> = {
  PLA:   ['PLA Basic', 'PLA Matte', 'PLA Silk', 'PLA Sparkle'],
  PETG:  ['PETG Basic', 'PETG Translucent', 'PETG HF', 'PETG-CF'],
  Other: ['ABS', 'ASA', 'TPU 95A', 'Other'],
};

export type FilamentStatus = 'sealed' | 'high' | 'medium' | 'low';
export const STATUS_CYCLE: FilamentStatus[] = ['sealed', 'high', 'medium', 'low'];

export interface FilamentColor {
  id: string;
  name: string;
  hex: string;
  /** Top-level section (was called category in older data) */
  category: FilamentSection;
  /** Sub-type within the section */
  type: FilamentType;
  brand: string;
  count: number;
  status: FilamentStatus;
  isCustom?: boolean;
}

export type SortMode = 'color' | 'availability';
export type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
