import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/sqlite/db';

export async function GET(req: NextRequest, context: any) {
  const params = context?.params;
  const resolvedParams = params && typeof params.then === 'function' ? await params : params;
  const id = resolvedParams?.id;
  try {
  const eventRow: any = db.prepare('SELECT id, title, description, date, department, tags, posterUrl, createdBy, createdAt FROM events WHERE id = ?').get(id);
    if (!eventRow) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const registrants = db.prepare('SELECT userUid, userName, userEmail, registeredAt FROM registrations WHERE eventId = ?').all(id);
    const event = {
      id: String(eventRow.id),
      title: eventRow.title,
      description: eventRow.description,
      date: new Date(eventRow.date),
      department: eventRow.department,
      tags: eventRow.tags ? JSON.parse(eventRow.tags) : [],
      posterUrl: eventRow.posterUrl,
      createdBy: eventRow.createdBy,
      createdAt: eventRow.createdAt ? new Date(eventRow.createdAt) : new Date(),
    };
    return NextResponse.json({ event, registrants });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const params = context?.params;
  const resolvedParams = params && typeof params.then === 'function' ? await params : params;
  const id = resolvedParams?.id;
  try {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(id);
    db.prepare('DELETE FROM registrations WHERE eventId = ?').run(id);
    return NextResponse.json({ deleted: info.changes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: any) {
  const params = context?.params;
  const resolvedParams = params && typeof params.then === 'function' ? await params : params;
  const id = resolvedParams?.id;
  try {
    const body = await req.json();
    const { title, description, date, department, tags, posterUrl } = body;
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags ? JSON.stringify(tags.split(',').map((t: string) => t.trim())) : JSON.stringify([]));
    const stmt = db.prepare('UPDATE events SET title = ?, description = ?, date = ?, department = ?, tags = ?, posterUrl = ? WHERE id = ?');
    stmt.run(title, description, new Date(date).toISOString(), department || null, tagsJson, posterUrl || null, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
