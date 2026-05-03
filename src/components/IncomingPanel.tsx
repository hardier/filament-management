'use client';

import { useState } from 'react';
import { PackagePlus, PackageCheck, Pencil, X, Plus, Minus } from 'lucide-react';
import type { FilamentColor, FilamentSection } from '@/lib/types';
import { ALL_SECTIONS } from '@/lib/types';
import { contrastColor } from '@/lib/color-utils';
import AddColorModal from './AddColorModal';

interface Props {
  items: FilamentColor[];
  editMode: boolean;
  onReceive: (id: string, count: number) => void;
  onUpdate: (id: string, updated: FilamentColor) => void;
  onDelete: (id: string) => void;
  onAdd: (partial: Omit<FilamentColor, 'id' | 'status'>) => void;
}

interface EditingItem {
  id: string;
  filament: FilamentColor;
}

export default function IncomingPanel({ items, editMode, onReceive, onUpdate, onDelete, onAdd }: Props) {
  const [addSection, setAddSection] = useState<FilamentSection | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [receivingItem, setReceivingItem] = useState<FilamentColor | null>(null);
  const [receiveCount, setReceiveCount] = useState(1);

  function openReceiveDialog(f: FilamentColor) {
    setReceivingItem(f);
    setReceiveCount(f.count);
  }

  function confirmReceive() {
    if (!receivingItem) return;
    onReceive(receivingItem.id, receiveCount);
    setReceivingItem(null);
  }

  const grouped = ALL_SECTIONS.map((s) => ({
    section: s,
    items: items.filter((f) => f.category === s),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <PackagePlus size={40} className="text-gray-700" />
          <div>
            <p className="text-gray-400 text-sm font-medium">No incoming filaments</p>
            <p className="text-gray-600 text-xs mt-1">Add orders you&apos;ve placed but haven&apos;t received yet.</p>
          </div>
        </div>
      )}

      {grouped.map(({ section, items: sectionItems }) => (
        <div key={section}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              {section}
            </span>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] text-gray-600">{sectionItems.length}</span>
          </div>

          <div className="flex flex-col gap-2">
            {sectionItems.map((f) => {
              const hasImage = Boolean(f.imageSrc);
              const textColor = hasImage ? '#ffffff' : contrastColor(f.hex);
              return (
                <div
                  key={f.id}
                  className="flex items-center gap-3 bg-gray-800 rounded-xl border border-white/10 overflow-hidden"
                >
                  {/* Color swatch */}
                  <div
                    className="w-14 h-14 flex-shrink-0 flex items-center justify-center relative"
                    style={
                      hasImage
                        ? { backgroundImage: `url(${f.imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : { backgroundColor: f.hex }
                    }
                  >
                    {f.code && (
                      <span
                        className="absolute bottom-0.5 left-0 right-0 text-center font-mono text-[8px] leading-none px-0.5 text-white/70"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
                      >
                        {f.code}
                      </span>
                    )}
                    {!hasImage && !f.code && (
                      <span
                        className="text-[10px] font-bold text-center px-1 leading-tight"
                        style={{ color: textColor }}
                      >
                        {f.name.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-white text-sm font-semibold truncate">{f.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {f.brand} · {f.type}
                    </div>
                    <div className="text-xs text-indigo-400 mt-0.5">
                      {f.count} spool{f.count !== 1 ? 's' : ''} ordered
                    </div>
                  </div>

                  {/* Actions — always visible for incoming items */}
                  <div className="flex items-center gap-1 pr-3">
                    <button
                      onClick={() => setEditingItem({ id: f.id, filament: f })}
                      className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(f.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Remove"
                    >
                      <X size={13} />
                    </button>
                    <button
                      onClick={() => openReceiveDialog(f)}
                      title="Mark as received — move to inventory"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30 transition-colors"
                    >
                      <PackageCheck size={13} />
                      Received
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Add buttons */}
      <div className="flex gap-2 flex-wrap pt-1">
        {ALL_SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setAddSection(s)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-gray-600 hover:border-gray-400 text-gray-500 hover:text-gray-300 transition-colors text-xs active:scale-95"
          >
            <Plus size={13} /> Add {s}
          </button>
        ))}
      </div>

      {/* Add modal — showCount so user can specify how many were ordered */}
      {addSection && (
        <AddColorModal
          section={addSection}
          showCount
          onAdd={onAdd}
          onClose={() => setAddSection(null)}
        />
      )}

      {/* Edit modal */}
      {editingItem && (
        <AddColorModal
          filament={editingItem.filament}
          onSave={(updated) => { onUpdate(editingItem.id, updated); setEditingItem(null); }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Receive-quantity dialog */}
      {receivingItem && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setReceivingItem(null); }}
        >
          <div className="bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-xs border border-gray-700 pb-safe">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-600" />
            </div>

            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/10"
                  style={
                    receivingItem.imageSrc
                      ? { backgroundImage: `url(${receivingItem.imageSrc})`, backgroundSize: 'cover' }
                      : { backgroundColor: receivingItem.hex }
                  }
                />
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{receivingItem.name}</p>
                  <p className="text-gray-400 text-xs truncate">{receivingItem.brand} · {receivingItem.type}</p>
                </div>
                <button
                  onClick={() => setReceivingItem(null)}
                  className="ml-auto text-gray-500 hover:text-white p-1 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Count picker */}
              <div>
                <p className="text-xs text-gray-400 mb-2">
                  How many spools did you receive?
                  <span className="text-gray-600 ml-1">({receivingItem.count} ordered)</span>
                </p>
                <div className="flex items-center gap-3 bg-gray-700 rounded-xl px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setReceiveCount((c) => Math.max(1, c - 1))}
                    disabled={receiveCount <= 1}
                    className="w-9 h-9 rounded-lg bg-gray-600 hover:bg-gray-500 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 text-center text-white font-bold text-xl">{receiveCount}</span>
                  <button
                    type="button"
                    onClick={() => setReceiveCount((c) => Math.min(receivingItem.count, c + 1))}
                    disabled={receiveCount >= receivingItem.count}
                    className="w-9 h-9 rounded-lg bg-gray-600 hover:bg-gray-500 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remainder hint */}
                {receiveCount < receivingItem.count && (
                  <p className="text-xs text-indigo-400 mt-2 text-center">
                    {receivingItem.count - receiveCount} spool{receivingItem.count - receiveCount !== 1 ? 's' : ''} will remain in Incoming
                  </p>
                )}
                {receiveCount === receivingItem.count && (
                  <p className="text-xs text-green-400 mt-2 text-center">
                    All {receiveCount} spool{receiveCount !== 1 ? 's' : ''} moved to inventory
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReceivingItem(null)}
                  className="flex-1 py-3 rounded-xl text-sm text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmReceive}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <PackageCheck size={15} />
                  Receive {receiveCount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
