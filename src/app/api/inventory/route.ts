import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function key(syncId: string) {
  return `filament:v1:${syncId}`;
}

export async function GET(request: NextRequest) {
  const syncId = request.nextUrl.searchParams.get('syncId');
  if (!syncId || syncId.length < 8) {
    return NextResponse.json({ error: 'Invalid syncId' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  const data = await redis.get(key(syncId));
  return NextResponse.json({ inventory: data ?? null });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !body.syncId || !Array.isArray(body.inventory)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  await redis.set(key(body.syncId), body.inventory);
  return NextResponse.json({ ok: true });
}
