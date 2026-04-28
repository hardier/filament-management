'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ImagePlus, Loader2, Trash2, ChevronDown, ChevronUp, ScanLine } from 'lucide-react';
import type { FilamentColor, FilamentSection, FilamentType } from '@/lib/types';
import { ALL_SECTIONS, SECTION_TYPES } from '@/lib/types';
import { KNOWN_BRAND_NAMES } from '@/lib/brands';

interface Props {
  onAdd: (items: Omit<FilamentColor, 'id' | 'status'>[]) => void;
  onClose: () => void;
}

interface ParsedItem {
  _id: string;
  brand: string;
  name: string;
  code: string;
  section: FilamentSection;
  type: FilamentType;
  hex: string;
  count: number;
  imageSrc?: string;
  expanded: boolean;
}

// ─── helpers ───────────────────────────────────────────────────────────────

function mapSection(material: string): FilamentSection {
  if (/PETG/i.test(material)) return 'PETG';
  if (/PLA/i.test(material)) return 'PLA';
  if (/ABS|ASA|TPU/i.test(material)) return 'Other';
  return 'PLA';
}

function mapType(section: FilamentSection, subtype: string, material: string): FilamentType {
  const s = subtype.toLowerCase();
  if (section === 'PLA') {
    if (/silk/i.test(s)) return 'PLA Silk';
    if (/matte/i.test(s)) return 'PLA Matte';
    if (/luminous|glow/i.test(s)) return 'PLA Luminous';
    if (/sparkle|glitter/i.test(s)) return 'PLA Sparkle';
    if (/trans/i.test(s)) return 'PLA Translucent';
    return 'PLA Basic';
  }
  if (section === 'PETG') {
    if (/cf|carbon/i.test(s)) return 'PETG-CF';
    if (/hf|high.?flow/i.test(s)) return 'PETG HF';
    if (/trans/i.test(s)) return 'PETG Translucent';
    if (/luminous/i.test(s)) return 'PETG Luminous';
    return 'PETG Basic';
  }
  if (/ABS-GF/i.test(material)) return 'ABS-GF';
  if (/ABS/i.test(material)) return 'ABS';
  if (/ASA/i.test(material)) return 'ASA';
  if (/TPU/i.test(material)) return 'TPU 95A';
  return 'Other';
}

async function cropThumbnail(
  dataUrl: string,
  box: { x: number; y: number; w: number; h: number },
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth, H = img.naturalHeight;
      const sx = Math.round(box.x * W);
      const sy = Math.round(box.y * H);
      const sw = Math.round(box.w * W);
      const sh = Math.round(box.h * H);
      const size = Math.min(400, Math.max(sw, sh));
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      // centre-crop to square
      const scale = size / Math.max(sw, sh);
      const dw = sw * scale, dh = sh * scale;
      const dx = (size - dw) / 2, dy = (size - dh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = dataUrl;
  });
}

async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/png';
      resolve({ base64, mimeType, dataUrl });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── main component ─────────────────────────────────────────────────────────

type Phase = 'upload' | 'parsing' | 'review';

export default function ImportModal({ onAdd, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('upload');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMime, setImageMime] = useState<string>('image/png');
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [error, setError] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── paste support ──
  useEffect(() => {
    async function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) await loadFile(blob as File);
          break;
        }
      }
    }
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFile = useCallback(async (file: File) => {
    try {
      const { base64, mimeType, dataUrl } = await fileToBase64(file);
      setImageBase64(base64);
      setImageMime(mimeType);
      setImageDataUrl(dataUrl);
      setError('');
    } catch {
      setError('Failed to load image.');
    }
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await loadFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) loadFile(file);
  }

  async function handleParse() {
    if (!imageBase64) return;
    setPhase('parsing');
    setError('');

    try {
      const res = await fetch('/api/parse-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType: imageMime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Parse failed');

      const rawItems: Array<{
        brand: string; name: string; code: string;
        material: string; subtype: string; hex: string; count: number;
        thumbnailBox?: { x: number; y: number; w: number; h: number };
      }> = data.items ?? [];

      const parsed: ParsedItem[] = await Promise.all(
        rawItems.map(async (r, i) => {
          const section = mapSection(r.material);
          const type = mapType(section, r.subtype, r.material);
          let imageSrc: string | undefined;
          if (r.thumbnailBox && imageDataUrl) {
            try { imageSrc = await cropThumbnail(imageDataUrl, r.thumbnailBox); } catch { /* ignore */ }
          }
          return {
            _id: `import-${Date.now()}-${i}`,
            brand: KNOWN_BRAND_NAMES.find((b) => b.toLowerCase() === r.brand.toLowerCase()) ?? r.brand,
            name: r.name,
            code: r.code ?? '',
            section,
            type,
            hex: /^#[0-9a-fA-F]{6}$/.test(r.hex) ? r.hex : '#888888',
            count: Math.max(1, Number(r.count) || 1),
            imageSrc,
            expanded: false,
          };
        })
      );

      setItems(parsed);
      setPhase('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setPhase('upload');
    }
  }

  function updateItem(id: string, patch: Partial<ParsedItem>) {
    setItems((prev) => prev.map((it) => it._id === id ? { ...it, ...patch } : it));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it._id !== id));
  }

  function handleConfirm() {
    const toAdd: Omit<FilamentColor, 'id' | 'status'>[] = items.map((it) => ({
      name: it.name.trim() || 'Unknown',
      hex: it.hex,
      code: it.code.trim() || undefined,
      category: it.section,
      type: it.type,
      brand: it.brand.trim() || 'Unknown',
      count: it.count,
      isCustom: true,
      ...(it.imageSrc ? { imageSrc: it.imageSrc } : {}),
    }));
    onAdd(toAdd);
    onClose();
  }

  const inputCls = 'w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500';

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg border border-gray-700 pb-safe max-h-[95vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-blue-400" />
            <h3 className="text-white font-semibold text-base">
              {phase === 'upload' ? 'Import from Screenshot' :
               phase === 'parsing' ? 'Analyzing…' :
               `${items.length} item${items.length !== 1 ? 's' : ''} found`}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Upload phase ── */}
          {phase === 'upload' && (
            <div className="px-5 py-5 flex flex-col gap-4">
              <p className="text-xs text-gray-400">
                Take a screenshot of your purchase history (Taobao, Amazon, etc.) — supports Chinese and English. Paste it here or upload a file.
              </p>

              {imageDataUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageDataUrl} alt="screenshot" className="w-full max-h-48 object-contain bg-gray-900" />
                  <button
                    onClick={() => { setImageDataUrl(''); setImageBase64(''); }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                    dragging ? 'border-blue-400 bg-blue-500/10' : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <ImagePlus size={28} className="text-gray-500" />
                  <span className="text-sm text-gray-500">Click, drag, or paste (⌘V) a screenshot</span>
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                onClick={handleParse}
                disabled={!imageDataUrl}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-colors flex items-center justify-center gap-2"
              >
                <ScanLine size={16} />
                Scan with AI
              </button>
            </div>
          )}

          {/* ── Parsing phase ── */}
          {phase === 'parsing' && (
            <div className="px-5 py-8 flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageDataUrl} alt="screenshot" className="w-full max-h-40 object-contain rounded-xl border border-white/10 bg-gray-900" />
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Loader2 size={20} className="animate-spin text-blue-400" />
                Identifying filaments…
              </div>
            </div>
          )}

          {/* ── Review phase ── */}
          {phase === 'review' && (
            <div className="px-5 py-4 flex flex-col gap-3">
              {items.length === 0 && (
                <div className="text-center text-gray-500 py-8 text-sm">
                  No filament items detected.
                  <button onClick={() => setPhase('upload')} className="block mx-auto mt-2 text-blue-400 hover:text-blue-300">Try another screenshot</button>
                </div>
              )}

              {items.map((item) => (
                <div key={item._id} className="rounded-xl border border-gray-700 bg-gray-750 overflow-hidden">
                  {/* Item summary row */}
                  <div className="flex items-center gap-3 p-3">
                    {/* Thumbnail */}
                    <div
                      className="w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden border border-white/10"
                      style={item.imageSrc
                        ? { backgroundImage: `url(${item.imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : { backgroundColor: item.hex }}
                    />

                    {/* Core info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.code && (
                          <span className="font-mono text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600">
                            {item.code}
                          </span>
                        )}
                        <span className="text-white text-sm font-semibold truncate">{item.name || '(unnamed)'}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.brand} · {item.type} · {item.count} spool{item.count !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => updateItem(item._id, { expanded: !item.expanded })}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                        title="Edit details"
                      >
                        {item.expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded editing */}
                  {item.expanded && (
                    <div className="border-t border-gray-700 px-3 pb-3 pt-3 grid grid-cols-2 gap-2">
                      {/* Brand */}
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500 mb-1 block">Brand</label>
                        <select
                          value={KNOWN_BRAND_NAMES.includes(item.brand) ? item.brand : '__other__'}
                          onChange={(e) => updateItem(item._id, { brand: e.target.value === '__other__' ? item.brand : e.target.value })}
                          className={inputCls}
                        >
                          {KNOWN_BRAND_NAMES.map((b) => <option key={b} value={b}>{b}</option>)}
                          <option value="__other__">Other ({item.brand})</option>
                        </select>
                      </div>

                      {/* Code */}
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1 block">Color Code</label>
                        <input
                          value={item.code}
                          onChange={(e) => updateItem(item._id, { code: e.target.value })}
                          placeholder="e.g. RB001"
                          className={`${inputCls} font-mono`}
                        />
                      </div>

                      {/* Count */}
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1 block">Spools</label>
                        <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                          <button type="button" onClick={() => updateItem(item._id, { count: Math.max(1, item.count - 1) })}
                            className="text-gray-300 hover:text-white font-bold text-base w-5 text-center">−</button>
                          <span className="flex-1 text-center text-white font-bold text-sm">{item.count}</span>
                          <button type="button" onClick={() => updateItem(item._id, { count: item.count + 1 })}
                            className="text-gray-300 hover:text-white font-bold text-base w-5 text-center">+</button>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500 mb-1 block">Color Name</label>
                        <input
                          value={item.name}
                          onChange={(e) => updateItem(item._id, { name: e.target.value })}
                          placeholder="Color name"
                          className={inputCls}
                        />
                      </div>

                      {/* Section */}
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1 block">Section</label>
                        <div className="flex gap-1">
                          {ALL_SECTIONS.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                const newType = SECTION_TYPES[s][0];
                                updateItem(item._id, { section: s, type: newType });
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium border transition-colors ${
                                item.section === s
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : 'bg-gray-700 border-gray-600 text-gray-400 hover:text-white'
                              }`}
                            >{s}</button>
                          ))}
                        </div>
                      </div>

                      {/* Type */}
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1 block">Type</label>
                        <select
                          value={item.type}
                          onChange={(e) => updateItem(item._id, { type: e.target.value as FilamentType })}
                          className={inputCls}
                        >
                          {SECTION_TYPES[item.section].map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      {/* Hex */}
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500 mb-1 block">Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={item.hex}
                            onChange={(e) => updateItem(item._id, { hex: e.target.value })}
                            className="w-10 h-9 rounded-lg cursor-pointer bg-transparent border-0 flex-shrink-0"
                          />
                          <input
                            value={item.hex}
                            onChange={(e) => updateItem(item._id, { hex: e.target.value })}
                            className={`${inputCls} font-mono`}
                            maxLength={7}
                          />
                        </div>
                      </div>

                      {/* Thumbnail replace */}
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500 mb-1 block">Thumbnail</label>
                        <div className="flex items-center gap-2">
                          {item.imageSrc && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10"
                              style={{ backgroundImage: `url(${item.imageSrc})`, backgroundSize: 'cover' }} />
                          )}
                          <label className="flex-1 h-9 rounded-lg border border-dashed border-gray-600 hover:border-gray-400 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                            <ImagePlus size={13} />
                            Replace photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const { dataUrl } = await fileToBase64(f);
                                updateItem(item._id, { imageSrc: dataUrl });
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {items.length > 0 && (
                <div className="pt-1 text-xs text-gray-500 text-center">
                  Expand any row to edit · tap the thumbnail to replace
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {phase === 'review' && items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-700 flex gap-2 flex-shrink-0">
            <button
              onClick={() => setPhase('upload')}
              className="px-4 py-3 rounded-xl text-sm text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Add {items.length} item{items.length !== 1 ? 's' : ''} to inventory
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
