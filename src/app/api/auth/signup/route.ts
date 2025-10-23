import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/sqlite/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-with-secret';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, department, year, isAdmin } = body;
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });

    const hashed = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (uid, email, password_hash, name, department, year, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)');
    // generate a uid
    const uid = `u_${Date.now()}_${Math.floor(Math.random()*10000)}`;
    stmt.run(uid, email, hashed, name || null, department || null, year ? Number(year) : null, isAdmin ? 1 : 0);

    const payload = { sub: uid, email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ user: { uid, email, name, department, year, isAdmin: !!isAdmin }, token });
  } catch (err: any) {
    if (err && err.code && err.code.includes('SQLITE_CONSTRAINT')) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
