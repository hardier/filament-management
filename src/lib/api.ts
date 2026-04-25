import type { FilamentColor } from './types';

export async function fetchInventory(): Promise<FilamentColor[] | null> {
  try {
    const res = await fetch('/api/inventory');
    if (!res.ok) return null;
    const data = await res.json();
    return data.inventory as FilamentColor[] | null;
  } catch {
    return null;
  }
}

export async function pushInventory(inventory: FilamentColor[]): Promise<boolean> {
  try {
    const res = await fetch('/api/inventory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventory }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
