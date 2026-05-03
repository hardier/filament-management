'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Layers, Pencil, Check, Palette, ArrowDownUp, Cloud, CloudOff, Loader2, Undo2, X, PackagePlus } from 'lucide-react';
import type { FilamentColor, FilamentSection, SortMode, SyncState } from '@/lib/types';
import { ALL_SECTIONS } from '@/lib/types';
import { getLocalInventory, setLocalInventory, migrateInventory } from '@/lib/storage';
import { fetchInventory, pushInventory } from '@/lib/api';
import { matchesColorFamily } from '@/lib/color-filter';
import CategorySection from '@/components/CategorySection';
import FilterBar, { type FilterState } from '@/components/FilterBar';
import IncomingPanel from '@/components/IncomingPanel';

const PUSH_DEBOUNCE_MS = 1200;

export default function Home() {
  const [inventory, setInventory] = useState<FilamentColor[]>([]);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [editMode, setEditMode] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('color');
  const [filter, setFilter] = useState<FilterState>({ sections: [], colorFamilies: [] });
  const [tab, setTab] = useState<'inventory' | 'incoming' | 'used'>('inventory');
  const showUsed = tab === 'used';
  const [mounted, setMounted] = useState(false);
  const [deletedItem, setDeletedItem] = useState<FilamentColor | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [history, setHistory] = useState<FilamentColor[][]>([]);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inventoryRef = useRef<FilamentColor[]>([]);

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

  // Keep ref in sync so persist can snapshot current inventory without stale closure
  useEffect(() => { inventoryRef.current = inventory; }, [inventory]);

  // Cmd+Z / Ctrl+Z keyboard shortcut for undo
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        setHistory((h) => {
          if (h.length === 0) return h;
          const prev = h[h.length - 1];
          setInventory(prev);
          setLocalInventory(prev);
          schedulePush(prev);
          if (undoTimer.current) clearTimeout(undoTimer.current);
          setDeletedItem(null);
          return h.slice(0, -1);
        });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((next: FilamentColor[]) => {
    // Push current state to history (cap at 20 entries)
    setHistory((prev) => [...prev.slice(-19), inventoryRef.current]);
    setInventory(next);
    setLocalInventory(next);
    schedulePush(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpdate(id: string, updated: FilamentColor) {
    persist(inventory.map((f) => (f.id === id ? updated : f)));
  }
  function handleDelete(id: string) {
    const deleted = inventory.find((f) => f.id === id);
    persist(inventory.filter((f) => f.id !== id));
    if (deleted) {
      if (undoTimer.current) clearTimeout(undoTimer.current);
      setDeletedItem(deleted);
      undoTimer.current = setTimeout(() => setDeletedItem(null), 5000);
    }
  }

  function handleUndo() {
    if (!deletedItem) return;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    persist([...inventory, deletedItem]);
    setDeletedItem(null);
  }

  function handleUndoHistory() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setInventory(prev);
    setLocalInventory(prev);
    schedulePush(prev);
    // Clear the delete toast if visible — undo covers it
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setDeletedItem(null);
  }

  function handleResetCounts() {
    const reset = inventory.map((f) => ({ ...f, count: 0, status: 'sealed' as const }));
    persist(reset);
    setShowResetConfirm(false);
  }
  function handleAdd(partial: Omit<FilamentColor, 'id' | 'count' | 'status'>) {
    const newColor: FilamentColor = {
      ...partial,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      count: 1,
      status: 'sealed',
    };
    persist([...inventory, newColor]);
  }

  function handleAddIncoming(partial: Omit<FilamentColor, 'id' | 'count' | 'status'>) {
    const newColor: FilamentColor = {
      ...partial,
      id: `incoming-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      count: 1,
      status: 'sealed',
      isCustom: true,
      incoming: true,
    };
    persist([...inventory, newColor]);
  }

  function handleReceive(id: string) {
    persist(inventory.map((f) => f.id === id ? { ...f, incoming: false } : f));
  }

  const incomingItems = inventory.filter((f) => f.incoming);
  const stockItems = inventory.filter((f) => !f.incoming);
  const totalSpools = stockItems.reduce((s, f) => s + f.count, 0);
  const totalUsed = stockItems.reduce((s, f) => s + (f.usedCount ?? 0), 0);
  const inStock = stockItems.filter((f) => f.count > 0).length;
  const inUse = stockItems.filter((f) => f.status && f.status !== 'sealed').length;

  const visibleSections = filter.sections.length > 0 ? filter.sections : ALL_SECTIONS;

  function sectionFilaments(section: FilamentSection): FilamentColor[] {
    let items = stockItems.filter((f) => f.category === section);
    if (showUsed) {
      items = items.filter((f) => (f.usedCount ?? 0) > 0);
    } else {
      items = items.filter((f) => f.count > 0);
    }
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
            {totalUsed > 0 && <span><span className="text-amber-400 font-semibold">{totalUsed}</span> used</span>}
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
              onClick={handleUndoHistory}
              disabled={history.length === 0}
              title={history.length > 0 ? `Undo last action (${history.length} step${history.length !== 1 ? 's' : ''} available) · ⌘Z` : 'Nothing to undo'}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors border bg-gray-800 border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Undo2 size={14} />
              <span className="hidden sm:inline">Undo</span>
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

        {/* Filter bar + tab switcher */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-3 flex items-center gap-3">
          <div className="flex-1">
            <FilterBar filter={filter} onChange={setFilter} />
          </div>
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5 border border-gray-700 flex-shrink-0">
            <button
              onClick={() => setTab('inventory')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === 'inventory'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setTab('incoming')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === 'incoming'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PackagePlus size={12} />
              Incoming
              {incomingItems.length > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === 'incoming' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/30 text-indigo-300'
                }`}>
                  {incomingItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('used')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === 'used'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Used
              {totalUsed > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === 'used' ? 'bg-amber-500 text-white' : 'bg-amber-500/30 text-amber-300'
                }`}>
                  {totalUsed}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Undo toast */}
      {deletedItem && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
          <div className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-2xl px-4 py-3 shadow-2xl pointer-events-auto">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 border border-white/20"
              style={{ backgroundColor: deletedItem.hex }}
            />
            <span className="text-sm text-gray-200">
              Removed <span className="font-semibold text-white">{deletedItem.name}</span>
            </span>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors ml-1"
            >
              <Undo2 size={14} />
              Undo
            </button>
            <button
              onClick={() => { if (undoTimer.current) clearTimeout(undoTimer.current); setDeletedItem(null); }}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {editMode && tab === 'inventory' && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs sm:text-sm text-amber-300 flex items-center gap-2">
            <Pencil size={13} />
            Edit mode — adjust counts, brands, status, or add custom colors. Changes sync automatically.
          </div>
        )}

        {tab === 'incoming' ? (
          <IncomingPanel
            items={incomingItems}
            editMode={editMode}
            onReceive={handleReceive}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAdd={handleAddIncoming}
          />
        ) : (
          <>
            {visibleSections.map((sec) => {
              const items = sectionFilaments(sec);
              // Always show sections in edit mode (so Add button is accessible);
              // hide empty sections otherwise
              if (items.length === 0 && !editMode) return null;
              return (
                <CategorySection
                  key={sec}
                  section={sec}
                  filaments={items}
                  editMode={editMode}
                  showUsed={showUsed}
                  sortMode={sortMode}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              );
            })}

            {/* Subtle danger zone */}
            <div className="flex justify-center pt-4 pb-2">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-[11px] text-gray-700 hover:text-gray-500 transition-colors"
              >
                Reset all inventory counts
              </button>
            </div>
          </>
        )}
      </main>

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowResetConfirm(false); }}
        >
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-white font-semibold text-base">Reset all counts?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                This will set every spool count to <strong className="text-white">0</strong> and mark all filaments as <strong className="text-white">Sealed</strong>.
                Your color catalog and custom colors are kept — only the counts and usage levels are cleared.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetCounts}
                className="flex-1 py-3 rounded-xl text-sm text-white bg-red-700 hover:bg-red-600 transition-colors font-semibold"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
