import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { STATIC_CATALOG, type BrandCatalog } from '@/lib/brands';

const BRANDS_KEY = 'brands:catalog:v1';

/**
 * POST /api/brands/sync
 *
 * Accepts { catalog: BrandCatalog } to seed or update the Redis brand catalog.
 * The incoming catalog is deep-merged on top of the existing Redis data so that
 * a partial update (e.g., only Cailab) won't wipe the rest.
 *
 * Example body:
 *   { "catalog": { "Cailab": [{ "code": "RB001", "name": "Red", "hex": "#ff0000" }] } }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.catalog !== 'object' || Array.isArray(body.catalog)) {
    return NextResponse.json({ error: 'Body must be { catalog: BrandCatalog }' }, { status: 400 });
  }

  const incoming: BrandCatalog = body.catalog;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 503 });
  }

  // Load existing stored catalog (or fall back to static)
  let existing: BrandCatalog = STATIC_CATALOG;
  try {
    const stored = await redis.get<BrandCatalog>(BRANDS_KEY);
    if (stored && typeof stored === 'object') existing = stored as BrandCatalog;
  } catch {
    // use static fallback
  }

  const merged: BrandCatalog = { ...existing, ...incoming };
  await redis.set(BRANDS_KEY, merged);

  return NextResponse.json({
    ok: true,
    brands: Object.keys(merged),
    updated: Object.keys(incoming),
  });
}

/**
 * GET /api/brands/sync
 * Returns the current stored catalog for inspection.
 */
export async function GET() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'Redis not configured' }, { status: 503 });
  const data = await redis.get(BRANDS_KEY);
  return NextResponse.json({ catalog: data ?? null });
}
