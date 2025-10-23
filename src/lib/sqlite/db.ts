import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

// users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    department TEXT,
    year INTEGER,
    isAdmin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// events table
db.prepare(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    department TEXT,
    tags TEXT,
    posterUrl TEXT,
    createdBy TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// registrations table
db.prepare(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId INTEGER NOT NULL,
    userUid TEXT NOT NULL,
    userName TEXT,
    userEmail TEXT,
    registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(eventId, userUid)
  )
`).run();

export default db;
