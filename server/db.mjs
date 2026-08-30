import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
fs.mkdirSync(dir, { recursive: true });

export const db = new DatabaseSync(path.join(dir, "voxstream.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer TEXT,
  stripe_sub TEXT,
  plan_expires INTEGER,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  sid TEXT PRIMARY KEY,
  email TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at INTEGER NOT NULL
);
`);

export function upsertUser(email, plan) {
  const now = Date.now();
  const row = db.prepare("SELECT email FROM users WHERE email = ?").get(email);
  if (row) {
    db.prepare("UPDATE users SET plan = ? WHERE email = ?").run(plan, email);
  } else {
    db.prepare("INSERT INTO users (email, plan, created_at) VALUES (?, ?, ?)").run(email, plan, now);
  }
}

export function getUser(email) {
  if (!email) return null;
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) || null;
}

export function putSession(sid, email, plan) {
  db.prepare("INSERT OR REPLACE INTO sessions (sid, email, plan, created_at) VALUES (?, ?, ?, ?)").run(
    sid, email || null, plan || "free", Date.now()
  );
}

export function getSession(sid) {
  if (!sid) return null;
  return db.prepare("SELECT * FROM sessions WHERE sid = ?").get(sid) || null;
}
