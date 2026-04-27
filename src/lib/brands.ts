export interface BrandColor {
  code: string;   // brand's own code, e.g. "RB001"
  name: string;   // human name, e.g. "Rose Red"
  hex: string;    // best-known hex approximation
}

export interface Brand {
  name: string;
  colors?: BrandColor[];   // undefined = no catalog yet
}

export const KNOWN_BRANDS: Brand[] = [
  { name: 'Bambu Lab' },
  { name: 'Sunlu' },
  { name: 'Polymaker' },
  { name: 'Cailab' },
  { name: 'eSUN' },
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
