import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const PROMPT = `You are analyzing a purchase history screenshot from an e-commerce platform (may be in Chinese, English, or mixed).

Identify every 3D printing filament item shown. For each item extract exactly:
- brand: brand name in English (e.g. "Cailab", "Bambu Lab", "Polymaker", "Sunlu", "eSUN")
- name: color / variant name translated to English (e.g. "Rainbow Silk 3-Color", "Candy Rainbow", "Sunflower No.1")
- code: the color/SKU code if visible anywhere in the product text (e.g. "RB001", "RB011", "PA02001") — look carefully at sub-lines and variant descriptions
- material: primary material in English, one of: "PLA", "PETG", "ABS", "ASA", "TPU"
- subtype: sub-type in English, one of: "Silk", "Matte", "Basic", "Luminous", "Translucent", "Sparkle", "CF", "HF"
- hex: best-effort primary hex color extracted from the product thumbnail (e.g. "#F67AB9")
- count: quantity purchased as an integer (look for "x1", "×1", "数量:1" etc, default 1)
- thumbnailBox: fractional bounding box {x,y,w,h} (0.0–1.0) of the product thumbnail image in the screenshot

Return ONLY a JSON object, no other text:
{"items":[{"brand":"","name":"","code":"","material":"","subtype":"","hex":"","count":1,"thumbnailBox":{"x":0,"y":0,"w":0,"h":0}}]}`;

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.imageBase64 || !body?.mimeType) {
    return NextResponse.json({ error: 'Missing imageBase64 or mimeType' }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent([
    { inlineData: { mimeType: body.mimeType, data: body.imageBase64 } },
    PROMPT,
  ]);

  const raw = result.response.text();
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    return NextResponse.json({ error: 'No JSON in model response', raw }, { status: 422 });
  }

  try {
    const data = JSON.parse(match[0]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from model', raw }, { status: 422 });
  }
}
