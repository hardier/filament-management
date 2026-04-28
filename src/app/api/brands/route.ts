import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { STATIC_CATALOG } from '@/lib/brands';

const BRANDS_KEY = 'brands:catalog:v1';

export async function GET() {
  const redis = getRedis();
  if (redis) {
    try {
      const remote = await redis.get<Record<string, unknown>>(BRANDS_KEY);
      if (remote && typeof remote === 'object') {
        return NextResponse.json({ catalog: remote, source: 'redis' });
      }
    } catch {
      // fall through to static
    }
  }
  return NextResponse.json({ catalog: STATIC_CATALOG, source: 'static' });
}
