@AGENTS.md

# Filament Management — Project Context

Personal filament inventory web app for a 3D printer enthusiast.
Built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, and Upstash Redis.

## Quick orientation

```
src/
  app/
    page.tsx          ← ALL state lives here; orchestrates everything
    api/
      inventory/      ← GET + POST to Upstash Redis
      brands/         ← serve brand color catalog; /sync endpoint
  components/
    FilterBar.tsx     ← single horizontally-scrollable chip row (Type | Color)
    CategorySection.tsx  ← one section (PLA / PETG / Other), groups by sub-type
    FilamentCard.tsx  ← individual spool card (count, status, mark-used, edit, delete)
    AddColorModal.tsx ← add / edit modal (brand picker, color swatches, count stepper)
    IncomingPanel.tsx ← "on order" list with receive-quantity dialog
  lib/
    types.ts          ← FilamentColor interface, FilamentStatus, SortMode, etc.
    storage.ts        ← localStorage read/write + migrateInventory()
    api.ts            ← fetchInventory() / pushInventory() wrappers
    color-utils.ts    ← sortByColor(), contrastColor()
    color-filter.ts   ← HSL-based ColorFamily matching + keyword fallback
    brands.ts         ← STATIC_CATALOG + loadBrandCatalog() remote fetch
    bambu-colors.ts   ← full Bambu Lab color list (BAMBU_BRAND_COLORS export)
```

## Data model

Single flat array of `FilamentColor`, stored as one JSON blob in Upstash Redis
and mirrored in `localStorage` for offline support.

```ts
interface FilamentColor {
  id: string;           // "custom-{timestamp}-{random}" or "incoming-…"
  name: string;         // "Bambu Green"
  hex: string;          // "#1DB954"
  code?: string;        // brand SKU e.g. "PA02001"
  category: 'PLA' | 'PETG' | 'Other';
  type: FilamentType;   // "PLA Basic", "PETG CF", etc.
  brand: string;
  count: number;        // spools in stock (incoming items use this for ordered qty)
  status: 'sealed' | 'high' | 'medium' | 'low';
  usedCount?: number;   // cumulative spools consumed (mark-used button)
  incoming?: boolean;   // true = ordered, not yet received
  isCustom?: boolean;
  imageSrc?: string;    // base64 JPEG thumbnail (max 400 px, 82% quality)
}
```

## Key architecture decisions

### Write path
```
user action
  → persist(nextInventory)           [page.tsx]
      ├─ push snapshot onto history stack (cap 20)
      ├─ setInventory()              [instant React re-render]
      ├─ setLocalInventory()         [localStorage]
      └─ schedulePush()              [debounced 1200 ms → POST /api/inventory]
```

### inventoryRef pattern
`inventoryRef` (useRef) is kept in sync with `inventory` via a useEffect.
`persist` is a `useCallback` with no dependencies — it reads the current
inventory snapshot through `inventoryRef.current` to avoid stale closures.

### Undo
`history: FilamentColor[][]` stack in state. `persist()` pushes before each
mutation. `handleUndoHistory()` pops and restores. Ctrl/Cmd+Z also bound.

### Receive / merge logic (`handleReceive`)
When marking an incoming item as received:
1. `isSameKind(a, b)` — matches on `name + brand + type + category` (lowercased)
2. If a matching stock entry exists → increment its `count`, remove/reduce incoming
3. If no match → move incoming to stock (full) or split (partial receive)

### Color filter (`matchesColorFamily`)
Two-stage: hex HSL range first, then keyword list in the filament name.
Each `ColorFamily` in `color-filter.ts` has a `keywords: string[]` array.
Tokenises the name on whitespace/punctuation; multi-word keywords use substring match.

### Brand color catalog fallback
`AddColorModal` calls `getBrandColors(effectiveBrand, catalog)`.
If the brand has no catalog entry → falls back to Bambu Lab swatches,
labelled "Color Reference (Bambu Lab)" so the user knows it's a reference.

## Tabs

| Tab | Shows | Badge value |
|---|---|---|
| Inventory | stock items (count > 0), grouped by section + type | `totalSpools` (sum of counts) |
| Incoming | items with `incoming: true` | `totalIncomingSpools` (sum of counts) |
| Used | stock items with `usedCount > 0` | `totalUsed` (sum of usedCount) |

Filters (Type chips + Color chips) apply to ALL three tabs.

## Sections & types

```
PLA   → PLA Basic, PLA+, PLA Matte, PLA Silk, PLA-CF, PLA-GF, PLA Metal
PETG  → PETG Basic, PETG-CF, PETG-GF
Other → ABS, ASA, TPU, PA, PC, PVA, HIPS, Other
```

## Brand catalog

Static catalog in `src/lib/brands.ts`:
- **Bambu Lab** — full color list from `bambu-colors.ts`
- **Polymaker** — ~28 colors with PA02xxx codes
- **Sunlu** — ~26 colors
- **eSUN** — ~32 colors
- **Cailab** — ~25 colors with some AC/MT/RB codes

Dropdown also lists: Hatchbox, Prusament, Elegoo, Overture, Creality (no swatches → Bambu fallback).

## Feature checklist (all implemented)

- [x] Add / edit / delete any filament (Edit mode toggle)
- [x] Inventory grouped by section → sub-type, sorted by color hue or stock level
- [x] Status indicator (Sealed / High / Medium / Low) — cycled in Edit mode
- [x] Mark-used button (Archive icon) — decrements count, increments usedCount, resets status to Sealed
- [x] Used tab — history of consumed spools
- [x] Incoming tab — ordered filaments; edit/delete always visible (no Edit mode needed)
- [x] Add incoming with quantity stepper
- [x] Receive dialog — choose how many arrived; partial receive splits the entry; merges into existing stock if same kind
- [x] Filter bar — Type (PLA/PETG/Other) + Color family chips, single scrollable row, applies to all tabs
- [x] Color filter matches hex hue AND filament name keywords
- [x] Undo — 20-step history stack + Cmd/Ctrl+Z + undo toast on delete (5 s)
- [x] Sort — by color hue (default) or by stock level
- [x] Sync indicator — idle / syncing / synced / error / offline
- [x] localStorage offline cache
- [x] Upstash Redis remote persistence (debounced 1200 ms)
- [x] Mobile-friendly — tab bar full-width, filter scrollable, 2-col card grid
- [x] Brand color swatches with live name filter in AddColorModal
- [x] Bambu Lab fallback swatches for unknown brands
- [x] Thumbnail upload / paste (base64 JPEG, max 400 px)
- [x] Reset all counts (with confirmation dialog)

## Environment variables needed

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

## Dev commands

```bash
npm run dev    # start dev server on :3000
npm run build  # production build + type check
```

## Git state

Repo: https://github.com/hardier/filament-management
Branch: main
Latest commit: a1df443 — "Fix tab badges to show total spool counts, not color-kind counts"
