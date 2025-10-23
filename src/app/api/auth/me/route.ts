import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/sqlite/db';

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-with-secret';

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const token = auth.slice(7);
    const payload: any = jwt.verify(token, JWT_SECRET);
    const uid = payload.sub;
  const row: any = db.prepare('SELECT uid, email, name, department, year, isAdmin FROM users WHERE uid = ?').get(uid);
    if (!row) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const user = { uid: row.uid, email: row.email, name: row.name, department: row.department, year: row.year, isAdmin: !!row.isAdmin };
    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}
