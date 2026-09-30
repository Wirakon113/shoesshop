// สร้าง + seed database/mono-shop.db จาก schema.sql และข้อมูล seed เดิมของเว็บ
// รัน: npx tsx database/init.ts [--reset]
// - อ่าน database/schema.sql มาสร้างตารางทั้ง 7
// - seed categories(4) + users(3) + products(30 จาก INITIAL_PRODUCTS) + product_images + orders ตัวอย่าง
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { openDb, getCategoryId, DB_PATH } from './db.ts';
import { SEED_USERS } from './seed-users.ts';
import { INITIAL_PRODUCTS } from '../src/data/products.ts';
import { INITIAL_ORDERS } from '../src/utils/localStorage.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(here, 'schema.sql');

const SEED_CATEGORIES: Array<[string, string]> = [
  ['Running', 'วิ่ง'],
  ['Lifestyle', 'ไลฟ์สไตล์'],
  ['Basketball', 'บาสเกตบอล'],
  ['Training', 'เทรนนิ่ง'],
];

function main() {
  const reset = process.argv.includes('--reset');
  if (reset && fs.existsSync(DB_PATH)) {
    fs.rmSync(DB_PATH);
    // node:sqlite สร้างไฟล์ -wal/-shm ข้างเคียง ลบด้วยกัน
    for (const suffix of ['-wal', '-shm', '-journal']) {
      const p = DB_PATH + suffix;
      if (fs.existsSync(p)) fs.rmSync(p);
    }
    console.log(`[db] removed existing ${DB_PATH}`);
  }

  const db = openDb();
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
  console.log('[db] schema applied');

  // ---- categories (idempotent) ----
  const insertCat = db.prepare(
    `INSERT INTO categories (slug, name_th) VALUES (?, ?)
     ON CONFLICT(slug) DO UPDATE SET name_th = excluded.name_th`,
  );
  for (const [slug, nameTh] of SEED_CATEGORIES) insertCat.run(slug, nameTh);

  // ---- users (idempotent) ----
  const insertUser = db.prepare(
    `INSERT INTO users (id, name, lastname, email, phone, address, district, province,
       postal_code, username, password, role, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name, lastname=excluded.lastname, email=excluded.email,
       phone=excluded.phone, address=excluded.address, district=excluded.district,
       province=excluded.province, postal_code=excluded.postal_code,
       username=excluded.username, password=excluded.password, role=excluded.role`,
  );
  for (const u of SEED_USERS) {
    // hash รหัสก่อนเก็บทุกครั้ง (seed ซ้ำ hash จะเปลี่ยนแต่ login ได้ปกติ)
    const passwordHash = bcrypt.hashSync(u.password, 10);
    insertUser.run(
      u.id, u.name, u.lastname, u.email, u.phone, u.address, u.district,
      u.province, u.postal_code, u.username, passwordHash, u.role, u.created_at,
    );
  }

  // ---- products + product_images (idempotent) ----
  const insertProduct = db.prepare(
    `INSERT INTO products (id, sku, name, description, category_id, price, stock,
       featured, is_new, main_image, sizes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       sku=excluded.sku, name=excluded.name, description=excluded.description,
       category_id=excluded.category_id, price=excluded.price, stock=excluded.stock,
       featured=excluded.featured, is_new=excluded.is_new,
       main_image=excluded.main_image, sizes=excluded.sizes,
       updated_at=datetime('now')`,
  );
  const deleteImages = db.prepare(`DELETE FROM product_images WHERE product_id = ?`);
  const insertImage = db.prepare(
    `INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)`,
  );
  for (const p of INITIAL_PRODUCTS) {
    const categoryId = getCategoryId(db, p.category);
    insertProduct.run(
      p.id, p.sku ?? null, p.name, p.description, categoryId, p.price, p.stock,
      p.featured ? 1 : 0, p.isNew ? 1 : 0, p.image, JSON.stringify(p.sizes),
    );
    deleteImages.run(p.id);
    const extras = (p.additionalImages ?? []).filter((u) => u !== p.image);
    extras.forEach((url, i) => insertImage.run(p.id, url, i + 1));
  }

  // ---- orders + order_items (insert เฉพาะ id ที่ยังไม่มี — กัน seed ซ้ำ) ----
  const orderExists = db.prepare(`SELECT 1 FROM orders WHERE id = ?`);
  const insertOrder = db.prepare(
    `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone,
       shipping_address, subtotal, shipping_cost, total, payment_method, status, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_id, name_snapshot, category_snapshot,
       price_snapshot, size, quantity, image_snapshot)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  let orderCount = 0;
  for (const o of INITIAL_ORDERS) {
    if (orderExists.get(o.id)) continue;
    insertOrder.run(
      o.id, o.userId ?? null, o.customerName, o.customerEmail, o.customerPhone,
      o.shippingAddress, o.subtotal, o.shippingCost, o.total,
      o.paymentMethod, o.status, o.notes ?? '', o.createdAt,
    );
    for (const it of o.items) {
      insertItem.run(
        o.id, it.productId, it.name, it.category, it.price,
        it.size, it.quantity, it.image,
      );
    }
    orderCount++;
  }

  // ---- สรุป ----
  const counts = (db.prepare(
    `SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM categories) AS categories,
      (SELECT COUNT(*) FROM products) AS products,
      (SELECT COUNT(*) FROM product_images) AS product_images,
      (SELECT COUNT(*) FROM cart_items) AS cart_items,
      (SELECT COUNT(*) FROM orders) AS orders,
      (SELECT COUNT(*) FROM order_items) AS order_items`,
  ).get() ?? {}) as Record<string, number>;
  console.log(`[db] seed done → ${DB_PATH}`);
  console.log(`[db] counts: ${JSON.stringify(counts)} (orders inserted this run: ${orderCount})`);
  db.close();
}

main();
