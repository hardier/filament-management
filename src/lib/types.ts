export type FilamentCategory = 'PLA' | 'PETG' | 'Other';

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
