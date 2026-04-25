import type { FilamentColor, FilamentSection, FilamentType } from './types';

const DEFAULT_BRAND = 'Bambu Lab';

export const KNOWN_COLOR_NAMES = [
  'White', 'Ivory White', 'Cream', 'Beige',
  'Lemon Yellow', 'Yellow', 'Gold', 'Orange', 'Coral',
  'Red', 'Dark Red', 'Pink', 'Magenta',
  'Purple', 'Violet',
  'Navy', 'Dark Blue', 'Blue', 'Sky Blue', 'Cyan',
  'Teal', 'Jade', 'Bambu Green', 'Green', 'Dark Green', 'Olive', 'Mint',
  'Brown', 'Dark Brown',
  'Silver', 'Copper', 'Bronze', 'Rose Gold',
  'Light Grey', 'Grey', 'Dark Grey', 'Charcoal', 'Black',
  'Transparent', 'Natural',
];

interface ColorDef {
  name: string;
  hex: string;
  category: FilamentSection;
  type: FilamentType;
}

const COLOR_DEFS: ColorDef[] = [
  // ── PLA Basic ─────────────────────────────────────────────────
  { name: 'White',        hex: '#F8F8F8', category: 'PLA', type: 'PLA Basic' },
  { name: 'Ivory White',  hex: '#F5F0E8', category: 'PLA', type: 'PLA Basic' },
  { name: 'Cream',        hex: '#FFFACD', category: 'PLA', type: 'PLA Basic' },
  { name: 'Beige',        hex: '#F2E2C4', category: 'PLA', type: 'PLA Basic' },
  { name: 'Lemon Yellow', hex: '#FFF44F', category: 'PLA', type: 'PLA Basic' },
  { name: 'Yellow',       hex: '#FFD700', category: 'PLA', type: 'PLA Basic' },
  { name: 'Gold',         hex: '#D4AF37', category: 'PLA', type: 'PLA Basic' },
  { name: 'Orange',       hex: '#FF8C00', category: 'PLA', type: 'PLA Basic' },
  { name: 'Coral',        hex: '#FF6B6B', category: 'PLA', type: 'PLA Basic' },
  { name: 'Red',          hex: '#DC143C', category: 'PLA', type: 'PLA Basic' },
  { name: 'Dark Red',     hex: '#8B0000', category: 'PLA', type: 'PLA Basic' },
  { name: 'Pink',         hex: '#FF69B4', category: 'PLA', type: 'PLA Basic' },
  { name: 'Magenta',      hex: '#C71585', category: 'PLA', type: 'PLA Basic' },
  { name: 'Purple',       hex: '#7B2D8B', category: 'PLA', type: 'PLA Basic' },
  { name: 'Violet',       hex: '#8A2BE2', category: 'PLA', type: 'PLA Basic' },
  { name: 'Navy',         hex: '#001F5B', category: 'PLA', type: 'PLA Basic' },
  { name: 'Dark Blue',    hex: '#00008B', category: 'PLA', type: 'PLA Basic' },
  { name: 'Blue',         hex: '#1E6FCC', category: 'PLA', type: 'PLA Basic' },
  { name: 'Sky Blue',     hex: '#87CEEB', category: 'PLA', type: 'PLA Basic' },
  { name: 'Cyan',         hex: '#00BFFF', category: 'PLA', type: 'PLA Basic' },
  { name: 'Teal',         hex: '#008080', category: 'PLA', type: 'PLA Basic' },
  { name: 'Jade',         hex: '#00A36C', category: 'PLA', type: 'PLA Basic' },
  { name: 'Bambu Green',  hex: '#1DB954', category: 'PLA', type: 'PLA Basic' },
  { name: 'Green',        hex: '#228B22', category: 'PLA', type: 'PLA Basic' },
  { name: 'Dark Green',   hex: '#006400', category: 'PLA', type: 'PLA Basic' },
  { name: 'Olive',        hex: '#808000', category: 'PLA', type: 'PLA Basic' },
  { name: 'Mint',         hex: '#98FF98', category: 'PLA', type: 'PLA Basic' },
  { name: 'Brown',        hex: '#795548', category: 'PLA', type: 'PLA Basic' },
  { name: 'Dark Brown',   hex: '#4E2A04', category: 'PLA', type: 'PLA Basic' },
  { name: 'Silver',       hex: '#C0C0C0', category: 'PLA', type: 'PLA Basic' },
  { name: 'Light Grey',   hex: '#D3D3D3', category: 'PLA', type: 'PLA Basic' },
  { name: 'Grey',         hex: '#808080', category: 'PLA', type: 'PLA Basic' },
  { name: 'Dark Grey',    hex: '#555555', category: 'PLA', type: 'PLA Basic' },
  { name: 'Charcoal',     hex: '#36454F', category: 'PLA', type: 'PLA Basic' },
  { name: 'Black',        hex: '#1A1A1A', category: 'PLA', type: 'PLA Basic' },

  // ── PLA Matte ─────────────────────────────────────────────────
  { name: 'White',        hex: '#F2F0EC', category: 'PLA', type: 'PLA Matte' },
  { name: 'Ivory White',  hex: '#EDE8DE', category: 'PLA', type: 'PLA Matte' },
  { name: 'Beige',        hex: '#E8D8B8', category: 'PLA', type: 'PLA Matte' },
  { name: 'Lemon Yellow', hex: '#F0E860', category: 'PLA', type: 'PLA Matte' },
  { name: 'Yellow',       hex: '#E8C800', category: 'PLA', type: 'PLA Matte' },
  { name: 'Orange',       hex: '#E07800', category: 'PLA', type: 'PLA Matte' },
  { name: 'Coral',        hex: '#E05858', category: 'PLA', type: 'PLA Matte' },
  { name: 'Red',          hex: '#C01030', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Red',     hex: '#780010', category: 'PLA', type: 'PLA Matte' },
  { name: 'Pink',         hex: '#E05890', category: 'PLA', type: 'PLA Matte' },
  { name: 'Magenta',      hex: '#A80060', category: 'PLA', type: 'PLA Matte' },
  { name: 'Purple',       hex: '#602070', category: 'PLA', type: 'PLA Matte' },
  { name: 'Navy',         hex: '#101840', category: 'PLA', type: 'PLA Matte' },
  { name: 'Blue',         hex: '#1858A8', category: 'PLA', type: 'PLA Matte' },
  { name: 'Sky Blue',     hex: '#6898C0', category: 'PLA', type: 'PLA Matte' },
  { name: 'Cyan',         hex: '#00A0C0', category: 'PLA', type: 'PLA Matte' },
  { name: 'Teal',         hex: '#006060', category: 'PLA', type: 'PLA Matte' },
  { name: 'Jade',         hex: '#008858', category: 'PLA', type: 'PLA Matte' },
  { name: 'Green',        hex: '#187018', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Green',   hex: '#005000', category: 'PLA', type: 'PLA Matte' },
  { name: 'Olive',        hex: '#606000', category: 'PLA', type: 'PLA Matte' },
  { name: 'Brown',        hex: '#604030', category: 'PLA', type: 'PLA Matte' },
  { name: 'Light Grey',   hex: '#C0BEB8', category: 'PLA', type: 'PLA Matte' },
  { name: 'Grey',         hex: '#707068', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Grey',    hex: '#404038', category: 'PLA', type: 'PLA Matte' },
  { name: 'Charcoal',     hex: '#282828', category: 'PLA', type: 'PLA Matte' },
  { name: 'Black',        hex: '#141414', category: 'PLA', type: 'PLA Matte' },

  // ── PLA Silk ──────────────────────────────────────────────────
  { name: 'Gold',      hex: '#D4A017', category: 'PLA', type: 'PLA Silk' },
  { name: 'Silver',    hex: '#C8CDD2', category: 'PLA', type: 'PLA Silk' },
  { name: 'Copper',    hex: '#B87333', category: 'PLA', type: 'PLA Silk' },
  { name: 'Bronze',    hex: '#8C6A30', category: 'PLA', type: 'PLA Silk' },
  { name: 'Rose Gold', hex: '#C9897A', category: 'PLA', type: 'PLA Silk' },
  { name: 'White',     hex: '#EEF0F4', category: 'PLA', type: 'PLA Silk' },
  { name: 'Black',     hex: '#2A2A2E', category: 'PLA', type: 'PLA Silk' },
  { name: 'Red',       hex: '#CC2030', category: 'PLA', type: 'PLA Silk' },
  { name: 'Pink',      hex: '#E06080', category: 'PLA', type: 'PLA Silk' },
  { name: 'Purple',    hex: '#7030A0', category: 'PLA', type: 'PLA Silk' },
  { name: 'Blue',      hex: '#2050CC', category: 'PLA', type: 'PLA Silk' },
  { name: 'Cyan',      hex: '#00A8C8', category: 'PLA', type: 'PLA Silk' },
  { name: 'Green',     hex: '#20A040', category: 'PLA', type: 'PLA Silk' },
  { name: 'Orange',    hex: '#E07010', category: 'PLA', type: 'PLA Silk' },

  // ── PETG Basic ────────────────────────────────────────────────
  { name: 'White',       hex: '#F8F8F8', category: 'PETG', type: 'PETG Basic' },
  { name: 'Yellow',      hex: '#FFD700', category: 'PETG', type: 'PETG Basic' },
  { name: 'Orange',      hex: '#FF8C00', category: 'PETG', type: 'PETG Basic' },
  { name: 'Red',         hex: '#DC143C', category: 'PETG', type: 'PETG Basic' },
  { name: 'Pink',        hex: '#FF69B4', category: 'PETG', type: 'PETG Basic' },
  { name: 'Purple',      hex: '#7B2D8B', category: 'PETG', type: 'PETG Basic' },
  { name: 'Blue',        hex: '#1E6FCC', category: 'PETG', type: 'PETG Basic' },
  { name: 'Cyan',        hex: '#00BFFF', category: 'PETG', type: 'PETG Basic' },
  { name: 'Jade',        hex: '#00A36C', category: 'PETG', type: 'PETG Basic' },
  { name: 'Green',       hex: '#228B22', category: 'PETG', type: 'PETG Basic' },
  { name: 'Grey',        hex: '#808080', category: 'PETG', type: 'PETG Basic' },
  { name: 'Black',       hex: '#1A1A1A', category: 'PETG', type: 'PETG Basic' },

  // ── PETG Translucent ─────────────────────────────────────────
  { name: 'Clear',           hex: '#EEF5FA', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Red', hex: '#FF6060', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Blue',hex: '#60A0FF', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Green',hex:'#60D080', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Yellow',hex:'#F8E060',category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Orange',hex:'#FFA050',category: 'PETG', type: 'PETG Translucent' },

  // ── PETG HF ───────────────────────────────────────────────────
  { name: 'White',  hex: '#F8F8F8', category: 'PETG', type: 'PETG HF' },
  { name: 'Yellow', hex: '#FFD700', category: 'PETG', type: 'PETG HF' },
  { name: 'Orange', hex: '#FF8C00', category: 'PETG', type: 'PETG HF' },
  { name: 'Red',    hex: '#DC143C', category: 'PETG', type: 'PETG HF' },
  { name: 'Blue',   hex: '#1E6FCC', category: 'PETG', type: 'PETG HF' },
  { name: 'Cyan',   hex: '#00BFFF', category: 'PETG', type: 'PETG HF' },
  { name: 'Green',  hex: '#228B22', category: 'PETG', type: 'PETG HF' },
  { name: 'Grey',   hex: '#808080', category: 'PETG', type: 'PETG HF' },
  { name: 'Black',  hex: '#1A1A1A', category: 'PETG', type: 'PETG HF' },

  // ── ABS ───────────────────────────────────────────────────────
  { name: 'White',     hex: '#F5F5F0', category: 'Other', type: 'ABS' },
  { name: 'Beige',     hex: '#E8D8B0', category: 'Other', type: 'ABS' },
  { name: 'Yellow',    hex: '#F0C800', category: 'Other', type: 'ABS' },
  { name: 'Orange',    hex: '#D87000', category: 'Other', type: 'ABS' },
  { name: 'Red',       hex: '#C01028', category: 'Other', type: 'ABS' },
  { name: 'Blue',      hex: '#1850A0', category: 'Other', type: 'ABS' },
  { name: 'Green',     hex: '#187018', category: 'Other', type: 'ABS' },
  { name: 'Grey',      hex: '#787870', category: 'Other', type: 'ABS' },
  { name: 'Dark Grey', hex: '#484840', category: 'Other', type: 'ABS' },
  { name: 'Black',     hex: '#1A1A1A', category: 'Other', type: 'ABS' },

  // ── ASA ───────────────────────────────────────────────────────
  { name: 'White',  hex: '#F2F0EC', category: 'Other', type: 'ASA' },
  { name: 'Yellow', hex: '#E8C000', category: 'Other', type: 'ASA' },
  { name: 'Orange', hex: '#D06800', category: 'Other', type: 'ASA' },
  { name: 'Red',    hex: '#B80C20', category: 'Other', type: 'ASA' },
  { name: 'Blue',   hex: '#104890', category: 'Other', type: 'ASA' },
  { name: 'Green',  hex: '#106010', category: 'Other', type: 'ASA' },
  { name: 'Grey',   hex: '#707068', category: 'Other', type: 'ASA' },
  { name: 'Black',  hex: '#141414', category: 'Other', type: 'ASA' },

  // ── TPU 95A ───────────────────────────────────────────────────
  { name: 'White',       hex: '#F8F8F4', category: 'Other', type: 'TPU 95A' },
  { name: 'Natural',     hex: '#F0E8D0', category: 'Other', type: 'TPU 95A' },
  { name: 'Yellow',      hex: '#F8D800', category: 'Other', type: 'TPU 95A' },
  { name: 'Orange',      hex: '#F07800', category: 'Other', type: 'TPU 95A' },
  { name: 'Red',         hex: '#D01030', category: 'Other', type: 'TPU 95A' },
  { name: 'Pink',        hex: '#E06898', category: 'Other', type: 'TPU 95A' },
  { name: 'Blue',        hex: '#1868C0', category: 'Other', type: 'TPU 95A' },
  { name: 'Cyan',        hex: '#00B0D0', category: 'Other', type: 'TPU 95A' },
  { name: 'Green',       hex: '#20A030', category: 'Other', type: 'TPU 95A' },
  { name: 'Grey',        hex: '#909088', category: 'Other', type: 'TPU 95A' },
  { name: 'Black',       hex: '#181818', category: 'Other', type: 'TPU 95A' },
  { name: 'Transparent', hex: '#E4EEF4', category: 'Other', type: 'TPU 95A' },

  // ── Other ─────────────────────────────────────────────────────
  { name: 'White (PA)',  hex: '#F0EEE8', category: 'Other', type: 'Other' },
  { name: 'Black (PA)',  hex: '#1A1A1A', category: 'Other', type: 'Other' },
  { name: 'White (PC)',  hex: '#F5F4F0', category: 'Other', type: 'Other' },
  { name: 'Black (PC)',  hex: '#1A1A1A', category: 'Other', type: 'Other' },
  { name: 'PVA',         hex: '#F5EDD8', category: 'Other', type: 'Other' },
  { name: 'HIPS',        hex: '#EEDDB8', category: 'Other', type: 'Other' },
];

export function getDefaultFilaments(): FilamentColor[] {
  return COLOR_DEFS.map((def, i) => ({
    id: `default-${i}`,
    name: def.name,
    hex: def.hex,
    category: def.category,
    type: def.type,
    brand: DEFAULT_BRAND,
    count: 0,
    status: 'sealed' as const,
    isCustom: false,
  }));
}
