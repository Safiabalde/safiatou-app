import { NextRequest, NextResponse } from 'next/server';

// Store subscriptions in memory (in production use a DB)
const subscriptions: PushSubscription[] = [];

export async function POST(req: NextRequest) {
  const sub = await req.json();
  subscriptions.push(sub);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ count: subscriptions.length });
}
