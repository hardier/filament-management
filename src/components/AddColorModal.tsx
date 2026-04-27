'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { FilamentSection, FilamentType } from '@/lib/types';
import { SECTION_TYPES } from '@/lib/types';
import { KNOWN_COLOR_NAMES } from '@/lib/bambu-colors';
import { BRAND_NAMES, getBrandColors, type BrandColor } from '@/lib/brands';

interface Props {
  section: FilamentSection;
  onAdd: (name: string, hex: string, brand: string, type: FilamentType) => void;
  onClose: () => void;
}

const NAME_TO_HEX: Record<string, string> = {
  'White': '#F8F8F8', 'Ivory White': '#F5F0E8', 'Cream': '#FFFACD', 'Beige': '#F2E2C4',
  'Lemon Yellow': '#FFF44F', 'Yellow': '#FFD700', 'Gold': '#D4AF37',
  'Orange': '#FF8C00', 'Coral': '#FF6B6B',
  'Red': '#DC143C', 'Dark Red': '#8B0000',
  'Pink': '#FF69B4', 'Magenta': '#C71585',
  'Purple': '#7B2D8B', 'Violet': '#8A2BE2',
  'Navy': '#001F5B', 'Dark Blue': '#00008B', 'Blue': '#1E6FCC', 'Sky Blue': '#87CEEB', 'Cyan': '#00BFFF',
  'Teal': '#008080', 'Jade': '#00A36C', 'Bambu Green': '#1DB954', 'Green': '#228B22',
  'Dark Green': '#006400', 'Olive': '#808000', 'Mint': '#98FF98',
  'Brown': '#795548', 'Dark Brown': '#4E2A04',
  'Silver': '#C0C0C0', 'Light Grey': '#D3D3D3', 'Grey': '#808080', 'Dark Grey': '#555555',
  'Charcoal': '#36454F', 'Black': '#1A1A1A',
  'Clear': '#E8F4F8', 'Natural': '#F5E6C8',
};

export default function AddColorModal({ section, onAdd, onClose }: Props) {
  const types = SECTION_TYPES[section];
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#1DB954');
  const [brand, setBrand] = useState('Bambu Lab');
  const [type, setType] = useState<FilamentType>(types[0]);

  const brandColors: BrandColor[] | undefined = getBrandColors(brand);

  function handleNameChange(value: string) {
    setName(value);
    if (NAME_TO_HEX[value]) setHex(NAME_TO_HEX[value]);
  }

  function handleBrandColorPick(bc: BrandColor) {
    setName(bc.name);
    setHex(bc.hex);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), hex, brand.trim() || 'Bambu Lab', type);
    onClose();
  }

  const inputCls = 'w-full bg-gray-700 text-white rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500';

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm border border-gray-700 pb-safe max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center pt-3 sm:hidden sticky top-0 bg-gray-800">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 sticky top-4 sm:top-0 bg-gray-800 z-10">
          <h3 className="text-white font-semibold text-base">Add Color — {section}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
          {/* Brand selector */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Brand</label>
            <input
              list="known-brands"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Bambu Lab"
              className={inputCls}
              style={{ fontSize: '16px' }}
            />
            <datalist id="known-brands">
              {BRAND_NAMES.map((b) => <option key={b} value={b} />)}
            </datalist>
          </div>

          {/* Brand color picker — shown when the selected brand has a catalog */}
          {brandColors && brandColors.length > 0 && (
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                {brand} Colors <span className="text-gray-600">(tap to auto-fill)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {brandColors.map((bc) => (
                  <button
                    key={bc.code}
                    type="button"
                    onClick={() => handleBrandColorPick(bc)}
                    title={`${bc.code} – ${bc.name}`}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs transition-colors ${
                      name === bc.name
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                      style={{ backgroundColor: bc.hex }}
                    />
                    <span className="font-mono text-[10px] text-gray-400">{bc.code}</span>
                    <span>{bc.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type selector */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FilamentType)}
              className={inputCls}
              style={{ fontSize: '16px' }}
            >
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Color name with datalist */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Color Name</label>
            <input
              autoFocus
              list="known-color-names"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Midnight Blue"
              className={inputCls}
              style={{ fontSize: '16px' }}
            />
            <datalist id="known-color-names">
              {KNOWN_COLOR_NAMES.map((n) => <option key={n} value={n} />)}
            </datalist>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-14 h-12 rounded-lg cursor-pointer bg-transparent border-0 flex-shrink-0"
              />
              <input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#1DB954"
                className={`${inputCls} font-mono`}
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          {/* Live preview */}
          <div
            className="h-10 rounded-lg flex items-center justify-center text-xs font-semibold shadow-inner"
            style={{ backgroundColor: hex }}
          >
            <span style={{ mixBlendMode: 'difference', color: 'white' }}>
              {name || 'Preview'}
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 rounded-xl text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors font-semibold"
            >
              Add Color
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
