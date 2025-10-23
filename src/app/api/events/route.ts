import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/sqlite/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, date, department, tags, posterUrl, createdBy } = body;
    if (!title || !description || !date) return NextResponse.json({ error: 'missing fields' }, { status: 400 });

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags ? JSON.stringify(tags.split(',').map((t: string) => t.trim())) : JSON.stringify([]));
    const stmt = db.prepare('INSERT INTO events (title, description, date, department, tags, posterUrl, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(title, description, new Date(date).toISOString(), department || null, tagsJson, posterUrl || null, createdBy || null);

    return NextResponse.json({ id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = db.prepare('SELECT id, title, description, date, department, tags, posterUrl, createdBy, createdAt FROM events ORDER BY date ASC').all();
    const events = rows.map((r: any) => ({
      id: String(r.id),
      title: r.title,
      description: r.description,
      date: new Date(r.date),
      department: r.department,
      tags: r.tags ? JSON.parse(r.tags) : [],
      posterUrl: r.posterUrl,
      createdBy: r.createdBy,
      createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
    }));
    return NextResponse.json({ events });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

// Additional handlers for nested routes (registrants, register, delete) using pathname parsing
// Nested endpoints are implemented in separate files under /api/events
