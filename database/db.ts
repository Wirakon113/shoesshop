// Helper เปิด SQLite (Node 22+ built-in `node:sqlite`, ไม่ต้องลง package เพิ่ม)
// ใช้ทั้งฝั่ง seed/init และ Express API server
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// ไฟล์หลักคือ mono-shop.db (shop.db เก่าถูก process ภายนอกเปิดค้างไว้จนเขียนไม่ได้
// จึงย้ายข้อมูลมาที่ไฟล์นี้ — ดู database/README.md)
export const DB_PATH = process.env.SHOP_DB_PATH || path.join(here, 'mono-shop.db');

export function openDb(dbPath: string = DB_PATH): DatabaseSync {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode = WAL;`);
  db.exec(`PRAGMA foreign_keys = ON;`);
  return db;
}

export function getCategoryId(db: DatabaseSync, slug: string): number {
  const row = db.prepare(`SELECT id FROM categories WHERE slug = ?`).get(slug) as
    | { id: number }
    | undefined;
  if (!row) throw new Error(`category slug not found: ${slug}`);
  return row.id;
}
