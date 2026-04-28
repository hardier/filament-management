'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ImagePlus, Trash2 } from 'lucide-react';
import type { FilamentSection, FilamentType, FilamentColor, FilamentStatus } from '@/lib/types';
import { SECTION_TYPES, ALL_SECTIONS, STATUS_CYCLE } from '@/lib/types';
import { KNOWN_COLOR_NAMES } from '@/lib/bambu-colors';
import { KNOWN_BRAND_NAMES, getBrandColors, loadBrandCatalog, type BrandColor, type BrandCatalog } from '@/lib/brands';

interface AddProps {
  section: FilamentSection;
  onAdd: (color: Omit<FilamentColor, 'id' | 'count' | 'status'>) => void;
  onClose: () => void;
  filament?: undefined;
  onSave?: undefined;
}

interface EditProps {
  filament: FilamentColor;
  onSave: (updated: FilamentColor) => void;
  onClose: () => void;
  section?: undefined;
  onAdd?: undefined;
}

type Props = AddProps | EditProps;

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

const STATUS_LABELS: Record<FilamentStatus, string> = {
  sealed: 'Sealed (unopened)',
  high:   'High',
  medium: 'Medium',
  low:    'Low',
};

async function resizeToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const MAX = 400;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > MAX || h > MAX) {
        const r = Math.min(MAX / w, MAX / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export default function AddColorModal(props: Props) {
  const isEdit = Boolean(props.filament);
  const f = props.filament;

  const initSection: FilamentSection = f?.category ?? props.section!;
  const [section, setSection] = useState<FilamentSection>(initSection);
  const types = SECTION_TYPES[section];

  const [name, setName] = useState(f?.name ?? '');
  const [hex, setHex] = useState(f?.hex ?? '#1DB954');
  const [type, setType] = useState<FilamentType>(f?.type ?? types[0]);
  const [count, setCount] = useState(f?.count ?? 1);
  const [status, setStatus] = useState<FilamentStatus>(f?.status ?? 'sealed');
  const [code, setCode] = useState(f?.code ?? '');
  const [imageSrc, setImageSrc] = useState<string | undefined>(f?.imageSrc);
  const [catalog, setCatalog] = useState<BrandCatalog | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  // Brand state
  const initBrand = f?.brand ?? 'Bambu Lab';
  const isKnown = KNOWN_BRAND_NAMES.includes(initBrand);
  const [brand, setBrand] = useState(isKnown ? initBrand : '__other__');
  const [customBrand, setCustomBrand] = useState(isKnown ? '' : initBrand);
  const isOtherBrand = brand === '__other__';
  const effectiveBrand = isOtherBrand ? customBrand : brand;

  // Keep type valid when section changes
  useEffect(() => {
    if (!SECTION_TYPES[section].includes(type)) {
      setType(SECTION_TYPES[section][0]);
    }
  }, [section, type]);

  useEffect(() => {
    loadBrandCatalog().then(setCatalog);
  }, []);

  const brandColors: BrandColor[] | undefined = getBrandColors(effectiveBrand, catalog);

  // Global paste listener
  useEffect(() => {
    async function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) setImageSrc(await resizeToDataUrl(blob));
          break;
        }
      }
    }
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImageSrc(await resizeToDataUrl(file));
    e.target.value = '';
  }

  function handleNameChange(value: string) {
    setName(value);
    if (NAME_TO_HEX[value]) setHex(NAME_TO_HEX[value]);
  }

  function handleBrandColorPick(bc: BrandColor) {
    setName(bc.name);
    setHex(bc.hex);
    setCode(bc.code ?? '');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const finalBrand = effectiveBrand.trim() || 'Bambu Lab';

    const codeVal = code.trim() || undefined;
    if (isEdit && f && props.onSave) {
      props.onSave({
        ...f,
        name: name.trim(),
        hex,
        code: codeVal,
        category: section,
        type,
        brand: finalBrand,
        count,
        status,
        ...(imageSrc ? { imageSrc } : { imageSrc: undefined }),
      });
    } else if (!isEdit && props.onAdd) {
      props.onAdd({
        name: name.trim(),
        hex,
        code: codeVal,
        category: section,
        type,
        brand: finalBrand,
        isCustom: true,
        ...(imageSrc ? { imageSrc } : {}),
      });
    }
    props.onClose();
  }

  const inputCls = 'w-full bg-gray-700 text-white rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500';

  const title = isEdit ? `Edit — ${f!.name}` : `Add Color — ${props.section}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}
    >
      <div className="bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm border border-gray-700 pb-safe max-h-[92vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-white font-semibold text-base">{title}</h3>
          <button onClick={props.onClose} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4 overflow-y-auto">

          {/* Section selector — edit mode only */}
          {isEdit && (
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Section</label>
              <div className="flex gap-2">
                {ALL_SECTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSection(s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors border ${
                      section === s
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brand selector */}
          <div className="flex flex-col gap-2">
            <label className="block text-xs text-gray-400">Brand</label>
            <select
              value={brand}
              onChange={(e) => { setBrand(e.target.value); setCustomBrand(''); }}
              className={inputCls}
              style={{ fontSize: '16px' }}
            >
              {KNOWN_BRAND_NAMES.map((b) => <option key={b} value={b}>{b}</option>)}
              <option value="__other__">Other…</option>
            </select>
            {isOtherBrand && (
              <input
                autoFocus
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="Enter brand name"
                className={inputCls}
                style={{ fontSize: '16px' }}
              />
            )}
          </div>

          {/* Brand color picker */}
          {brandColors && brandColors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-gray-400">
                  {effectiveBrand} Colors <span className="text-gray-600">(tap to pick)</span>
                </label>
                {name && brandColors.some((bc) => bc.name === name) && (
                  <span className="flex items-center gap-1 text-xs text-white font-medium">
                    <span className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0" style={{ backgroundColor: hex }} />
                    {name}
                    {code && <span className="font-mono text-[10px] text-gray-400">{code}</span>}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {brandColors.map((bc) => {
                  const selected = name === bc.name;
                  return (
                    <button
                      key={bc.code ?? bc.name}
                      type="button"
                      onClick={() => handleBrandColorPick(bc)}
                      title={`${bc.code ? bc.code + ' – ' : ''}${bc.name}`}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs transition-colors ${
                        selected
                          ? 'border-blue-400 bg-blue-500/20 text-white ring-1 ring-blue-400'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20" style={{ backgroundColor: bc.hex }} />
                      {bc.code && <span className="font-mono text-[10px] text-gray-400">{bc.code}</span>}
                      <span>{bc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Type selector */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Type</label>
            <select
              value={types.includes(type) ? type : types[0]}
              onChange={(e) => setType(e.target.value as FilamentType)}
              className={inputCls}
              style={{ fontSize: '16px' }}
            >
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Color name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Color Name</label>
            <input
              autoFocus={!isEdit}
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

          {/* Color code */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Color Code <span className="text-gray-600">(optional — e.g. RB001, PA02001)</span>
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. RB001"
              className={`${inputCls} font-mono`}
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Hex Color</label>
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

          {/* Count + status — edit mode only */}
          {isEdit && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1.5">Spools</label>
                <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setCount((c) => Math.max(0, c - 1))}
                    disabled={count === 0}
                    className="w-7 h-7 rounded bg-gray-600 hover:bg-gray-500 disabled:opacity-30 flex items-center justify-center text-white text-lg font-bold transition-colors"
                  >−</button>
                  <span className="flex-1 text-center text-white font-bold">{count}</span>
                  <button
                    type="button"
                    onClick={() => setCount((c) => c + 1)}
                    className="w-7 h-7 rounded bg-gray-600 hover:bg-gray-500 flex items-center justify-center text-white text-lg font-bold transition-colors"
                  >+</button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1.5">In-use Level</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FilamentStatus)}
                  className={inputCls}
                  style={{ fontSize: '16px' }}
                >
                  {STATUS_CYCLE.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Thumbnail image */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Thumbnail <span className="text-gray-600">(optional — upload or paste)</span>
            </label>
            {imageSrc ? (
              <div className="relative rounded-lg overflow-hidden h-24 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="thumbnail" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageSrc(undefined)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
                  title="Remove image"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-16 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-400 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-xs"
              >
                <ImagePlus size={16} />
                Upload or paste an image
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview */}
          <div
            className="h-12 rounded-lg flex items-center justify-center text-xs font-semibold shadow-inner overflow-hidden relative"
            style={imageSrc
              ? { backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundColor: hex }
            }
          >
            {imageSrc && <div className="absolute inset-0 bg-black/30" />}
            <span className="relative" style={{ mixBlendMode: imageSrc ? undefined : 'difference', color: 'white', textShadow: imageSrc ? '0 1px 3px rgba(0,0,0,0.8)' : undefined }}>
              {name || 'Preview'}
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={props.onClose}
              className="flex-1 py-3 rounded-xl text-sm text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 rounded-xl text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors font-semibold"
            >
              {isEdit ? 'Save Changes' : 'Add Color'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
