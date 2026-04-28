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
  'Clear', 'Natural',
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
  { name: 'Matte Ivory White',    hex: '#ffffff', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Bone White',     hex: '#cbc6b8', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Desert Tan',     hex: '#e8dbb7', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Lemon Yellow',   hex: '#f7d959', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Mandarin Orange',hex: '#f99963', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Sakura Pink',    hex: '#e8afcf', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Lilac Purple',   hex: '#ae96d4', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Plum',           hex: '#950051', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Scarlet Red',    hex: '#de4343', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Dark Red',       hex: '#bb3d43', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Terracotta',     hex: '#b15533', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Apple Green',    hex: '#c2e189', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Grass Green',    hex: '#61c680', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Dark Green',     hex: '#68724d', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Ice Blue',       hex: '#a3d8e1', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Sky Blue',       hex: '#56b7e6', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Marine Blue',    hex: '#0078bf', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Dark Blue',      hex: '#042f56', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Latte Brown',    hex: '#d3b7a7', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Caramel',        hex: '#ae835b', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Dark Brown',     hex: '#7d6556', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Dark Chocolate', hex: '#4d3324', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Ash Gray',       hex: '#9b9ea0', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Nardo Gray',     hex: '#757575', category: 'PLA', type: 'PLA Matte' },
  { name: 'Matte Charcoal',       hex: '#2b2b2b', category: 'PLA', type: 'PLA Matte' },

  // ── PLA Translucent ───────────────────────────────────────────
  { name: 'Orange',        hex: '#f74e02', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Red',           hex: '#b50011', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Cherry Pink',   hex: '#f5b6cd', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Mellow Yellow', hex: '#f5dbab', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Warm Yellow',   hex: '#ffed81', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Warm White',    hex: '#fffce7', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Cold White',    hex: '#fffefe', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Light Jade',    hex: '#96d8af', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Teal',          hex: '#009fa1', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Ice Blue',      hex: '#b8cde9', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Blue',          hex: '#0047bb', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Lavender',      hex: '#b8acd6', category: 'PLA', type: 'PLA Translucent' },
  { name: 'Purple',        hex: '#8344b0', category: 'PLA', type: 'PLA Translucent' },

  // ── PLA Luminous ──────────────────────────────────────────────
  { name: 'Luminous Green',  hex: '#39ff14', category: 'PLA', type: 'PLA Luminous' },
  { name: 'Luminous Blue',   hex: '#00b4ff', category: 'PLA', type: 'PLA Luminous' },
  { name: 'Luminous Yellow', hex: '#fff01f', category: 'PLA', type: 'PLA Luminous' },
  { name: 'Luminous Pink',   hex: '#ff6ec7', category: 'PLA', type: 'PLA Luminous' },
  { name: 'Luminous Purple', hex: '#bf5fff', category: 'PLA', type: 'PLA Luminous' },
  { name: 'Luminous Orange', hex: '#ff9500', category: 'PLA', type: 'PLA Luminous' },

  // ── PLA Silk ──────────────────────────────────────────────────
  { name: 'White',       hex: '#ffffff', category: 'PLA', type: 'PLA Silk' },
  { name: 'Silver',      hex: '#c8c8c8', category: 'PLA', type: 'PLA Silk' },
  { name: 'Titan Gray',  hex: '#5f6367', category: 'PLA', type: 'PLA Silk' },
  { name: 'Champagne',   hex: '#f3cfb2', category: 'PLA', type: 'PLA Silk' },
  { name: 'Gold',        hex: '#f4a925', category: 'PLA', type: 'PLA Silk' },
  { name: 'Rose Gold',   hex: '#ba9594', category: 'PLA', type: 'PLA Silk' },
  { name: 'Candy Red',   hex: '#d02727', category: 'PLA', type: 'PLA Silk' },
  { name: 'Pink',        hex: '#f7ada6', category: 'PLA', type: 'PLA Silk' },
  { name: 'Baby Blue',   hex: '#a8c6ee', category: 'PLA', type: 'PLA Silk' },
  { name: 'Blue',        hex: '#008bda', category: 'PLA', type: 'PLA Silk' },
  { name: 'Purple',      hex: '#8671cb', category: 'PLA', type: 'PLA Silk' },
  { name: 'Candy Green', hex: '#018814', category: 'PLA', type: 'PLA Silk' },
  { name: 'Mint',        hex: '#96dcb9', category: 'PLA', type: 'PLA Silk' },

  // ── PLA Sparkle ───────────────────────────────────────────────
  { name: 'Onyx Black',   hex: '#2d2b28', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Slate Gray',   hex: '#8e9089', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Classic Gold', hex: '#cea629', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Crimson Red',  hex: '#792b36', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Royal Purple', hex: '#483d8b', category: 'PLA', type: 'PLA Sparkle' },
  { name: 'Alpine Green', hex: '#3f5443', category: 'PLA', type: 'PLA Sparkle' },

  // ── PETG Luminous ─────────────────────────────────────────────
  { name: 'Luminous Green',  hex: '#39ff14', category: 'PETG', type: 'PETG Luminous' },
  { name: 'Luminous Blue',   hex: '#00b4ff', category: 'PETG', type: 'PETG Luminous' },
  { name: 'Luminous Yellow', hex: '#fff01f', category: 'PETG', type: 'PETG Luminous' },
  { name: 'Luminous Pink',   hex: '#ff6ec7', category: 'PETG', type: 'PETG Luminous' },

  // ── PETG Basic ────────────────────────────────────────────────
  { name: 'White',       hex: '#ffffff', category: 'PETG', type: 'PETG Basic' },
  { name: 'Yellow',      hex: '#fce300', category: 'PETG', type: 'PETG Basic' },
  { name: 'Red',         hex: '#d6001c', category: 'PETG', type: 'PETG Basic' },
  { name: 'Reflex Blue', hex: '#001389', category: 'PETG', type: 'PETG Basic' },
  { name: 'Gray',        hex: '#7f7e83', category: 'PETG', type: 'PETG Basic' },
  { name: 'Dark Brown',  hex: '#502c1e', category: 'PETG', type: 'PETG Basic' },
  { name: 'Black',       hex: '#000000', category: 'PETG', type: 'PETG Basic' },

  // ── PETG Translucent ──────────────────────────────────────────
  { name: 'Clear',                  hex: '#e0e0e0', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Gray',       hex: '#8e8e8e', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Pink',       hex: '#f9c1bd', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Orange',     hex: '#ff911a', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Olive',      hex: '#748c45', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Teal',       hex: '#77edd7', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Light Blue', hex: '#61b0ff', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Purple',     hex: '#d6abff', category: 'PETG', type: 'PETG Translucent' },
  { name: 'Translucent Brown',      hex: '#e5c688', category: 'PETG', type: 'PETG Translucent' },

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
  { name: 'Black',           hex: '#000000', category: 'PETG', type: 'PETG-CF' },
  { name: 'Titan Gray',      hex: '#565656', category: 'PETG', type: 'PETG-CF' },
  { name: 'Brick Red',       hex: '#9f332a', category: 'PETG', type: 'PETG-CF' },
  { name: 'Indigo Blue',     hex: '#324585', category: 'PETG', type: 'PETG-CF' },
  { name: 'Malachite Green', hex: '#16b08e', category: 'PETG', type: 'PETG-CF' },
  { name: 'Violet Purple',   hex: '#583061', category: 'PETG', type: 'PETG-CF' },

  // ── ABS ───────────────────────────────────────────────────────
  { name: 'ABS White',           hex: '#ffffff', category: 'Other', type: 'ABS' },
  { name: 'ABS Silver',          hex: '#87909a', category: 'Other', type: 'ABS' },
  { name: 'ABS Tangerine Yellow',hex: '#ffc72c', category: 'Other', type: 'ABS' },
  { name: 'ABS Orange',          hex: '#ff6a13', category: 'Other', type: 'ABS' },
  { name: 'ABS Red',             hex: '#d32941', category: 'Other', type: 'ABS' },
  { name: 'ABS Azure',           hex: '#489fdf', category: 'Other', type: 'ABS' },
  { name: 'ABS Blue',            hex: '#0a2ca5', category: 'Other', type: 'ABS' },
  { name: 'ABS Navy Blue',       hex: '#0c2340', category: 'Other', type: 'ABS' },
  { name: 'ABS Bambu Green',     hex: '#00ae42', category: 'Other', type: 'ABS' },
  { name: 'ABS Olive',           hex: '#789d4a', category: 'Other', type: 'ABS' },
  { name: 'ABS Black',           hex: '#000000', category: 'Other', type: 'ABS' },

  // ── ABS-GF ────────────────────────────────────────────────────
  { name: 'White',  hex: '#ffffff', category: 'Other', type: 'ABS-GF' },
  { name: 'Gray',   hex: '#c6c6c6', category: 'Other', type: 'ABS-GF' },
  { name: 'Red',    hex: '#e83100', category: 'Other', type: 'ABS-GF' },
  { name: 'Orange', hex: '#f48438', category: 'Other', type: 'ABS-GF' },
  { name: 'Blue',   hex: '#0c3b95', category: 'Other', type: 'ABS-GF' },
  { name: 'Black',  hex: '#000000', category: 'Other', type: 'ABS-GF' },

  // ── ASA ───────────────────────────────────────────────────────
  { name: 'ASA White', hex: '#fffaf2', category: 'Other', type: 'ASA' },
  { name: 'ASA Gray',  hex: '#8a949e', category: 'Other', type: 'ASA' },
  { name: 'ASA Red',   hex: '#e02928', category: 'Other', type: 'ASA' },
  { name: 'ASA Blue',  hex: '#2140b4', category: 'Other', type: 'ASA' },
  { name: 'ASA Green', hex: '#00a6a0', category: 'Other', type: 'ASA' },
  { name: 'ASA Black', hex: '#000000', category: 'Other', type: 'ASA' },

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

/** Bambu Lab colors as BrandColor entries for the AddColorModal picker (deduped by name) */
export const BAMBU_BRAND_COLORS = COLOR_DEFS
  .map((d) => ({ name: d.name, hex: d.hex }))
  .filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) === i);

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
