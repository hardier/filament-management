'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import type { FilamentColor, FilamentCategory, SortMode } from '@/lib/types';
import { sortByColor } from '@/lib/color-utils';
import FilamentCard from './FilamentCard';
import AddColorModal from './AddColorModal';

interface Props {
  category: FilamentCategory;
  filaments: FilamentColor[];
  editMode: boolean;
  sortMode: SortMode;
  onUpdate: (id: string, updated: FilamentColor) => void;
  onDelete: (id: string) => void;
  onAdd: (name: string, hex: string, brand: string) => void;
}

const CATEGORY_COLORS: Record<FilamentCategory, string> = {
  PLA: 'from-blue-600/20 to-blue-500/10 border-blue-500/30',
  PETG: 'from-emerald-600/20 to-emerald-500/10 border-emerald-500/30',
  Other: 'from-purple-600/20 to-purple-500/10 border-purple-500/30',
};

const BADGE_COLORS: Record<FilamentCategory, string> = {
  PLA: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  PETG: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  Other: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
};

export default function CategorySection({
  category, filaments, editMode, sortMode, onUpdate, onDelete, onAdd,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const sorted = sortMode === 'color'
    ? sortByColor(filaments)
    : [...filaments].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const total = filaments.reduce((s, f) => s + f.count, 0);
  const inStock = filaments.filter((f) => f.count > 0).length;

  return (
    <section className={`rounded-2xl border bg-gradient-to-br ${CATEGORY_COLORS[category]} p-4`}>
      {/* Header */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none mb-4"
        onClick={() => setCollapsed((c) => !c)}
      >
        <button className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
          {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>
        <h2 className="text-white text-xl font-bold flex-1">{category}</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${BADGE_COLORS[category]}`}>
          {inStock}/{filaments.length} colors · {total} spools
        </span>
      </div>

      {!collapsed && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {sorted.map((f) => (
              <FilamentCard
                key={f.id}
                filament={f}
                editMode={editMode}
                onUpdate={(updated) => onUpdate(f.id, updated)}
                onDelete={() => onDelete(f.id)}
              />
            ))}

            {editMode && (
              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-xl border-2 border-dashed border-gray-600 hover:border-gray-400 h-full min-h-[120px] flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Plus size={24} />
                <span className="text-xs">Add Color</span>
              </button>
            )}
          </div>

          {showAddModal && (
            <AddColorModal
              category={category}
              onAdd={onAdd}
              onClose={() => setShowAddModal(false)}
            />
          )}
        </>
      )}
    </section>
  );
}
