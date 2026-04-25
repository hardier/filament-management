import type { FilamentColor, FilamentCategory } from './types';

const DEFAULT_BRAND = 'Bambu Lab';

interface ColorDef {
  name: string;
  hex: string;
  category: FilamentCategory;
}

const COLOR_DEFS: ColorDef[] = [
  // PLA Basic
  { name: 'White', hex: '#F8F8F8', category: 'PLA' },
  { name: 'Ivory White', hex: '#F5F0E8', category: 'PLA' },
  { name: 'Cream', hex: '#FFFACD', category: 'PLA' },
  { name: 'Beige', hex: '#F2E2C4', category: 'PLA' },
  { name: 'Lemon Yellow', hex: '#FFF44F', category: 'PLA' },
  { name: 'Yellow', hex: '#FFD700', category: 'PLA' },
  { name: 'Gold', hex: '#D4AF37', category: 'PLA' },
  { name: 'Orange', hex: '#FF8C00', category: 'PLA' },
  { name: 'Coral', hex: '#FF6B6B', category: 'PLA' },
  { name: 'Red', hex: '#DC143C', category: 'PLA' },
  { name: 'Dark Red', hex: '#8B0000', category: 'PLA' },
  { name: 'Pink', hex: '#FF69B4', category: 'PLA' },
  { name: 'Magenta', hex: '#C71585', category: 'PLA' },
  { name: 'Purple', hex: '#7B2D8B', category: 'PLA' },
  { name: 'Violet', hex: '#8A2BE2', category: 'PLA' },
  { name: 'Navy', hex: '#001F5B', category: 'PLA' },
  { name: 'Dark Blue', hex: '#00008B', category: 'PLA' },
  { name: 'Blue', hex: '#1E6FCC', category: 'PLA' },
  { name: 'Sky Blue', hex: '#87CEEB', category: 'PLA' },
  { name: 'Cyan', hex: '#00BFFF', category: 'PLA' },
  { name: 'Teal', hex: '#008080', category: 'PLA' },
  { name: 'Jade', hex: '#00A36C', category: 'PLA' },
  { name: 'Bambu Green', hex: '#1DB954', category: 'PLA' },
  { name: 'Green', hex: '#228B22', category: 'PLA' },
  { name: 'Dark Green', hex: '#006400', category: 'PLA' },
  { name: 'Olive', hex: '#808000', category: 'PLA' },
  { name: 'Mint', hex: '#98FF98', category: 'PLA' },
  { name: 'Brown', hex: '#795548', category: 'PLA' },
  { name: 'Dark Brown', hex: '#4E2A04', category: 'PLA' },
  { name: 'Silver', hex: '#C0C0C0', category: 'PLA' },
  { name: 'Light Grey', hex: '#D3D3D3', category: 'PLA' },
  { name: 'Grey', hex: '#808080', category: 'PLA' },
  { name: 'Dark Grey', hex: '#555555', category: 'PLA' },
  { name: 'Charcoal', hex: '#36454F', category: 'PLA' },
  { name: 'Black', hex: '#1A1A1A', category: 'PLA' },

  // PETG
  { name: 'White', hex: '#F8F8F8', category: 'PETG' },
  { name: 'Yellow', hex: '#FFD700', category: 'PETG' },
  { name: 'Orange', hex: '#FF8C00', category: 'PETG' },
  { name: 'Red', hex: '#DC143C', category: 'PETG' },
  { name: 'Pink', hex: '#FF69B4', category: 'PETG' },
  { name: 'Purple', hex: '#7B2D8B', category: 'PETG' },
  { name: 'Blue', hex: '#1E6FCC', category: 'PETG' },
  { name: 'Cyan', hex: '#00BFFF', category: 'PETG' },
  { name: 'Jade', hex: '#00A36C', category: 'PETG' },
  { name: 'Green', hex: '#228B22', category: 'PETG' },
  { name: 'Transparent', hex: '#E8F4F8', category: 'PETG' },
  { name: 'Grey', hex: '#808080', category: 'PETG' },
  { name: 'Black', hex: '#1A1A1A', category: 'PETG' },

  // Other (ABS, ASA, TPU, etc.)
  { name: 'White (ABS)', hex: '#F8F8F8', category: 'Other' },
  { name: 'Black (ABS)', hex: '#1A1A1A', category: 'Other' },
  { name: 'Red (ABS)', hex: '#DC143C', category: 'Other' },
  { name: 'Blue (ABS)', hex: '#1E6FCC', category: 'Other' },
  { name: 'White (TPU)', hex: '#F8F8F8', category: 'Other' },
  { name: 'Black (TPU)', hex: '#1A1A1A', category: 'Other' },
  { name: 'Natural (TPU)', hex: '#F5E6C8', category: 'Other' },
];

export function getDefaultFilaments(): FilamentColor[] {
  return COLOR_DEFS.map((def, i) => ({
    id: `default-${i}`,
    name: def.name,
    hex: def.hex,
    category: def.category,
    brand: DEFAULT_BRAND,
    count: 0,
    isCustom: false,
  }));
}
