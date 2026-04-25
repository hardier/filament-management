'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Layers, Pencil, Check, Palette, ArrowDownUp, Cloud, CloudOff, Loader2, PackageCheck } from 'lucide-react';
import type { FilamentColor, FilamentSection, FilamentType, SortMode, SyncState } from '@/lib/types';
import { ALL_SECTIONS } from '@/lib/types';
import { getLocalInventory, setLocalInventory, migrateInventory } from '@/lib/storage';
import { fetchInventory, pushInventory } from '@/lib/api';
import { matchesColorFamily } from '@/lib/color-filter';
import CategorySection from '@/components/CategorySection';
import FilterBar, { type FilterState } from '@/components/FilterBar';

const PUSH_DEBOUNCE_MS = 1200;

export default function Home() {
  const [inventory, setInventory] = useState<FilamentColor[]>([]);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [editMode, setEditMode] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('color');
  const [filter, setFilter] = useState<FilterState>({ sections: [], colorFamilies: [] });
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const local = getLocalInventory();
    setInventory(local);
    setMounted(true);

    setSyncState('syncing');
    fetchInventory().then((remote) => {
      if (remote && remote.length > 0) {
        const migrated = migrateInventory(remote as unknown[]);
        setInventory(migrated);
        setLocalInventory(migrated);
        setSyncState('synced');
      } else if (remote === null) {
        pushInventory(local).then((ok) => setSyncState(ok ? 'synced' : 'error'));
      } else {
        setSyncState('synced');
      }
    }).catch(() => setSyncState('offline'));
  }, []);

  function schedulePush(next: FilamentColor[]) {
    if (pushTimer.current) clearTimeout(pushTimer.current);
    setSyncState('syncing');
    pushTimer.current = setTimeout(async () => {
      const ok = await pushInventory(next);
      setSyncState(ok ? 'synced' : 'error');
    }, PUSH_DEBOUNCE_MS);
  }

  const persist = useCallback((next: FilamentColor[]) => {
    setInventory(next);
    setLocalInventory(next);
    schedulePush(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpdate(id: string, updated: FilamentColor) {
    persist(inventory.map((f) => (f.id === id ? updated : f)));
  }
  function handleDelete(id: string) {
    persist(inventory.filter((f) => f.id !== id));
  }
  function handleAdd(section: FilamentSection, name: string, hex: string, brand: string, type: FilamentType) {
    const newColor: FilamentColor = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name, hex, category: section, type, brand,
      count: 0, status: 'sealed', isCustom: true,
    };
    persist([...inventory, newColor]);
  }

  const totalSpools = inventory.reduce((s, f) => s + f.count, 0);
  const inStock = inventory.filter((f) => f.count > 0).length;
  const inUse = inventory.filter((f) => f.status && f.status !== 'sealed').length;

  const visibleSections = filter.sections.length > 0 ? filter.sections : ALL_SECTIONS;

  function sectionFilaments(section: FilamentSection): FilamentColor[] {
    let items = inventory.filter((f) => f.category === section);
    if (showAvailableOnly) items = items.filter((f) => f.count > 0);
    if (filter.colorFamilies.length > 0) {
      items = items.filter((f) => filter.colorFamilies.some((id) => matchesColorFamily(f.hex, id)));
    }
    return items;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Layers size={20} className="text-blue-400 flex-shrink-0" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">Filament Manager</h1>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400 flex-shrink-0">
            <span><span className="text-white font-semibold">{totalSpools}</span> spools</span>
            <span><span className="text-white font-semibold">{inStock}</span> in stock</span>
            {inUse > 0 && <span><span className="text-orange-300 font-semibold">{inUse}</span> in use</span>}
          </div>

          <div className="flex items-center gap-1.5">
            <div
              title={
                syncState === 'synced'  ? 'Synced with server' :
                syncState === 'syncing' ? 'Syncing…' :
                syncState === 'error'   ? 'Sync error — changes saved locally' :
                syncState === 'offline' ? 'Offline — changes saved locally' : ''
              }
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-2 rounded-lg text-xs font-medium border ${
                syncState === 'synced'  ? 'bg-green-500/10 text-green-400 border-green-600/30' :
                syncState === 'syncing' ? 'bg-blue-500/10  text-blue-400  border-blue-600/30'  :
                syncState === 'error'   ? 'bg-red-500/10   text-red-400   border-red-600/30'   :
                syncState === 'offline' ? 'bg-gray-500/10  text-gray-500  border-gray-700'     :
                'bg-gray-800 text-gray-600 border-gray-700'
              }`}
            >
              {syncState === 'syncing' ? <Loader2 size={14} className="animate-spin" /> :
               syncState === 'offline' ? <CloudOff size={14} /> : <Cloud size={14} />}
              <span className="hidden sm:inline">
                {syncState === 'synced'  ? 'Synced'   :
                 syncState === 'syncing' ? 'Syncing…' :
                 syncState === 'error'   ? 'Error'    :
                 syncState === 'offline' ? 'Offline'  : ''}
              </span>
            </div>

            <button
              onClick={() => setShowAvailableOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                showAvailableOnly
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'
              }`}
              title={showAvailableOnly ? 'Showing in-stock only' : 'Showing all filaments'}
            >
              <PackageCheck size={14} />
              <span className="hidden sm:inline">{showAvailableOnly ? 'In Stock' : 'All'}</span>
            </button>

            <button
              onClick={() => setSortMode((m) => m === 'color' ? 'availability' : 'color')}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                sortMode === 'availability'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'
              }`}
              title={sortMode === 'color' ? 'Sort by color' : 'Sort by stock'}
            >
              {sortMode === 'color' ? <Palette size={14} /> : <ArrowDownUp size={14} />}
              <span className="hidden sm:inline">{sortMode === 'color' ? 'By Color' : 'By Stock'}</span>
            </button>

            <button
              onClick={() => setEditMode((e) => !e)}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                editMode
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'
              }`}
            >
              {editMode ? <Check size={14} /> : <Pencil size={14} />}
              <span className="hidden sm:inline">{editMode ? 'Done' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-3">
          <FilterBar filter={filter} onChange={setFilter} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {editMode && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs sm:text-sm text-amber-300 flex items-center gap-2">
            <Pencil size={13} />
            Edit mode — adjust counts, brands, status, or add custom colors. Changes sync automatically.
          </div>
        )}

        {visibleSections.map((sec) => {
          const items = sectionFilaments(sec);
          // Hide empty sections when any filter is active and nothing matches
          if ((filter.colorFamilies.length > 0 || showAvailableOnly) && items.length === 0) return null;
          return (
            <CategorySection
              key={sec}
              section={sec}
              filaments={items}
              editMode={editMode}
              sortMode={sortMode}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAdd={(name, hex, brand, type) => handleAdd(sec, name, hex, brand, type)}
            />
          );
        })}
      </main>
    </div>
  );
}
