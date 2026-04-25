'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Layers, Pencil, Check, Palette, ArrowDownUp, RefreshCw, Cloud, CloudOff, Loader2 } from 'lucide-react';
import type { FilamentColor, FilamentCategory, SortMode, SyncState } from '@/lib/types';
import { ALL_CATEGORIES } from '@/lib/types';
import { getSyncId, setSyncId, getLocalInventory, setLocalInventory } from '@/lib/storage';
import { fetchInventory, pushInventory } from '@/lib/api';
import CategorySection from '@/components/CategorySection';
import SyncModal from '@/components/SyncModal';

const PUSH_DEBOUNCE_MS = 1200;

export default function Home() {
  const [inventory, setInventory] = useState<FilamentColor[]>([]);
  const [syncId, setSyncIdState] = useState('');
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [editMode, setEditMode] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('color');
  const [mounted, setMounted] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load: local first, then fetch from server
  useEffect(() => {
    const local = getLocalInventory();
    setInventory(local);
    const id = getSyncId();
    setSyncIdState(id);
    setMounted(true);

    setSyncState('syncing');
    fetchInventory(id).then((remote) => {
      if (remote && remote.length > 0) {
        setInventory(remote);
        setLocalInventory(remote);
        setSyncState('synced');
      } else if (remote === null) {
        // Server returned null (new sync ID) — push local data up
        pushInventory(id, local).then((ok) =>
          setSyncState(ok ? 'synced' : 'error')
        );
      } else {
        setSyncState('synced');
      }
    }).catch(() => setSyncState('offline'));
  }, []);

  // Debounced push to server
  function schedulePush(next: FilamentColor[], id: string) {
    if (pushTimer.current) clearTimeout(pushTimer.current);
    setSyncState('syncing');
    pushTimer.current = setTimeout(async () => {
      const ok = await pushInventory(id, next);
      setSyncState(ok ? 'synced' : 'error');
    }, PUSH_DEBOUNCE_MS);
  }

  const persist = useCallback((next: FilamentColor[]) => {
    setInventory(next);
    setLocalInventory(next);
    schedulePush(next, getSyncId());
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      name, hex, category, brand,
      count: 0, status: 'sealed', isCustom: true,
    };
    persist([...inventory, newColor]);
  }

  async function handleChangeSyncId(newId: string) {
    setSyncId(newId);
    setSyncIdState(newId);
    setSyncState('syncing');
    const remote = await fetchInventory(newId);
    if (remote && remote.length > 0) {
      setInventory(remote);
      setLocalInventory(remote);
      setSyncState('synced');
    } else {
      // New code with no data yet — push current inventory
      const ok = await pushInventory(newId, inventory);
      setSyncState(ok ? 'synced' : 'error');
    }
  }

  const totalSpools = inventory.reduce((s, f) => s + f.count, 0);
  const inStock = inventory.filter((f) => f.count > 0).length;
  const inUse = inventory.filter((f) => f.status && f.status !== 'sealed').length;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Layers size={20} className="text-blue-400 flex-shrink-0" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">Filament Manager</h1>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400 flex-shrink-0">
            <span><span className="text-white font-semibold">{totalSpools}</span> spools</span>
            <span><span className="text-white font-semibold">{inStock}</span> in stock</span>
            {inUse > 0 && <span><span className="text-orange-300 font-semibold">{inUse}</span> in use</span>}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {/* Sync indicator */}
            <button
              onClick={() => setShowSyncModal(true)}
              title="Sync settings"
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-2 rounded-lg text-xs font-medium transition-colors border ${
                syncState === 'synced'  ? 'bg-green-500/10 text-green-400 border-green-600/30' :
                syncState === 'syncing' ? 'bg-blue-500/10 text-blue-400 border-blue-600/30' :
                syncState === 'error'   ? 'bg-red-500/10 text-red-400 border-red-600/30' :
                syncState === 'offline' ? 'bg-gray-500/10 text-gray-500 border-gray-700' :
                'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              {syncState === 'syncing' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : syncState === 'offline' ? (
                <CloudOff size={14} />
              ) : (
                <Cloud size={14} />
              )}
              <span className="hidden sm:inline">
                {syncState === 'synced' ? 'Synced' :
                 syncState === 'syncing' ? 'Syncing…' :
                 syncState === 'error' ? 'Sync error' :
                 syncState === 'offline' ? 'Offline' : 'Sync'}
              </span>
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
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {editMode && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs sm:text-sm text-amber-300 flex items-center gap-2">
            <Pencil size={13} />
            Edit mode — adjust spool counts, brands, status, or add custom colors. Changes sync automatically.
          </div>
        )}

        {ALL_CATEGORIES.map((cat) => (
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

      {showSyncModal && (
        <SyncModal
          syncId={syncId}
          onChangeSyncId={handleChangeSyncId}
          onClose={() => setShowSyncModal(false)}
        />
      )}
    </div>
  );
}
