import type { FilamentColor } from './types';

export async function fetchInventory(syncId: string): Promise<FilamentColor[] | null> {
  try {
    const res = await fetch(`/api/inventory?syncId=${encodeURIComponent(syncId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.inventory as FilamentColor[] | null;
  } catch {
    return null;
  }
}

export async function pushInventory(syncId: string, inventory: FilamentColor[]): Promise<boolean> {
  try {
    const res = await fetch('/api/inventory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncId, inventory }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
