'use client';

import { useState } from 'react';
import { Pencil, Check, X, Minus, Plus } from 'lucide-react';
import type { FilamentColor } from '@/lib/types';
import { contrastColor } from '@/lib/color-utils';

interface Props {
  filament: FilamentColor;
  editMode: boolean;
  onUpdate: (updated: FilamentColor) => void;
  onDelete: () => void;
}

export default function FilamentCard({ filament, editMode, onUpdate, onDelete }: Props) {
  const [editingBrand, setEditingBrand] = useState(false);
  const [brandDraft, setBrandDraft] = useState(filament.brand);
  const textColor = contrastColor(filament.hex);

  function commitBrand() {
    onUpdate({ ...filament, brand: brandDraft.trim() || filament.brand });
    setEditingBrand(false);
  }

  function cancelBrand() {
    setBrandDraft(filament.brand);
    setEditingBrand(false);
  }

  function adjust(delta: number) {
    const next = Math.max(0, filament.count + delta);
    onUpdate({ ...filament, count: next });
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-white/10 flex flex-col">
      {/* Color swatch */}
      <div
        className="h-20 flex items-center justify-center relative"
        style={{ backgroundColor: filament.hex }}
      >
        <span
          className="text-sm font-semibold px-2 text-center leading-tight"
          style={{ color: textColor }}
        >
          {filament.name}
        </span>
        {editMode && filament.isCustom && (
          <button
            onClick={onDelete}
            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            style={{ color: textColor }}
            title="Remove color"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-800 px-3 py-2 flex flex-col gap-1.5 flex-1">
        {/* Brand */}
        <div className="flex items-center gap-1 min-h-[24px]">
          {editMode && editingBrand ? (
            <>
              <input
                autoFocus
                value={brandDraft}
                onChange={(e) => setBrandDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitBrand(); if (e.key === 'Escape') cancelBrand(); }}
                className="flex-1 bg-gray-700 text-white text-xs rounded px-1.5 py-0.5 outline-none border border-blue-500 min-w-0"
              />
              <button onClick={commitBrand} className="text-green-400 hover:text-green-300"><Check size={13} /></button>
              <button onClick={cancelBrand} className="text-red-400 hover:text-red-300"><X size={13} /></button>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-400 truncate flex-1">{filament.brand}</span>
              {editMode && (
                <button onClick={() => setEditingBrand(true)} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
                  <Pencil size={11} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Spools</span>
          {editMode ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjust(-1)}
                disabled={filament.count === 0}
                className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-white font-bold text-sm w-6 text-center">{filament.count}</span>
              <button
                onClick={() => adjust(1)}
                className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <span className={`font-bold text-sm ${filament.count === 0 ? 'text-gray-600' : 'text-white'}`}>
              {filament.count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
