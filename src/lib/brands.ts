export interface BrandColor {
  code?: string;  // brand's own SKU/code if they have one
  name: string;
  hex: string;
}

export interface Brand {
  name: string;
  colors?: BrandColor[];
}

// ── Polymaker — official hex from engineering Wiki ─────────────
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

// ── Sunlu — colorimeter-measured from filamentcolors.xyz ───────
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

// ── eSUN — colorimeter-measured from filamentcolors.xyz ────────
const ESUN_COLORS: BrandColor[] = [
  { name: 'Cool White',       hex: '#e1e4e5' },
  { name: 'Bone White',       hex: '#c2baa7' },
  { name: 'Milky White',      hex: '#f5f5ee' },
  { name: 'Black',            hex: '#373838' },
  { name: 'Silver',           hex: '#8b8889' },
  { name: 'Silk Silver',      hex: '#b5c1c5' },
  { name: 'Concrete',         hex: '#92908c' },
  { name: 'Gray',             hex: '#697480' },
  { name: 'Beige',            hex: '#eccab0' },
  { name: 'Skin',             hex: '#e3c7af' },
  { name: 'Light Khaki',      hex: '#c3b091' },
  { name: 'Brown',            hex: '#6f513c' },
  { name: 'Light Brown',      hex: '#a27556' },
  { name: 'Gold',             hex: '#c99b26' },
  { name: 'Silk Gold',        hex: '#c48e2f' },
  { name: 'Yellow',           hex: '#fbce2b' },
  { name: 'Lemon Yellow',     hex: '#eed230' },
  { name: 'Orange',           hex: '#ef7749' },
  { name: 'Red',              hex: '#c4402a' },
  { name: 'Fire Engine Red',  hex: '#91202b' },
  { name: 'Brick Red',        hex: '#8c2f2f' },
  { name: 'Pink',             hex: '#e78397' },
  { name: 'Magenta',          hex: '#da3b6c' },
  { name: 'Purple',           hex: '#8350a4' },
  { name: 'Lilac',            hex: '#c8a2c8' },
  { name: 'Blue',             hex: '#054795' },
  { name: 'Dark Blue',        hex: '#2f314d' },
  { name: 'Light Blue',       hex: '#48bfd5' },
  { name: 'Green',            hex: '#015e58' },
  { name: 'Grass Green',      hex: '#2c8a39' },
  { name: 'Peak Green',       hex: '#a1da7c' },
  { name: 'Olive Green',      hex: '#555b45' },
  { name: 'Pine Green',       hex: '#375c49' },
];

// ── Cailab — limited catalog (AC-coded Designer Series) ────────
const CAILAB_COLORS: BrandColor[] = [
  { code: 'AC635',  name: 'Light Blue', hex: '#6cb4e4' },
  { code: 'AC1655', name: 'Orange',     hex: '#e87722' },
  { code: 'AC2420', name: 'Green',      hex: '#4a8c3f' },
  { code: 'AC2925', name: 'Cyan',       hex: '#00a3ad' },
];

export const KNOWN_BRANDS: Brand[] = [
  { name: 'Bambu Lab' },
  { name: 'Polymaker',  colors: POLYMAKER_COLORS },
  { name: 'Sunlu',      colors: SUNLU_COLORS },
  { name: 'eSUN',       colors: ESUN_COLORS },
  { name: 'Cailab',     colors: CAILAB_COLORS },
  { name: 'Hatchbox' },
  { name: 'Prusament' },
  { name: 'Elegoo' },
  { name: 'Overture' },
  { name: 'Creality' },
];

export const BRAND_NAMES = KNOWN_BRANDS.map((b) => b.name);

export function getBrandColors(brandName: string): BrandColor[] | undefined {
  return KNOWN_BRANDS.find((b) => b.name === brandName)?.colors;
}
