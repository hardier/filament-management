'use client';

import { useEffect, useState, useCallback } from 'react';
import { Layers, Pencil, Check, Palette, ArrowDownUp } from 'lucide-react';
import type { FilamentColor, FilamentCategory, SortMode } from '@/lib/types';
import { loadInventory, saveInventory } from '@/lib/storage';
import CategorySection from '@/components/CategorySection';

const CATEGORIES: FilamentCategory[] = ['PLA', 'PETG', 'Other'];

export default function Home() {
  const [inventory, setInventory] = useState<FilamentColor[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('color');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setInventory(loadInventory());
    setMounted(true);
  }, []);

  const persist = useCallback((next: FilamentColor[]) => {
    setInventory(next);
    saveInventory(next);
  }, []);

  function handleUpdate(id: string, updated: FilamentColor) {
    persist(inventory.map((f) => (f.id === id ? updated : f)));
  }

  function handleDelete(id: string) {
    persist(inventory.filter((f) => f.id !== id));
  }

  function handleAdd(category: FilamentCategory, name: string, hex: string, brand: string) {
    const newColor: FilamentColor = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      hex,
      category,
      brand,
      count: 0,
      status: 'sealed',
      isCustom: true,
    };
    persist([...inventory, newColor]);
  }

  const totalSpools = inventory.reduce((s, f) => s + f.count, 0);
  const inStock = inventory.filter((f) => f.count > 0).length;
  const inUse = inventory.filter((f) => f.status && f.status !== 'sealed').length;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading inventory…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Layers size={22} className="text-blue-400 flex-shrink-0" />
            <h1 className="text-lg font-bold tracking-tight">Filament Manager</h1>
          </div>

          {/* Stats — hidden on mobile, shown on sm+ */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
            <span><span className="text-white font-semibold">{totalSpools}</span> spools</span>
            <span><span className="text-white font-semibold">{inStock}</span> in stock</span>
            {inUse > 0 && (
              <span><span className="text-orange-300 font-semibold">{inUse}</span> in use</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSortMode((m) => m === 'color' ? 'availability' : 'color')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                sortMode === 'availability'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
              title={sortMode === 'color' ? 'Sort by color' : 'Sort by stock'}
            >
              {sortMode === 'color' ? <Palette size={15} /> : <ArrowDownUp size={15} />}
              <span className="hidden sm:inline">{sortMode === 'color' ? 'By Color' : 'By Stock'}</span>
            </button>

            <button
              onClick={() => setEditMode((e) => !e)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                editMode
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {editMode ? <Check size={15} /> : <Pencil size={15} />}
              <span className="hidden sm:inline">{editMode ? 'Done' : 'Edit'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        {editMode && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 text-sm text-amber-300 flex items-center gap-2">
            <Pencil size={14} />
            Edit mode — adjust spool counts, change brands, or add custom colors. Changes save instantly.
          </div>
        )}

        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            filaments={inventory.filter((f) => f.category === cat)}
            editMode={editMode}
            sortMode={sortMode}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAdd={(name, hex, brand) => handleAdd(cat, name, hex, brand)}
          />
        ))}
      </main>
    </div>
  );
}
