import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/sqlite/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-with-secret';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });

  const row: any = db.prepare('SELECT uid, email, password_hash, name, department, year, isAdmin FROM users WHERE email = ?').get(email);
    if (!row) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });

  const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });

    const user = { uid: row.uid, email: row.email, name: row.name, department: row.department, year: row.year, isAdmin: !!row.isAdmin };
    const token = jwt.sign({ sub: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ user, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
