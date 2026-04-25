export type FilamentCategory =
  | 'PLA Basic'
  | 'PLA Matte'
  | 'PLA Silk'
  | 'PETG Basic'
  | 'PETG HF'
  | 'ABS'
  | 'ASA'
  | 'TPU 95A'
  | 'Other';

export const ALL_CATEGORIES: FilamentCategory[] = [
  'PLA Basic',
  'PLA Matte',
  'PLA Silk',
  'PETG Basic',
  'PETG HF',
  'ABS',
  'ASA',
  'TPU 95A',
  'Other',
];

export type FilamentStatus = 'sealed' | 'high' | 'medium' | 'low';

export interface FilamentColor {
  id: string;
  name: string;
  hex: string;
  category: FilamentCategory;
  brand: string;
  count: number;
  status: FilamentStatus;
  isCustom?: boolean;
}

export type SortMode = 'color' | 'availability';

export const STATUS_CYCLE: FilamentStatus[] = ['sealed', 'high', 'medium', 'low'];

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
