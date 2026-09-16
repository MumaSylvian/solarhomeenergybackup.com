import { NextResponse } from 'next/server';

function reference() { return `SHR-${Date.now().toString(36).toUpperCase()}`; }

export async function POST(request: Request) {
  const endpoint = process.env.ORDER_REQUEST_WEBHOOK_URL;
  if (!endpoint) return NextResponse.json({ error: 'Order delivery is not connected yet. Add the secure order destination before accepting requests.' }, { status: 503 });
  try {
    const body = await request.json();
    const result = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!result.ok) return NextResponse.json({ error: 'We could not deliver the order request. Please try again.' }, { status: 502 });
    return NextResponse.json({ ok: true, reference: reference() }, { status: 202 });
  } catch {
    return NextResponse.json({ error: 'We could not deliver the order request. Please try again.' }, { status: 502 });
  }
}

export function GET() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
