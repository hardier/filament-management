'use client';

import { useState } from 'react';
import { Pencil, Check, X, Minus, Plus } from 'lucide-react';
import type { FilamentColor, FilamentStatus } from '@/lib/types';
import { STATUS_CYCLE } from '@/lib/types';
import { contrastColor } from '@/lib/color-utils';

interface Props {
  filament: FilamentColor;
  editMode: boolean;
  onUpdate: (updated: FilamentColor) => void;
  onDelete: () => void;
}

const STATUS_META: Record<FilamentStatus, { label: string; filled: number; bar: string; badge: string }> = {
  sealed:  { label: 'Sealed',  filled: 0, bar: 'bg-gray-400',   badge: 'bg-gray-700 text-gray-400 border-gray-600' },
  high:    { label: 'High',    filled: 3, bar: 'bg-green-400',  badge: 'bg-green-900/60 text-green-300 border-green-600/50' },
  medium:  { label: 'Medium',  filled: 2, bar: 'bg-yellow-400', badge: 'bg-yellow-900/60 text-yellow-300 border-yellow-600/50' },
  low:     { label: 'Low',     filled: 1, bar: 'bg-red-400',    badge: 'bg-red-900/60 text-red-300 border-red-600/50' },
};

function StatusIndicator({ status, editable, onCycle }: {
  status: FilamentStatus;
  editable: boolean;
  onCycle: () => void;
}) {
  const meta = STATUS_META[status];
  const bars = [0, 1, 2].map((i) => (
    <span
      key={i}
      className={`inline-block w-2.5 h-1.5 rounded-sm ${i < meta.filled ? meta.bar : 'bg-gray-600'}`}
    />
  ));

  if (status === 'sealed' && !editable) return null;

  return (
    <button
      type="button"
      disabled={!editable}
      onClick={onCycle}
      title={editable ? `In-use level: ${meta.label} (tap to change)` : meta.label}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium leading-none transition-colors
        ${meta.badge}
        ${editable ? 'cursor-pointer hover:opacity-80 active:scale-95' : 'cursor-default'}`}
    >
      <span className="flex gap-0.5">{bars}</span>
      <span>{meta.label}</span>
    </button>
  );
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

  function cycleStatus() {
    const idx = STATUS_CYCLE.indexOf(filament.status ?? 'sealed');
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onUpdate({ ...filament, status: next });
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-white/10 flex flex-col">
      {/* Color swatch */}
      <div
        className="h-24 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: filament.hex }}
      >
        {/* Color name */}
        <span
          className="text-xs font-bold px-2 text-center leading-tight"
          style={{ color: textColor }}
        >
          {filament.name}
        </span>

        {/* Brand badge — always visible at bottom of swatch */}
        {!editMode || !editingBrand ? (
          <div
            className="absolute bottom-0 inset-x-0 flex items-center justify-between px-2 py-1"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)' }}
          >
            <span className="text-[11px] font-semibold text-white/90 truncate flex-1 leading-none">
              {filament.brand}
            </span>
            {editMode && (
              <button
                onClick={() => setEditingBrand(true)}
                className="flex-shrink-0 ml-1 text-white/60 hover:text-white transition-colors"
              >
                <Pencil size={10} />
              </button>
            )}
          </div>
        ) : (
          /* Inline brand editor overlaid on swatch */
          <div className="absolute bottom-0 inset-x-0 flex items-center gap-1 px-1.5 pb-1.5 pt-4"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
          >
            <input
              autoFocus
              value={brandDraft}
              onChange={(e) => setBrandDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitBrand(); if (e.key === 'Escape') cancelBrand(); }}
              className="flex-1 bg-black/40 text-white text-xs rounded px-1.5 py-0.5 outline-none border border-white/40 min-w-0"
              style={{ fontSize: '16px' }}
            />
            <button onClick={commitBrand} className="text-green-300 hover:text-green-200 p-0.5"><Check size={12} /></button>
            <button onClick={cancelBrand} className="text-red-300 hover:text-red-200 p-0.5"><X size={12} /></button>
          </div>
        )}

        {editMode && filament.isCustom && (
          <button
            onClick={onDelete}
            className="absolute top-1 right-1 p-1 rounded-full bg-black/25 hover:bg-black/50 transition-colors text-white/70 hover:text-white"
            title="Remove color"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-800 px-2.5 py-2 flex flex-col gap-1.5 flex-1">
        {/* Count */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500">Spools</span>
          {editMode ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjust(-1)}
                disabled={filament.count === 0}
                className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-white font-bold text-sm w-6 text-center">{filament.count}</span>
              <button
                onClick={() => adjust(1)}
                className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
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

        {/* Status */}
        <div className="flex items-center min-h-[20px]">
          <StatusIndicator
            status={filament.status ?? 'sealed'}
            editable={editMode}
            onCycle={cycleStatus}
          />
          {!editMode && filament.status === 'sealed' && (
            <span className="text-[10px] text-gray-600">Sealed</span>
          )}
        </div>
      </div>
    </div>
  );
}
