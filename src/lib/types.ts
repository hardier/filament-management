export type FilamentCategory = 'PLA' | 'PETG' | 'Other';

export interface FilamentColor {
  id: string;
  name: string;
  hex: string;
  category: FilamentCategory;
  brand: string;
  count: number;
  isCustom?: boolean;
}

export type SortMode = 'color' | 'availability';
