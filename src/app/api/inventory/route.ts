import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Single shared key for this deployment — all devices use the same inventory.
// Set SYNC_KEY in Vercel env vars to avoid conflicts with other deployments.
const INVENTORY_KEY = `filament:v1:${process.env.SYNC_KEY ?? 'default'}`;

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  const data = await redis.get(INVENTORY_KEY);
  return NextResponse.json({ inventory: data ?? null });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.inventory)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  await redis.set(INVENTORY_KEY, body.inventory);
  return NextResponse.json({ ok: true });
}
