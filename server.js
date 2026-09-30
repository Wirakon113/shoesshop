// MONO Shoes Shop — localhost API + SQLite
// รัน: 1) npx tsx database/init.ts   2) npm run server  (= tsx server.js)
// frontend dev เรียกผ่าน Vite proxy /api → http://localhost:4000 (ดู vite.config.ts)
import express from 'express';
import bcrypt from 'bcryptjs';
import { openDb, getCategoryId } from './database/db.ts';
import { SEED_USERS, MASTER_ADMIN_USERNAME } from './database/seed-users.ts';
import { INITIAL_PRODUCTS } from './src/data/products.ts';
import { INITIAL_ORDERS } from './src/utils/localStorage.ts';

const PORT = Number(process.env.API_PORT || 4000);
const app = express();
app.use(express.json({ limit: '5mb' }));

const db = openDb();

// ---------- helpers ----------
const toProduct = (row) => ({
  id: row.id,
  sku: row.sku,
  name: row.name,
  description: row.description,
  category: row.category,
  category_id: row.category_id,
  price: row.price,
  stock: row.stock,
  featured: row.featured === 1,
  isNew: row.is_new === 1,
  image: row.main_image,
  sizes: JSON.parse(row.sizes || '[]'),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const imagesOf = (productId) =>
  db
    .prepare(`SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order, id`)
    .all(productId)
    .map((r) => r.image_url);

/** แนบ additionalImages ให้รูปทรงเดียวกับ Product ฝั่ง frontend (รูปหลักก่อน + รูปเสริม) */
const withImages = (product) => ({
  ...product,
  additionalImages: [product.image, ...imagesOf(product.id)],
});

const imagesByProduct = (ids) => {
  if (ids.length === 0) return new Map();
  const rows = db
    .prepare(
      `SELECT product_id, image_url FROM product_images
       WHERE product_id IN (${ids.map(() => '?').join(',')}) ORDER BY sort_order, id`,
    )
    .all(...ids);
  const map = new Map(ids.map((id) => [id, []]));
  for (const r of rows) map.get(r.product_id)?.push(r.image_url);
  return map;
};

/** เขียนแกลเลอรีใหม่ (เก็บเฉพาะรูปเสริม ไม่รวมรูปหลัก — ตรง convention ตอน seed) */
const replaceGallery = (productId, mainImage, additionalImages) => {
  db.prepare(`DELETE FROM product_images WHERE product_id = ?`).run(productId);
  const extras = [...new Set((additionalImages ?? []).filter((u) => u && u !== mainImage))];
  const ins = db.prepare(`INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)`);
  extras.forEach((url, i) => ins.run(productId, url, i + 1));
};

const PRODUCT_COLS = `p.id, p.sku, p.name, p.description, c.slug AS category,
  p.category_id, p.price, p.stock, p.featured, p.is_new, p.main_image, p.sizes,
  p.created_at, p.updated_at`;

// ---------- health ----------
app.get('/api/health', (_req, res) => {
  const counts = db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM products) AS products,
              (SELECT COUNT(*) FROM orders) AS orders,
              (SELECT COUNT(*) FROM users) AS users`,
    )
    .get();
  res.json({ ok: true, ...counts });
});

// ---------- products ----------
app.get('/api/products', (req, res) => {
  const { category = '', search = '', featured = '' } = req.query;
  const where = [];
  const params = [];
  if (category && category !== 'All') {
    where.push('c.slug = ?');
    params.push(category);
  }
  if (featured === '1' || featured === 'true') where.push('p.featured = 1');
  if (search) {
    where.push('(p.name LIKE ? OR p.sku LIKE ? OR c.slug LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  const rows = db
    .prepare(
      `SELECT ${PRODUCT_COLS} FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY p.id`,
    )
    .all(...params);
  const gallery = imagesByProduct(rows.map((r) => r.id));
  res.json(rows.map((r) => {
    const p = toProduct(r);
    return { ...p, additionalImages: [p.image, ...(gallery.get(p.id) ?? [])] };
  }));
});

app.get('/api/products/:id', (req, res) => {
  const row = db
    .prepare(
      `SELECT ${PRODUCT_COLS} FROM products p
       JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
    )
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: 'product not found' });
  res.json(withImages(toProduct(row)));
});

app.post('/api/products', (req, res) => {
  const { name, category = 'Running', price, stock = 0, sku = null, description = '', image = '', additionalImages = [], sizes = [], featured = false, isNew = false } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' });
  if (!(Number(price) > 0)) return res.status(400).json({ error: 'price must be > 0' });
  if (!Array.isArray(sizes) || sizes.length === 0) return res.status(400).json({ error: 'sizes is required' });
  if (typeof category !== 'string' || !category.trim()) return res.status(400).json({ error: 'invalid category' });
  const categoryId = getCategoryId(db, category);
  const info = db
    .prepare(
      `INSERT INTO products (sku, name, description, category_id, price, stock, featured, is_new, main_image, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(sku || null, name.trim(), description, categoryId, Number(price), Number(stock),
      featured ? 1 : 0, isNew ? 1 : 0, image, JSON.stringify(sizes));
  replaceGallery(Number(info.lastInsertRowid), image, additionalImages);
  const row = db.prepare(`SELECT ${PRODUCT_COLS} FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`).get(info.lastInsertRowid);
  res.status(201).json(withImages(toProduct(row)));
});

// ---------- categories (อ้างอิง — 4 หมวดคงที่ตรงกับ type Category ฝั่ง frontend) ----------
app.get('/api/categories', (_req, res) => {
  res.json(db.prepare(`SELECT id, slug, name_th AS nameTh FROM categories ORDER BY id`).all());
});

app.put('/api/products/:id', (req, res) => {
  const cur = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'product not found' });
  const b = req.body ?? {};
  if (b.category !== undefined && (typeof b.category !== 'string' || !b.category.trim())) {
    return res.status(400).json({ error: 'invalid category' });
  }
  if (b.sizes !== undefined && (!Array.isArray(b.sizes) || b.sizes.length === 0)) {
    return res.status(400).json({ error: 'sizes is required' });
  }
  if (b.price !== undefined && !(Number(b.price) > 0)) {
    return res.status(400).json({ error: 'price must be > 0' });
  }
  const categoryId = b.category ? getCategoryId(db, b.category) : cur.category_id;
  const nextMain = b.image ?? cur.main_image;
  // รองรับแก้แกลเลอรีจากหน้า admin (ถ้าส่ง additionalImages มาจะเขียนทับทั้งชุด)
  const galleryTouched = Array.isArray(b.additionalImages);
  try {
    db.exec('BEGIN');
    db.prepare(
      `UPDATE products SET sku=?, name=?, description=?, category_id=?, price=?, stock=?,
       featured=?, is_new=?, main_image=?, sizes=?, updated_at=datetime('now') WHERE id=?`,
    ).run(
      b.sku ?? cur.sku, b.name ?? cur.name, b.description ?? cur.description, categoryId,
      b.price ?? cur.price, b.stock ?? cur.stock,
      b.featured !== undefined ? (b.featured ? 1 : 0) : cur.featured,
      (b.isNew ?? b.is_new) !== undefined ? ((b.isNew ?? b.is_new) ? 1 : 0) : cur.is_new,
      nextMain,
      b.sizes ? JSON.stringify(b.sizes) : cur.sizes,
      req.params.id,
    );
    if (galleryTouched) replaceGallery(Number(req.params.id), nextMain, b.additionalImages);
    db.exec('COMMIT');
  } catch (err) {
    try { db.exec('ROLLBACK'); } catch { /* already rolled back */ }
    throw err;
  }
  const row = db.prepare(`SELECT ${PRODUCT_COLS} FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`).get(req.params.id);
  res.json(withImages(toProduct(row)));
});

app.delete('/api/products/:id', (req, res) => {
  const info = db.prepare(`DELETE FROM products WHERE id = ?`).run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'product not found' });
  res.json({ ok: true });
});

// ---------- users & auth ----------
const safeUser = (row) => {
  if (!row) return row;
  const { password: _pw, postal_code, created_at, ...rest } = row;
  // map snake_case → camelCase ให้ตรง shape เดิมของ frontend (User)
  return { ...rest, postalCode: postal_code, createdAt: created_at };
};

const verifyPassword = (plain, stored) => {
  if (typeof stored === 'string' && stored.startsWith('$2')) {
    return bcrypt.compareSync(plain, stored);
  }
  // fallback บัญชีเก่าที่ seed แบบ plaintext ไว้ก่อนมี bcrypt
  return plain === stored;
};

app.post('/api/auth/login', (req, res) => {
  const { username = '', password = '' } = req.body ?? {};
  const user = db.prepare(`SELECT * FROM users WHERE lower(username) = lower(?)`).get(username.trim());
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }
  res.json(safeUser(user));
});

app.post('/api/auth/register', (req, res) => {
  const { name = '', lastname = '', email = '', phone = '', address = '',
    district = '', province = '', postalCode = '', username = '', password = '' } = req.body ?? {};
  if (!name.trim() || !lastname.trim()) return res.status(400).json({ error: 'กรุณากรอกชื่อ-นามสกุล' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.status(400).json({ error: 'กรุณากรอกอีเมลให้ถูกต้อง' });
  if (!username.trim()) return res.status(400).json({ error: 'กรุณาระบุ Username' });
  if (!address.trim()) return res.status(400).json({ error: 'กรุณาระบุที่อยู่' });
  if (password.length < 6) return res.status(400).json({ error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
  if (username.trim().toLowerCase() === MASTER_ADMIN_USERNAME) {
    return res.status(400).json({ error: 'ชื่อผู้ใช้นี้สงวนสำหรับผู้ดูแลระบบ' });
  }
  const dup = db.prepare(`SELECT 1 FROM users WHERE lower(username) = lower(?) OR lower(email) = lower(?)`).get(username.trim(), email.trim());
  if (dup) return res.status(409).json({ error: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว' });

  const id = `user_${Date.now()}`;
  // สมัครเองได้แค่ role=user เท่านั้น (กันยกระดับสิทธิ์เอง)
  db.prepare(
    `INSERT INTO users (id, name, lastname, email, phone, address, district, province,
       postal_code, username, password, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user')`,
  ).run(id, name.trim(), lastname.trim(), email.trim().toLowerCase(), phone.trim(),
    address.trim(), district.trim(), province.trim(), postalCode.trim(),
    username.trim(), bcrypt.hashSync(password, 10));
  res.status(201).json(safeUser(db.prepare(`SELECT * FROM users WHERE id = ?`).get(id)));
});

app.get('/api/users', (_req, res) => {
  res.json(db.prepare(`SELECT * FROM users ORDER BY created_at DESC`).all().map(safeUser));
});

// admin สร้าง user (กำหนด role ได้)
app.post('/api/users', (req, res) => {
  const { name = '', lastname = '', email = '', phone = '', address = '',
    district = '', province = '', postalCode = '', username = '', password = '', role = 'user' } = req.body ?? {};
  if (!name.trim() || !username.trim() || !email.trim() || password.length < 6) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบหรือไม่ถูกต้อง' });
  }
  if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'invalid role' });
  const dup = db.prepare(`SELECT 1 FROM users WHERE lower(username) = lower(?)`).get(username.trim());
  if (dup) return res.status(409).json({ error: `Username "${username.trim()}" ถูกใช้งานแล้ว` });
  const id = `user_${Date.now()}`;
  db.prepare(
    `INSERT INTO users (id, name, lastname, email, phone, address, district, province,
       postal_code, username, password, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, name.trim(), lastname.trim(), email.trim().toLowerCase(), phone.trim(),
    address.trim(), district.trim(), province.trim(), postalCode.trim(),
    username.trim(), bcrypt.hashSync(password, 10), role);
  res.status(201).json(safeUser(db.prepare(`SELECT * FROM users WHERE id = ?`).get(id)));
});

app.patch('/api/users/:id', (req, res) => {
  const cur = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' });
  const b = req.body ?? {};
  const isMaster = cur.username.toLowerCase() === MASTER_ADMIN_USERNAME;
  if (isMaster && b.role && b.role !== 'admin') {
    return res.status(403).json({ error: 'ไม่สามารถเปลี่ยน Role ของบัญชี Super Admin หลักได้' });
  }
  if (b.username && b.username.trim().toLowerCase() !== cur.username.toLowerCase()) {
    const dup = db.prepare(`SELECT 1 FROM users WHERE lower(username) = lower(?) AND id != ?`).get(b.username.trim(), req.params.id);
    if (dup) return res.status(409).json({ error: `Username "${b.username.trim()}" ถูกใช้งานแล้ว` });
  }
  db.prepare(
    `UPDATE users SET name=?, lastname=?, email=?, phone=?, address=?, district=?,
       province=?, postal_code=?, username=?, role=?
     WHERE id=?`,
  ).run(
    b.name ?? cur.name, b.lastname ?? cur.lastname,
    (b.email ?? cur.email).toLowerCase(), b.phone ?? cur.phone,
    b.address ?? cur.address, b.district ?? cur.district,
    b.province ?? cur.province, (b.postalCode ?? cur.postal_code),
    (b.username ?? cur.username).trim(), b.role ?? cur.role,
  );
  if (b.password && b.password.length > 0) {
    db.prepare(`UPDATE users SET password=? WHERE id=?`).run(bcrypt.hashSync(b.password, 10), req.params.id);
  }
  res.json(safeUser(db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.params.id)));
});

app.delete('/api/users/:id', (req, res) => {
  const cur = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'ไม่พบผู้ใช้ที่ต้องการลบ' });
  if (cur.username.toLowerCase() === MASTER_ADMIN_USERNAME) {
    return res.status(403).json({ error: 'ไม่อนุญาตให้ลบบัญชี Super Admin หลัก' });
  }
  db.prepare(`DELETE FROM users WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

// ---------- cart ----------
app.get('/api/cart', (req, res) => {
  const { userId = '' } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const rows = db
    .prepare(
      `SELECT ci.id, ci.product_id AS productId, p.name, c.slug AS category,
              p.price, ci.size, ci.quantity, p.main_image AS image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       JOIN categories c ON c.id = p.category_id
       WHERE ci.user_id = ? ORDER BY ci.id`,
    )
    .all(userId);
  // map id ตะกร้าเป็น '<productId>-<size>' ให้ตรง shape เดิมของ frontend (CartItem.id)
  res.json(rows.map((r) => ({ ...r, id: `${r.productId}-${r.size}` })));
});

app.post('/api/cart', (req, res) => {
  const { userId, productId, size, quantity = 1 } = req.body ?? {};
  if (!userId || !productId || !size) return res.status(400).json({ error: 'userId, productId, size are required' });
  const exists = db.prepare(`SELECT 1 FROM products WHERE id = ?`).get(productId);
  if (!exists) return res.status(400).json({ error: `product not found: ${productId}` });
  db.prepare(
    `INSERT INTO cart_items (user_id, product_id, size, quantity)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, product_id, size) DO UPDATE SET quantity = quantity + excluded.quantity`,
  ).run(userId, productId, size, quantity);
  res.status(201).json({ ok: true });
});

// ตั้งจำนวนแบบเจาะจง (quantity <= 0 = ลบรายการนั้น)
app.put('/api/cart', (req, res) => {
  const { userId, productId, size, quantity } = req.body ?? {};
  if (!userId || !productId || !size || quantity === undefined) {
    return res.status(400).json({ error: 'userId, productId, size, quantity are required' });
  }
  if (Number(quantity) <= 0) {
    db.prepare(`DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?`).run(userId, productId, size);
  } else {
    db.prepare(`UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND size = ?`)
      .run(Number(quantity), userId, productId, size);
  }
  res.json({ ok: true });
});

app.delete('/api/cart', (req, res) => {
  const { userId = '', productId, size } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (productId && size) {
    db.prepare(`DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?`).run(userId, productId, size);
  } else {
    db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId);
  }
  res.json({ ok: true });
});

// ---------- orders (transaction: สร้างออเดอร์ + ตัดสต็อก + ล้างตะกร้า) ----------
app.get('/api/orders', (req, res) => {
  const { userId = '', status = '' } = req.query;
  const where = [];
  const params = [];
  if (userId) {
    where.push('o.user_id = ?');
    params.push(userId);
  }
  if (status && status !== 'all') {
    where.push('o.status = ?');
    params.push(status);
  }
  const orders = db
    .prepare(`SELECT * FROM orders o ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY o.created_at DESC`)
    .all(...params);
  const itemStmt = db.prepare(`SELECT * FROM order_items WHERE order_id = ? ORDER BY id`);
  res.json(
    orders.map((o) => ({
      id: o.id, userId: o.user_id, customerName: o.customer_name, customerEmail: o.customer_email,
      customerPhone: o.customer_phone, shippingAddress: o.shipping_address, subtotal: o.subtotal,
      shippingCost: o.shipping_cost, total: o.total, paymentMethod: o.payment_method,
      status: o.status, createdAt: o.created_at, notes: o.notes,
      items: itemStmt.all(o.id).map((it) => ({
        productId: it.product_id, name: it.name_snapshot, category: it.category_snapshot,
        price: it.price_snapshot, size: it.size, quantity: it.quantity, image: it.image_snapshot,
      })),
    })),
  );
});

app.post('/api/orders', (req, res) => {
  const { userId = null, customerName, customerEmail, customerPhone = '', shippingAddress = '',
    items = [], paymentMethod = 'promptpay', notes = '' } = req.body ?? {};
  if (!customerName?.trim() || !customerEmail?.trim()) return res.status(400).json({ error: 'customerName/customerEmail are required' });
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items is empty' });

  // คำนวณยอดด้วยราคาจริงจาก DB (ไม่เชื่อราคาจาก client) + กฎค่าส่งเดียวกับ CheckoutModal
  let subtotal = 0;
  const lines = [];
  for (const it of items) {
    const p = db.prepare(`SELECT p.*, c.slug AS category FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`).get(it.productId);
    if (!p) return res.status(400).json({ error: `product not found: ${it.productId}` });
    if (p.stock < it.quantity) return res.status(400).json({ error: `สต็อก ${p.name} ไม่พอ (เหลือ ${p.stock})` });
    subtotal += p.price * it.quantity;
    lines.push({ p, size: it.size, quantity: it.quantity });
  }
  const shippingCost = subtotal >= 2500 ? 0 : 150;
  const total = subtotal + shippingCost;
  const id = `SS-${Math.floor(100000 + Math.random() * 900000)}`;

  // node:sqlite ไม่มี db.transaction() แบบ better-sqlite3 → ใช้ BEGIN/COMMIT เอง
  try {
    db.exec('BEGIN');
    db.prepare(
      `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone,
        shipping_address, subtotal, shipping_cost, total, payment_method, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    ).run(id, userId, customerName.trim(), customerEmail.trim(), customerPhone,
      shippingAddress, subtotal, shippingCost, total, paymentMethod, notes);
    const insItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, name_snapshot, category_snapshot,
        price_snapshot, size, quantity, image_snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const cutStock = db.prepare(`UPDATE products SET stock = stock - ?, updated_at=datetime('now') WHERE id = ?`);
    for (const l of lines) {
      insItem.run(id, l.p.id, l.p.name, l.p.category, l.p.price, l.size, l.quantity, l.p.main_image);
      cutStock.run(l.quantity, l.p.id);
    }
    if (userId) db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId);
    db.exec('COMMIT');
  } catch (err) {
    try { db.exec('ROLLBACK'); } catch { /* already rolled back */ }
    throw err;
  }
  const created = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(id);
  const createdItems = db.prepare(`SELECT * FROM order_items WHERE order_id = ? ORDER BY id`).all(id);
  // คืน Order เต็มรูป (รวม createdAt) ให้ CheckoutModal ใช้ต่อได้ทันที
  res.status(201).json({
    id: created.id, userId: created.user_id, customerName: created.customer_name,
    customerEmail: created.customer_email, customerPhone: created.customer_phone,
    shippingAddress: created.shipping_address, subtotal: created.subtotal,
    shippingCost: created.shipping_cost, total: created.total,
    paymentMethod: created.payment_method, status: created.status,
    createdAt: created.created_at, notes: created.notes,
    items: createdItems.map((it) => ({
      productId: it.product_id, name: it.name_snapshot, category: it.category_snapshot,
      price: it.price_snapshot, size: it.size, quantity: it.quantity, image: it.image_snapshot,
    })),
  });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status = '', cancelReason = '' } = req.body ?? {};
  const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: `invalid status: ${status}` });
  const cur = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'order not found' });
  // ยกเลิกพร้อมเหตุผล → ต่อท้าย notes แบบเดียวกับ StoreContext.cancelOrder เดิม
  const notes = cancelReason
    ? `${cur.notes ? cur.notes + ' | ' : ''}เหตุผลที่ยกเลิก: ${cancelReason}`
    : cur.notes;
  db.prepare(`UPDATE orders SET status = ?, notes = ? WHERE id = ?`).run(status, notes, req.params.id);
  res.json({ ok: true, id: req.params.id, status });
});

app.delete('/api/orders/:id', (req, res) => {
  const info = db.prepare(`DELETE FROM orders WHERE id = ?`).run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'order not found' });
  res.json({ ok: true });
});

// ---------- admin resets (เทียบเท่า resetปุ่มในหน้า Admin: ล้างแล้ว seed ใหม่) ----------
app.post('/api/admin/reset-users', (_req, res) => {
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
  // ลบ user ที่ไม่ได้อยู่ใน seed (คง orders ไว้โดย user_id กลายเป็น NULL ผ่าน FK)
  const keepIds = SEED_USERS.map((u) => u.id);
  db.prepare(`DELETE FROM users WHERE id NOT IN (${keepIds.map(() => '?').join(',')})`).run(...keepIds);
  for (const u of SEED_USERS) {
    insertUser.run(u.id, u.name, u.lastname, u.email, u.phone, u.address, u.district,
      u.province, u.postal_code, u.username, bcrypt.hashSync(u.password, 10), u.role, u.created_at);
  }
  res.json({ ok: true });
});

app.post('/api/admin/reset-products', (_req, res) => {
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
  const insertImage = db.prepare(`INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)`);
  for (const p of INITIAL_PRODUCTS) {
    const categoryId = getCategoryId(db, p.category);
    insertProduct.run(p.id, p.sku ?? null, p.name, p.description, categoryId, p.price, p.stock,
      p.featured ? 1 : 0, p.isNew ? 1 : 0, p.image, JSON.stringify(p.sizes));
    deleteImages.run(p.id);
    (p.additionalImages ?? []).filter((u) => u !== p.image)
      .forEach((url, i) => insertImage.run(p.id, url, i + 1));
  }
  res.json({ ok: true });
});

app.post('/api/admin/reset-orders', (_req, res) => {
  const insertOrder = db.prepare(
    `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone,
       shipping_address, subtotal, shipping_cost, total, payment_method, status, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO NOTHING`,
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_id, name_snapshot, category_snapshot,
       price_snapshot, size, quantity, image_snapshot)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const o of INITIAL_ORDERS) {
    insertOrder.run(o.id, o.userId ?? null, o.customerName, o.customerEmail, o.customerPhone,
      o.shippingAddress, o.subtotal, o.shippingCost, o.total, o.paymentMethod, o.status, o.notes ?? '', o.createdAt);
    // กัน items ซ้ำเมื่อ seed ทับ: ลบของเดิมแล้วใส่ใหม่
    db.prepare(`DELETE FROM order_items WHERE order_id = ?`).run(o.id);
    for (const it of o.items) {
      insertItem.run(o.id, it.productId, it.name, it.category, it.price, it.size, it.quantity, it.image);
    }
  }
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT} (db: ${process.env.SHOP_DB_PATH || 'database/mono-shop.db'})`));
