import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/sqlite/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, userUid, userName, userEmail } = body;
    if (!eventId || !userUid) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    const stmt = db.prepare('INSERT OR IGNORE INTO registrations (eventId, userUid, userName, userEmail) VALUES (?, ?, ?, ?)');
    stmt.run(eventId, userUid, userName || null, userEmail || null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
