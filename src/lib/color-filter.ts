function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
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

export interface ColorFamily {
  id: string;
  label: string;
  dot: string;        // hex for the chip dot
  match: (hex: string) => boolean;
}

export const COLOR_FAMILIES: ColorFamily[] = [
  {
    id: 'white',
    label: 'White',
    dot: '#F0F0F0',
    match: (hex) => { const [,, l] = hexToHsl(hex); return l > 0.82; },
  },
  {
    id: 'yellow',
    label: 'Yellow',
    dot: '#FFD700',
    match: (hex) => { const [h, s, l] = hexToHsl(hex); return h >= 42 && h <= 72 && s > 0.5 && l < 0.82; },
  },
  {
    id: 'orange',
    label: 'Orange',
    dot: '#FF8C00',
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 20 && h < 42 && s > 0.5; },
  },
  {
    id: 'red',
    label: 'Red',
    dot: '#DC143C',
    match: (hex) => { const [h, s] = hexToHsl(hex); return (h < 20 || h >= 348) && s > 0.35; },
  },
  {
    id: 'pink',
    label: 'Pink',
    dot: '#FF69B4',
    match: (hex) => { const [h, s, l] = hexToHsl(hex); return h >= 300 && h < 348 && s > 0.3 && l > 0.3; },
  },
  {
    id: 'purple',
    label: 'Purple',
    dot: '#7B2D8B',
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 265 && h < 300 && s > 0.25; },
  },
  {
    id: 'blue',
    label: 'Blue',
    dot: '#1E6FCC',
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 200 && h < 265 && s > 0.2; },
  },
  {
    id: 'teal',
    label: 'Teal & Cyan',
    dot: '#008080',
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 165 && h < 200 && s > 0.2; },
  },
  {
    id: 'green',
    label: 'Green',
    dot: '#228B22',
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 80 && h < 165 && s > 0.2; },
  },
  {
    id: 'brown',
    label: 'Brown',
    dot: '#795548',
    match: (hex) => { const [h, s, l] = hexToHsl(hex); return h >= 15 && h < 45 && s > 0.15 && l < 0.5; },
  },
  {
    id: 'grey',
    label: 'Grey',
    dot: '#808080',
    match: (hex) => { const [, s, l] = hexToHsl(hex); return s < 0.12 && l > 0.22 && l <= 0.82; },
  },
  {
    id: 'black',
    label: 'Black',
    dot: '#1A1A1A',
    match: (hex) => { const [,, l] = hexToHsl(hex); return l <= 0.22; },
  },
];

export function matchesColorFamily(hex: string, familyId: string): boolean {
  const family = COLOR_FAMILIES.find((f) => f.id === familyId);
  return family ? family.match(hex) : true;
}
