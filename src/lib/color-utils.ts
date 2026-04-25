// Convert hex to HSL for perceptual color sorting
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [h * 360, s, l];
}

// Colors with very low saturation are neutrals — sort by lightness only
function isNeutral(s: number): boolean {
  return s < 0.12;
}

export function colorSortKey(hex: string): [number, number, number, number] {
  const [h, s, l] = hexToHsl(hex);
  // Neutrals go last, sorted dark→light
  if (isNeutral(s)) return [1, 0, 0, l];
  return [0, h, -s, l];
}

export function sortByColor<T extends { hex: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ka = colorSortKey(a.hex);
    const kb = colorSortKey(b.hex);
    for (let i = 0; i < ka.length; i++) {
      if (ka[i] !== kb[i]) return ka[i] - kb[i];
    }
    return 0;
  });
}

export function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Perceived luminance
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? '#1a1a1a' : '#ffffff';
}
