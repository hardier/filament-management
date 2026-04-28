export type FilamentSection = 'PLA' | 'PETG' | 'Other';

export type FilamentType =
  | 'PLA Basic' | 'PLA Matte' | 'PLA Silk' | 'PLA Sparkle' | 'PLA Translucent' | 'PLA Luminous'
  | 'PETG Basic' | 'PETG Translucent' | 'PETG HF' | 'PETG-CF' | 'PETG Luminous'
  | 'ABS' | 'ABS-GF' | 'ASA' | 'TPU 95A' | 'Other';

export const ALL_SECTIONS: FilamentSection[] = ['PLA', 'PETG', 'Other'];

export const SECTION_TYPES: Record<FilamentSection, FilamentType[]> = {
  PLA:   ['PLA Basic', 'PLA Matte', 'PLA Translucent', 'PLA Silk', 'PLA Sparkle', 'PLA Luminous'],
  PETG:  ['PETG Basic', 'PETG Translucent', 'PETG HF', 'PETG-CF', 'PETG Luminous'],
  Other: ['ABS', 'ABS-GF', 'ASA', 'TPU 95A', 'Other'],
};

export type FilamentStatus = 'sealed' | 'high' | 'medium' | 'low';
export const STATUS_CYCLE: FilamentStatus[] = ['sealed', 'high', 'medium', 'low'];

export interface FilamentColor {
  id: string;
  name: string;
  hex: string;
  /** Brand's own color code, e.g. "RB001", "PA02001" */
  code?: string;
  /** Top-level section (was called category in older data) */
  category: FilamentSection;
  /** Sub-type within the section */
  type: FilamentType;
  brand: string;
  count: number;
  status: FilamentStatus;
  isCustom?: boolean;
  /** Base64 data URL for a photo thumbnail (custom colors) */
  imageSrc?: string;
}

export type SortMode = 'color' | 'availability';
export type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
