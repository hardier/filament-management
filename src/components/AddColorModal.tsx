'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { FilamentCategory } from '@/lib/types';

interface Props {
  category: FilamentCategory;
  onAdd: (name: string, hex: string, brand: string) => void;
  onClose: () => void;
}

export default function AddColorModal({ category, onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#ff0000');
  const [brand, setBrand] = useState('Bambu Lab');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), hex, brand.trim() || 'Bambu Lab');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Add Custom Color — {category}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Color Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midnight Blue"
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                pattern="^#[0-9A-Fa-f]{6}$"
                placeholder="#ff0000"
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Brand</label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Bambu Lab"
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors font-medium"
            >
              Add Color
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
