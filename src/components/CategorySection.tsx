'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import type { FilamentColor, FilamentSection, FilamentType, SortMode } from '@/lib/types';
import { SECTION_TYPES } from '@/lib/types';
import { sortByColor } from '@/lib/color-utils';
import FilamentCard from './FilamentCard';
import AddColorModal from './AddColorModal';

interface Props {
  section: FilamentSection;
  filaments: FilamentColor[];
  editMode: boolean;
  showUsed: boolean;
  sortMode: SortMode;
  onUpdate: (id: string, updated: FilamentColor) => void;
  onDelete: (id: string) => void;
  onAdd: (partial: Omit<FilamentColor, 'id' | 'status'>) => void;
}

const SECTION_STYLE: Record<FilamentSection, { bg: string; badge: string; type: string }> = {
  PLA:   { bg: 'from-blue-600/20 to-blue-500/10 border-blue-500/30',      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',      type: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  PETG:  { bg: 'from-emerald-600/20 to-emerald-500/10 border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', type: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  Other: { bg: 'from-purple-600/20 to-purple-500/10 border-purple-500/30', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', type: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

function sortFilaments(filaments: FilamentColor[], sortMode: SortMode, showUsed: boolean) {
  if (showUsed) return [...filaments].sort((a, b) => (b.usedCount ?? 0) - (a.usedCount ?? 0) || a.name.localeCompare(b.name));
  return sortMode === 'color'
    ? sortByColor(filaments)
    : [...filaments].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default function CategorySection({
  section, filaments, editMode, showUsed, sortMode, onUpdate, onDelete, onAdd,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const style = SECTION_STYLE[section];

  const total = filaments.reduce((s, f) => s + f.count, 0);
  const totalUsed = filaments.reduce((s, f) => s + (f.usedCount ?? 0), 0);
  const inStock = filaments.filter((f) => f.count > 0).length;
  const inUse = filaments.filter((f) => f.status !== 'sealed').length;

  // Group filaments by type, preserving SECTION_TYPES order
  const types = SECTION_TYPES[section];
  const groups: { type: FilamentType; items: FilamentColor[] }[] = types
    .map((t) => ({ type: t, items: filaments.filter((f) => f.type === t) }))
    .filter((g) => g.items.length > 0);

  // Custom colors without a standard type bucket
  const customOnly = filaments.filter(
    (f) => f.isCustom && !types.includes(f.type)
  );
  if (customOnly.length > 0) {
    groups.push({ type: 'Other' as FilamentType, items: customOnly });
  }

  return (
    <section className={`rounded-2xl border bg-gradient-to-br ${style.bg} p-3 sm:p-4`}>
      {/* Section header */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none mb-3 sm:mb-4"
        onClick={() => setCollapsed((c) => !c)}
      >
        <button className="text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1">
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
        <h2 className="text-white text-lg sm:text-xl font-bold flex-1">{section}</h2>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
            {showUsed
              ? `${filaments.length} colors · ${totalUsed} used`
              : `${inStock}/${filaments.length} · ${total} spools`}
          </span>
          {inUse > 0 && (
            <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
              {inUse} in use
            </span>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-4">
          {groups.map(({ type, items }) => (
            <div key={type}>
              {/* Type sub-header */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.type}`}>
                  {(() => {
                    const i = type.indexOf(' ');
                    if (i === -1) return type;
                    return (
                      <>
                        <span className="opacity-50 font-medium">{type.slice(0, i)}</span>
                        {' '}
                        <span>{type.slice(i + 1)}</span>
                      </>
                    );
                  })()}
                </span>
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-gray-500">
                  {items.filter((f) => f.count > 0).length}/{items.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                {sortFilaments(items, sortMode, showUsed).map((f) => (
                  <FilamentCard
                    key={f.id}
                    filament={f}
                    editMode={editMode}
                    showUsed={showUsed}
                    onUpdate={(updated) => onUpdate(f.id, updated)}
                    onDelete={() => onDelete(f.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {editMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="self-start flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-gray-600 hover:border-gray-400 text-gray-500 hover:text-gray-300 transition-colors text-xs active:scale-95"
            >
              <Plus size={14} /> Add Color to {section}
            </button>
          )}
        </div>
      )}

      {showAddModal && (
        <AddColorModal
          section={section}
          onAdd={onAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </section>
  );
}
