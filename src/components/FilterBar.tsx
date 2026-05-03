'use client';

import { X } from 'lucide-react';
import type { FilamentSection } from '@/lib/types';
import { ALL_SECTIONS } from '@/lib/types';
import { COLOR_FAMILIES } from '@/lib/color-filter';

export interface FilterState {
  sections: FilamentSection[];
  colorFamilies: string[];
}

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

const SECTION_STYLE: Record<FilamentSection, string> = {
  PLA:   'bg-blue-500/25 text-blue-200 border-blue-500/50',
  PETG:  'bg-emerald-500/25 text-emerald-200 border-emerald-500/50',
  Other: 'bg-purple-500/25 text-purple-200 border-purple-500/50',
};

export default function FilterBar({ filter, onChange }: Props) {
  const hasFilter = filter.sections.length > 0 || filter.colorFamilies.length > 0;

  function toggleSection(s: FilamentSection) {
    const next = filter.sections.includes(s)
      ? filter.sections.filter((x) => x !== s)
      : [...filter.sections, s];
    onChange({ ...filter, sections: next });
  }

  function toggleColor(id: string) {
    const next = filter.colorFamilies.includes(id)
      ? filter.colorFamilies.filter((x) => x !== id)
      : [...filter.colorFamilies, id];
    onChange({ ...filter, colorFamilies: next });
  }

  function clearAll() {
    onChange({ sections: [], colorFamilies: [] });
  }

  return (
    /* Single horizontally-scrollable strip — no line-wrap so it never overlaps the tab row */
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none -mx-0.5 px-0.5">
      {/* Type label */}
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex-shrink-0">Type</span>

      {ALL_SECTIONS.map((s) => (
        <button
          key={s}
          onClick={() => toggleSection(s)}
          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            filter.sections.includes(s)
              ? SECTION_STYLE[s]
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-200 hover:border-gray-500'
          }`}
        >
          {s}
        </button>
      ))}

      {/* Divider */}
      <span className="w-px h-4 bg-gray-700 flex-shrink-0 mx-0.5" />

      {/* Color label */}
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex-shrink-0">Color</span>

      {COLOR_FAMILIES.map((fam) => (
        <button
          key={fam.id}
          onClick={() => toggleColor(fam.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            filter.colorFamilies.includes(fam.id)
              ? 'bg-white/10 text-white border-white/30'
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-200 hover:border-gray-500'
          }`}
        >
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
            style={{ backgroundColor: fam.dot }}
          />
          {fam.label}
        </button>
      ))}

      {hasFilter && (
        <button
          onClick={clearAll}
          className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors ml-1"
        >
          <X size={11} /> Clear
        </button>
      )}
    </div>
  );
}
