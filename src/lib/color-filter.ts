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
  keywords: string[]; // words to match against filament name
  match: (hex: string) => boolean;
}

export const COLOR_FAMILIES: ColorFamily[] = [
  {
    id: 'white',
    label: 'White',
    dot: '#F0F0F0',
    keywords: ['white', 'ivory', 'cream', 'snow', 'pearl', 'milk', 'milky', 'bone', 'natural', 'clear'],
    match: (hex) => { const [,, l] = hexToHsl(hex); return l > 0.82; },
  },
  {
    id: 'yellow',
    label: 'Yellow',
    dot: '#FFD700',
    keywords: ['yellow', 'lemon', 'gold', 'golden', 'sunshine', 'banana', 'canary'],
    match: (hex) => { const [h, s, l] = hexToHsl(hex); return h >= 42 && h <= 72 && s > 0.5 && l < 0.82; },
  },
  {
    id: 'orange',
    label: 'Orange',
    dot: '#FF8C00',
    keywords: ['orange', 'coral', 'amber', 'peach', 'apricot', 'copper', 'rust'],
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 20 && h < 42 && s > 0.5; },
  },
  {
    id: 'red',
    label: 'Red',
    dot: '#DC143C',
    keywords: ['red', 'crimson', 'scarlet', 'cherry', 'wine', 'ruby', 'brick', 'maroon', 'bordeaux', 'rouge', 'fire'],
    match: (hex) => { const [h, s] = hexToHsl(hex); return (h < 20 || h >= 348) && s > 0.35; },
  },
  {
    id: 'pink',
    label: 'Pink',
    dot: '#FF69B4',
    keywords: ['pink', 'rose', 'blush', 'fuchsia', 'magenta', 'sakura', 'bubblegum', 'flamingo', 'lilac rose'],
    match: (hex) => { const [h, s, l] = hexToHsl(hex); return h >= 300 && h < 348 && s > 0.3 && l > 0.3; },
  },
  {
    id: 'purple',
    label: 'Purple',
    dot: '#7B2D8B',
    keywords: ['purple', 'violet', 'lavender', 'indigo', 'lilac', 'plum', 'grape', 'mauve', 'amethyst'],
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 240 && h < 305 && s > 0.2; },
  },
  {
    id: 'blue',
    label: 'Blue',
    dot: '#1E6FCC',
    keywords: ['blue', 'navy', 'cobalt', 'sapphire', 'azure', 'sky', 'ocean', 'denim', 'royal', 'midnight', 'steel blue'],
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 200 && h < 245 && s > 0.2; },
  },
  {
    id: 'teal',
    label: 'Teal & Cyan',
    dot: '#008080',
    keywords: ['teal', 'cyan', 'turquoise', 'aqua', 'mint teal', 'jade teal'],
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 165 && h < 200 && s > 0.2; },
  },
  {
    id: 'green',
    label: 'Green',
    dot: '#228B22',
    keywords: ['green', 'mint', 'olive', 'lime', 'forest', 'jade', 'emerald', 'grass', 'sage', 'army', 'jungle', 'pine', 'mossy', 'chartreuse'],
    match: (hex) => { const [h, s] = hexToHsl(hex); return h >= 80 && h < 165 && s > 0.2; },
  },
  {
    id: 'brown',
    label: 'Brown',
    dot: '#795548',
    keywords: ['brown', 'chocolate', 'wood', 'tan', 'coffee', 'caramel', 'walnut', 'hazel', 'beige', 'khaki', 'sand', 'latte', 'mocha', 'sienna', 'terra'],
    match: (hex) => { const [h, s, l] = hexToHsl(hex); return h >= 15 && h < 45 && s > 0.15 && l < 0.5; },
  },
  {
    id: 'grey',
    label: 'Grey',
    dot: '#808080',
    keywords: ['grey', 'gray', 'silver', 'ash', 'charcoal', 'concrete', 'slate', 'smoke', 'stone', 'platinum'],
    match: (hex) => { const [, s, l] = hexToHsl(hex); return s < 0.12 && l > 0.22 && l <= 0.82; },
  },
  {
    id: 'black',
    label: 'Black',
    dot: '#1A1A1A',
    keywords: ['black', 'ebony', 'onyx', 'jet', 'obsidian', 'carbon'],
    match: (hex) => { const [,, l] = hexToHsl(hex); return l <= 0.22; },
  },
];

/** Split a filament name into lowercase tokens for word-boundary matching */
function nameTokens(name: string): string[] {
  return name.toLowerCase().split(/[\s\-_/&+,]+/).filter(Boolean);
}

/**
 * Returns true if the filament (identified by hex + optional name) matches
 * the given color family — by hex hue OR by a keyword appearing in the name.
 */
export function matchesColorFamily(hex: string, familyId: string, name?: string): boolean {
  const family = COLOR_FAMILIES.find((f) => f.id === familyId);
  if (!family) return true;
  if (family.match(hex)) return true;
  if (name) {
    const tokens = nameTokens(name);
    // Also try the full lowercased name for multi-word keywords (e.g. "steel blue")
    const fullLower = name.toLowerCase();
    return family.keywords.some((kw) =>
      kw.includes(' ') ? fullLower.includes(kw) : tokens.includes(kw)
    );
  }
  return false;
}
