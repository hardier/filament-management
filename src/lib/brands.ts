// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrandColor {
  code?: string;   // brand's own SKU/code, e.g. "RB001", "PA02001"
  name: string;    // color name, e.g. "Cherry Red"
  hex: string;     // best-known hex, e.g. "#C12E1F"
  material?: string; // "PLA", "PETG", etc. — optional
}

/** Full catalog keyed by brand name. */
export type BrandCatalog = Record<string, BrandColor[]>;

// ─── Static fallback catalog (used before remote data loads) ──────────────────

const POLYMAKER_COLORS: BrandColor[] = [
  { code: 'PA02001', name: 'Black',           hex: '#030305' },
  { code: 'PA02002', name: 'White',           hex: '#ddd7d3' },
  { code: 'PA02003', name: 'Grey',            hex: '#8b8e96' },
  { code: 'PA02004', name: 'Red',             hex: '#d90102' },
  { code: 'PA02005', name: 'Blue',            hex: '#013178' },
  { code: 'PA02006', name: 'Green',           hex: '#30a45f' },
  { code: 'PA02007', name: 'Yellow',          hex: '#f3aa01' },
  { code: 'PA02008', name: 'Orange',          hex: '#f36201' },
  { code: 'PA02009', name: 'Purple',          hex: '#6447a5' },
  { code: 'PA02010', name: 'Polymaker Teal',  hex: '#48b9c2' },
  { code: 'PA02011', name: 'Natural',         hex: '#dfd3c3' },
  { code: 'PA02054', name: 'Magenta',         hex: '#f24574' },
  { code: 'PA02055', name: 'Beige',           hex: '#c2ab72' },
  { code: 'PA02056', name: 'Cream',           hex: '#eed1a8' },
  { code: 'PA02057', name: 'Wine Red',        hex: '#d60212' },
  { code: 'PA02058', name: 'Olive Green',     hex: '#948902' },
  { code: 'PA02059', name: 'Jungle Green',    hex: '#4e742d' },
  { code: 'PA02060', name: 'Lime Green',      hex: '#d5d701' },
  { code: 'PA02061', name: 'Lemon Yellow',    hex: '#eed230' },
  { code: 'PA02062', name: 'Stone Blue',      hex: '#487ba2' },
  { code: 'PA02063', name: 'Aqua Blue',       hex: '#5ebddb' },
  { code: 'PA02064', name: 'Azure Blue',      hex: '#0061d5' },
  { code: 'PA02065', name: 'Steel Grey',      hex: '#5d5e63' },
  { code: 'PA02075', name: 'Dark Blue',       hex: '#041b3d' },
  { code: 'PA02094', name: 'Olive Brown',     hex: '#a79565' },
  { code: 'PA02095', name: 'Dark Gray Green', hex: '#4c5f46' },
  { code: 'PA02096', name: 'Cold White',      hex: '#eaecf5' },
  { code: 'PA02098', name: 'Dark Grey',       hex: '#6e8393' },
  { name: 'Pink',    hex: '#ee9bb5' },
  { name: 'Brown',   hex: '#55331a' },
];

const SUNLU_COLORS: BrandColor[] = [
  { name: 'White',           hex: '#e6e6e2' },
  { name: 'Black',           hex: '#3a3b3b' },
  { name: 'Grey',            hex: '#6b6e6e' },
  { name: 'Beige',           hex: '#ddbcac' },
  { name: 'Brown',           hex: '#8e6b4e' },
  { name: 'Wood',            hex: '#d5ba95' },
  { name: 'Red',             hex: '#b34044' },
  { name: 'Pink',            hex: '#e683a7' },
  { name: 'Silk Pink',       hex: '#ffcad9' },
  { name: 'Sakura Pink',     hex: '#f5b5c2' },
  { name: 'Magenta',         hex: '#da3b6c' },
  { name: 'Orange',          hex: '#e77932' },
  { name: 'Yellow',          hex: '#ffbd2c' },
  { name: 'Grass Green',     hex: '#008b73' },
  { name: 'Mint Green',      hex: '#4ccb9a' },
  { name: 'Blue',            hex: '#0063a0' },
  { name: 'Sky Blue',        hex: '#0cb7cc' },
  { name: 'Meta Blue',       hex: '#00b2cc' },
  { name: 'Purple',          hex: '#8887c5' },
  { name: 'Silk Brass',      hex: '#f1a050' },
  { name: 'Red Copper Silk', hex: '#cc937f' },
  { name: 'Light Gold',      hex: '#d3943d' },
  { name: 'Silky Silver',    hex: '#c6cbd0' },
  { name: 'Clear',           hex: '#c8c7bf' },
  { name: 'Glow in Dark',    hex: '#cbcab8' },
  { name: 'Red Glow',        hex: '#f25455' },
];

const ESUN_COLORS: BrandColor[] = [
  { name: 'Cool White',      hex: '#e1e4e5' },
  { name: 'Bone White',      hex: '#c2baa7' },
  { name: 'Milky White',     hex: '#f5f5ee' },
  { name: 'Black',           hex: '#373838' },
  { name: 'Silver',          hex: '#8b8889' },
  { name: 'Silk Silver',     hex: '#b5c1c5' },
  { name: 'Concrete',        hex: '#92908c' },
  { name: 'Gray',            hex: '#697480' },
  { name: 'Beige',           hex: '#eccab0' },
  { name: 'Skin',            hex: '#e3c7af' },
  { name: 'Light Khaki',     hex: '#c3b091' },
  { name: 'Brown',           hex: '#6f513c' },
  { name: 'Light Brown',     hex: '#a27556' },
  { name: 'Gold',            hex: '#c99b26' },
  { name: 'Silk Gold',       hex: '#c48e2f' },
  { name: 'Yellow',          hex: '#fbce2b' },
  { name: 'Lemon Yellow',    hex: '#eed230' },
  { name: 'Orange',          hex: '#ef7749' },
  { name: 'Red',             hex: '#c4402a' },
  { name: 'Fire Engine Red', hex: '#91202b' },
  { name: 'Brick Red',       hex: '#8c2f2f' },
  { name: 'Pink',            hex: '#e78397' },
  { name: 'Magenta',         hex: '#da3b6c' },
  { name: 'Purple',          hex: '#8350a4' },
  { name: 'Lilac',           hex: '#c8a2c8' },
  { name: 'Blue',            hex: '#054795' },
  { name: 'Dark Blue',       hex: '#2f314d' },
  { name: 'Light Blue',      hex: '#48bfd5' },
  { name: 'Green',           hex: '#015e58' },
  { name: 'Grass Green',     hex: '#2c8a39' },
  { name: 'Peak Green',      hex: '#a1da7c' },
  { name: 'Olive Green',     hex: '#555b45' },
  { name: 'Pine Green',      hex: '#375c49' },
];

const CAILAB_COLORS: BrandColor[] = [
  // PLA Matte — coded colors
  { code: 'AC635',  name: 'Light Blue',      hex: '#6cb4e4', material: 'PLA' },
  { code: 'AC1655', name: 'Orange',          hex: '#e87722', material: 'PLA' },
  { code: 'AC2420', name: 'Green',           hex: '#4a8c3f', material: 'PLA' },
  { code: 'AC2925', name: 'Cyan',            hex: '#00a3ad', material: 'PLA' },
  { code: 'MT7492', name: 'Matcha Green',    hex: '#b6bb63', material: 'PLA' },
  // PLA Matte — standard colors
  { name: 'Black',          hex: '#000000', material: 'PLA' },
  { name: 'Hazy Blue',      hex: '#75a6d7', material: 'PLA' },
  { name: 'Latte',          hex: '#b88a68', material: 'PLA' },
  { name: 'Misty Lilac',    hex: '#dcd2ff', material: 'PLA' },
  { name: 'Pudding Yellow', hex: '#e3ce4a', material: 'PLA' },
  { name: "Robin's Egg Blue", hex: '#1fcecb', material: 'PLA' },
  // PLA Matte Rainbow (multicolor — shown as first color)
  { code: 'RB007', name: 'Matte Rainbow RB007', hex: '#f67ab9', material: 'PLA' },
  { code: 'RB008', name: 'Matte Rainbow RB008', hex: '#6bbbd4', material: 'PLA' },
  { code: 'RB009', name: 'Matte Rainbow RB009', hex: '#aeefc1', material: 'PLA' },
  // PLA Silk
  { name: 'Gold',           hex: '#e4bd68', material: 'PLA' },
  { name: 'Pearl White',    hex: '#d3cfc3', material: 'PLA' },
  { name: 'Purple',         hex: '#4f0b56', material: 'PLA' },
  { name: 'Silver',         hex: '#d4dde4', material: 'PLA' },
  { name: 'Coffee Golden',  hex: '#9a7e44', material: 'PLA' },
  { name: 'Dark Red',       hex: '#710000', material: 'PLA' },
  { name: 'Moonlight Pink', hex: '#f358ba', material: 'PLA' },
  { name: 'Sunshine Gold',  hex: '#ffff00', material: 'PLA' },
  // PLA Metal / Premium
  { name: 'Iridium Gold',   hex: '#8e6f7f', material: 'PLA' },
  { name: 'Old Glory Blue', hex: '#0a3161', material: 'PLA' },
  // PETG Basic
  { name: 'Gris',           hex: '#575757', material: 'PETG' },
  { name: 'Olive Green',    hex: '#042007', material: 'PETG' },
  { name: 'Rose',           hex: '#e7c3ef', material: 'PETG' },
  // PETG CF
  { name: 'Rouge Bordeaux', hex: '#800020', material: 'PETG' },
];

const STATIC_CATALOG: BrandCatalog = {
  'Polymaker': POLYMAKER_COLORS,
  'Sunlu':     SUNLU_COLORS,
  'eSUN':      ESUN_COLORS,
  'Cailab':    CAILAB_COLORS,
};

// ─── Known brand names (for the dropdown) ────────────────────────────────────

export const KNOWN_BRAND_NAMES = [
  'Bambu Lab',
  'Polymaker',
  'Sunlu',
  'eSUN',
  'Cailab',
  'Hatchbox',
  'Prusament',
  'Elegoo',
  'Overture',
  'Creality',
];

// ─── Client-side catalog fetch (module-level cache) ───────────────────────────

let _catalogCache: BrandCatalog | null = null;
let _fetchPromise: Promise<BrandCatalog> | null = null;

export function getBrandColors(brandName: string, catalog?: BrandCatalog): BrandColor[] | undefined {
  const src = catalog ?? _catalogCache ?? STATIC_CATALOG;
  return src[brandName];
}

export async function loadBrandCatalog(): Promise<BrandCatalog> {
  if (_catalogCache) return _catalogCache;
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = fetch('/api/brands')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const remote: BrandCatalog = data?.catalog ?? {};
      // Merge remote over static so brands not yet in DB still show
      _catalogCache = { ...STATIC_CATALOG, ...remote };
      return _catalogCache;
    })
    .catch(() => {
      _catalogCache = STATIC_CATALOG;
      return _catalogCache;
    });

  return _fetchPromise;
}

export { STATIC_CATALOG };
