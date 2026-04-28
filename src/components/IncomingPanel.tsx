'use client';

import { useState } from 'react';
import { PackagePlus, PackageCheck, Pencil, X, Plus } from 'lucide-react';
import type { FilamentColor, FilamentSection } from '@/lib/types';
import { ALL_SECTIONS } from '@/lib/types';
import { contrastColor } from '@/lib/color-utils';
import AddColorModal from './AddColorModal';

interface Props {
  items: FilamentColor[];
  editMode: boolean;
  onReceive: (id: string) => void;
  onUpdate: (id: string, updated: FilamentColor) => void;
  onDelete: (id: string) => void;
  onAdd: (partial: Omit<FilamentColor, 'id' | 'count' | 'status'>) => void;
}

interface EditingItem {
  id: string;
  filament: FilamentColor;
}

export default function IncomingPanel({ items, editMode, onReceive, onUpdate, onDelete, onAdd }: Props) {
  const [addSection, setAddSection] = useState<FilamentSection | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const grouped = ALL_SECTIONS.map((s) => ({
    section: s,
    items: items.filter((f) => f.category === s),
  })).filter((g) => g.items.length > 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <PackagePlus size={40} className="text-gray-700" />
        <div>
          <p className="text-gray-400 text-sm font-medium">No incoming filaments</p>
          <p className="text-gray-600 text-xs mt-1">Add orders you&apos;ve placed but haven&apos;t received yet.</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {ALL_SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setAddSection(s)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-gray-600 hover:border-gray-400 text-gray-500 hover:text-gray-300 transition-colors text-xs"
            >
              <Plus size={13} /> Add {s} filament
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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

                  {/* Actions */}
                  <div className="flex items-center gap-1 pr-3">
                    {editMode && (
                      <>
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
                      </>
                    )}
                    <button
                      onClick={() => onReceive(f.id)}
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

      {addSection && (
        <AddColorModal
          section={addSection}
          onAdd={onAdd}
          onClose={() => setAddSection(null)}
        />
      )}

      {editingItem && (
        <AddColorModal
          filament={editingItem.filament}
          onSave={(updated) => { onUpdate(editingItem.id, updated); setEditingItem(null); }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
