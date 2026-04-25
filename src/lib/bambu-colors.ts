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
  { name: 'Jade White',       hex: '#ffffff', category: 'PLA', type: 'PLA Basic' },
  { name: 'Beige',            hex: '#f7e6de', category: 'PLA', type: 'PLA Basic' },
  { name: 'Light Gray',       hex: '#d1d3d5', category: 'PLA', type: 'PLA Basic' },
  { name: 'Yellow',           hex: '#f4ee2a', category: 'PLA', type: 'PLA Basic' },
  { name: 'Sunflower Yellow', hex: '#fec601', category: 'PLA', type: 'PLA Basic' },
  { name: 'Gold',             hex: '#e4bd68', category: 'PLA', type: 'PLA Basic' },
  { name: 'Pumpkin Orange',   hex: '#ff8e16', category: 'PLA', type: 'PLA Basic' },
  { name: 'Orange',           hex: '#ff6a13', category: 'PLA', type: 'PLA Basic' },
  { name: 'Bright Green',     hex: '#bdcf00', category: 'PLA', type: 'PLA Basic' },
  { name: 'Bambu Green',      hex: '#16c344', category: 'PLA', type: 'PLA Basic' },
  { name: 'Mistletoe Green',  hex: '#3f8e43', category: 'PLA', type: 'PLA Basic' },
  { name: 'Pink',             hex: '#f55a74', category: 'PLA', type: 'PLA Basic' },
  { name: 'Hot Pink',         hex: '#f5547d', category: 'PLA', type: 'PLA Basic' },
  { name: 'Magenta',          hex: '#ec008c', category: 'PLA', type: 'PLA Basic' },
  { name: 'Red',              hex: '#c12e1f', category: 'PLA', type: 'PLA Basic' },
  { name: 'Maroon Red',       hex: '#9d2236', category: 'PLA', type: 'PLA Basic' },
  { name: 'Purple',           hex: '#5e43b7', category: 'PLA', type: 'PLA Basic' },
  { name: 'Indigo Purple',    hex: '#482a60', category: 'PLA', type: 'PLA Basic' },
  { name: 'Turquoise',        hex: '#00b1b7', category: 'PLA', type: 'PLA Basic' },
  { name: 'Cyan',             hex: '#0086d6', category: 'PLA', type: 'PLA Basic' },
  { name: 'Cobalt Blue',      hex: '#0055b8', category: 'PLA', type: 'PLA Basic' },
  { name: 'Blue',             hex: '#0a2989', category: 'PLA', type: 'PLA Basic' },
  { name: 'Brown',            hex: '#9d432c', category: 'PLA', type: 'PLA Basic' },
  { name: 'Cocoa Brown',      hex: '#6f5034', category: 'PLA', type: 'PLA Basic' },
  { name: 'Bronze',           hex: '#847d48', category: 'PLA', type: 'PLA Basic' },
  { name: 'Gray',             hex: '#8e9089', category: 'PLA', type: 'PLA Basic' },
  { name: 'Silver',           hex: '#a6a9aa', category: 'PLA', type: 'PLA Basic' },
  { name: 'Blue Grey',        hex: '#5b6579', category: 'PLA', type: 'PLA Basic' },
  { name: 'Dark Gray',        hex: '#545454', category: 'PLA', type: 'PLA Basic' },
  { name: 'Black',            hex: '#000000', category: 'PLA', type: 'PLA Basic' },

  // ── PLA Matte ─────────────────────────────────────────────────
  { name: 'Ivory White',     hex: '#ffffff', category: 'PLA', type: 'PLA Matte' },
  { name: 'Bone White',      hex: '#cbc6b8', category: 'PLA', type: 'PLA Matte' },
  { name: 'Desert Tan',      hex: '#e8dbb7', category: 'PLA', type: 'PLA Matte' },
  { name: 'Lemon Yellow',    hex: '#f7d959', category: 'PLA', type: 'PLA Matte' },
  { name: 'Mandarin Orange', hex: '#f99963', category: 'PLA', type: 'PLA Matte' },
  { name: 'Sakura Pink',     hex: '#e8afcf', category: 'PLA', type: 'PLA Matte' },
  { name: 'Lilac Purple',    hex: '#ae96d4', category: 'PLA', type: 'PLA Matte' },
  { name: 'Plum',            hex: '#950051', category: 'PLA', type: 'PLA Matte' },
  { name: 'Scarlet Red',     hex: '#de4343', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Red',        hex: '#bb3d43', category: 'PLA', type: 'PLA Matte' },
  { name: 'Terracotta',      hex: '#b15533', category: 'PLA', type: 'PLA Matte' },
  { name: 'Apple Green',     hex: '#c2e189', category: 'PLA', type: 'PLA Matte' },
  { name: 'Grass Green',     hex: '#61c680', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Green',      hex: '#68724d', category: 'PLA', type: 'PLA Matte' },
  { name: 'Ice Blue',        hex: '#a3d8e1', category: 'PLA', type: 'PLA Matte' },
  { name: 'Sky Blue',        hex: '#56b7e6', category: 'PLA', type: 'PLA Matte' },
  { name: 'Marine Blue',     hex: '#0078bf', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Blue',       hex: '#042f56', category: 'PLA', type: 'PLA Matte' },
  { name: 'Latte Brown',     hex: '#d3b7a7', category: 'PLA', type: 'PLA Matte' },
  { name: 'Caramel',         hex: '#ae835b', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Brown',      hex: '#7d6556', category: 'PLA', type: 'PLA Matte' },
  { name: 'Dark Chocolate',  hex: '#4d3324', category: 'PLA', type: 'PLA Matte' },
  { name: 'Ash Gray',        hex: '#9b9ea0', category: 'PLA', type: 'PLA Matte' },
  { name: 'Nardo Gray',      hex: '#757575', category: 'PLA', type: 'PLA Matte' },
  { name: 'Charcoal',        hex: '#2b2b2b', category: 'PLA', type: 'PLA Matte' },

  // ── PLA Translucent ───────────────────────────────────────────
  { name: 'Teal',         hex: '#009fa1', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Blue',         hex: '#0047bb', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Orange',       hex: '#f74e02', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Purple',       hex: '#8344b0', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Red',          hex: '#b50011', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Light Jade',   hex: '#96d8af', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Mellow Yellow',hex: '#f5dbab', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Cherry Pink',  hex: '#f5b6cd', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Ice Blue',     hex: '#b8cde9', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Lavender',     hex: '#b8acd6', category: 'PLA', type: 'PLA Translucent' },

  // ── PLA Silk ──────────────────────────────────────────────────
  { name: 'White',      hex: '#ffffff', category: 'PLA', type: 'PLA Silk' },
  { name: 'Silver',     hex: '#c8c8c8', category: 'PLA', type: 'PLA Silk' },
  { name: 'Titan Gray', hex: '#5f6367', category: 'PLA', type: 'PLA Silk' },
  { name: 'Champagne',  hex: '#f3cfb2', category: 'PLA', type: 'PLA Silk' },
  { name: 'Gold',       hex: '#f4a925', category: 'PLA', type: 'PLA Silk' },
  { name: 'Rose Gold',  hex: '#ba9594', category: 'PLA', type: 'PLA Silk' },
  { name: 'Candy Red',  hex: '#d02727', category: 'PLA', type: 'PLA Silk' },
  { name: 'Pink',       hex: '#f7ada6', category: 'PLA', type: 'PLA Silk' },
  { name: 'Baby Blue',  hex: '#a8c6ee', category: 'PLA', type: 'PLA Silk' },
  { name: 'Blue',       hex: '#008bda', category: 'PLA', type: 'PLA Silk' },
  { name: 'Purple',     hex: '#8671cb', category: 'PLA', type: 'PLA Silk' },
  { name: 'Candy Green',hex: '#018814', category: 'PLA', type: 'PLA Silk' },
  { name: 'Mint',       hex: '#96dcb9', category: 'PLA', type: 'PLA Silk' },

  // ── PLA Sparkle ───────────────────────────────────────────────
  { name: 'Onyx Black',    hex: '#2d2b28', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Slate Gray',    hex: '#8e9089', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Classic Gold',  hex: '#cea629', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Crimson Red',   hex: '#792b36', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Royal Purple',  hex: '#483d8b', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Alpine Green',  hex: '#3f5443', category: 'PLA', type: 'PLA Sparkle' },

  // ── PETG Basic ────────────────────────────────────────────────
  { name: 'White',      hex: '#ffffff', category: 'PETG', type: 'PETG Basic' },
  { name: 'Yellow',     hex: '#fce300', category: 'PETG', type: 'PETG Basic' },
  { name: 'Red',        hex: '#d6001c', category: 'PETG', type: 'PETG Basic' },
  { name: 'Reflex Blue',hex: '#001389', category: 'PETG', type: 'PETG Basic' },
  { name: 'Gray',       hex: '#7f7e83', category: 'PETG', type: 'PETG Basic' },
  { name: 'Dark Brown', hex: '#502c1e', category: 'PETG', type: 'PETG Basic' },
  { name: 'Black',      hex: '#000000', category: 'PETG', type: 'PETG Basic' },

  // ── PETG Translucent ──────────────────────────────────────────
  { name: 'Clear',      hex: '#e0e0e0', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Gray',       hex: '#8e8e8e', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Pink',       hex: '#f9c1bd', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Orange',     hex: '#ff911a', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Olive',      hex: '#748c45', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Teal',       hex: '#77edd7', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Light Blue', hex: '#61b0ff', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Purple',     hex: '#d6abff', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Brown',      hex: '#e5c688', category: 'PETG', type: 'PETG Translucent' },

  // ── PETG HF ───────────────────────────────────────────────────
  { name: 'White',        hex: '#ffffff', category: 'PETG', type: 'PETG HF' },
  { name: 'Cream',        hex: '#f9dfb9', category: 'PETG', type: 'PETG HF' },
  { name: 'Yellow',       hex: '#ffd00b', category: 'PETG', type: 'PETG HF' },
  { name: 'Orange',       hex: '#f75403', category: 'PETG', type: 'PETG HF' },
  { name: 'Red',          hex: '#eb3a3a', category: 'PETG', type: 'PETG HF' },
  { name: 'Lime Green',   hex: '#6ee53c', category: 'PETG', type: 'PETG HF' },
  { name: 'Green',        hex: '#00ae42', category: 'PETG', type: 'PETG HF' },
  { name: 'Forest Green', hex: '#39541a', category: 'PETG', type: 'PETG HF' },
  { name: 'Lake Blue',    hex: '#1f79e5', category: 'PETG', type: 'PETG HF' },
  { name: 'Blue',         hex: '#002e96', category: 'PETG', type: 'PETG HF' },
  { name: 'Peanut Brown', hex: '#875718', category: 'PETG', type: 'PETG HF' },
  { name: 'Gray',         hex: '#adb1b2', category: 'PETG', type: 'PETG HF' },
  { name: 'Dark Gray',    hex: '#515151', category: 'PETG', type: 'PETG HF' },
  { name: 'Black',        hex: '#000000', category: 'PETG', type: 'PETG HF' },

  // ── PETG-CF ───────────────────────────────────────────────────
  { name: 'Black',          hex: '#000000', category: 'PETG', type: 'PETG-CF' },
  { name: 'Titan Gray',     hex: '#565656', category: 'PETG', type: 'PETG-CF' },
  { name: 'Brick Red',      hex: '#9f332a', category: 'PETG', type: 'PETG-CF' },
  { name: 'Indigo Blue',    hex: '#324585', category: 'PETG', type: 'PETG-CF' },
  { name: 'Malachite Green',hex: '#16b08e', category: 'PETG', type: 'PETG-CF' },
  { name: 'Violet Purple',  hex: '#583061', category: 'PETG', type: 'PETG-CF' },

  // ── ABS ───────────────────────────────────────────────────────
  { name: 'White',           hex: '#ffffff', category: 'Other', type: 'ABS' },
  { name: 'Silver',          hex: '#87909a', category: 'Other', type: 'ABS' },
  { name: 'Tangerine Yellow',hex: '#ffc72c', category: 'Other', type: 'ABS' },
  { name: 'Orange',          hex: '#ff6a13', category: 'Other', type: 'ABS' },
  { name: 'Red',             hex: '#d32941', category: 'Other', type: 'ABS' },
  { name: 'Azure',           hex: '#489fdf', category: 'Other', type: 'ABS' },
  { name: 'Blue',            hex: '#0a2ca5', category: 'Other', type: 'ABS' },
  { name: 'Navy Blue',       hex: '#0c2340', category: 'Other', type: 'ABS' },
  { name: 'Bambu Green',     hex: '#00ae42', category: 'Other', type: 'ABS' },
  { name: 'Olive',           hex: '#789d4a', category: 'Other', type: 'ABS' },
  { name: 'Black',           hex: '#000000', category: 'Other', type: 'ABS' },

  // ── ASA ───────────────────────────────────────────────────────
  { name: 'White', hex: '#fffaf2', category: 'Other', type: 'ASA' },
  { name: 'Gray',  hex: '#8a949e', category: 'Other', type: 'ASA' },
  { name: 'Red',   hex: '#e02928', category: 'Other', type: 'ASA' },
  { name: 'Blue',  hex: '#2140b4', category: 'Other', type: 'ASA' },
  { name: 'Green', hex: '#00a6a0', category: 'Other', type: 'ASA' },
  { name: 'Black', hex: '#000000', category: 'Other', type: 'ASA' },

  // ── TPU 95A ───────────────────────────────────────────────────
  { name: 'White',  hex: '#ffffff', category: 'Other', type: 'TPU 95A' },
  { name: 'Gray',   hex: '#898d8d', category: 'Other', type: 'TPU 95A' },
  { name: 'Yellow', hex: '#f3e600', category: 'Other', type: 'TPU 95A' },
  { name: 'Red',    hex: '#c8102e', category: 'Other', type: 'TPU 95A' },
  { name: 'Blue',   hex: '#0072ce', category: 'Other', type: 'TPU 95A' },
  { name: 'Black',  hex: '#101820', category: 'Other', type: 'TPU 95A' },

  // ── Other ─────────────────────────────────────────────────────
  { name: 'White (PA)',  hex: '#f0eee8', category: 'Other', type: 'Other' },
  { name: 'Black (PA)',  hex: '#1a1a1a', category: 'Other', type: 'Other' },
  { name: 'White (PC)',  hex: '#f5f4f0', category: 'Other', type: 'Other' },
  { name: 'Black (PC)',  hex: '#1a1a1a', category: 'Other', type: 'Other' },
  { name: 'PVA',         hex: '#f5edd8', category: 'Other', type: 'Other' },
  { name: 'HIPS',        hex: '#eeddb8', category: 'Other', type: 'Other' },
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
