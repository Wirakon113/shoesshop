-- MONO Shoes Shop — SQLite schema
-- 7 tables: users, categories, products, product_images, cart_items, orders, order_items
-- หมายเหตุ: sizes เก็บเป็น JSON TEXT ใน products.sizes (เช่น "[38,39,40]") เพื่อคง 7 ตารางตามที่ขอ
-- รันด้วย: npx tsx database/init.ts  (อ่านไฟล์นี้แล้วสร้าง database/shop.db)

PRAGMA foreign_keys = ON;

-- ============ 1. users ============
-- แทน localStorage: shoes_shop_users_v2 (ดู src/context/AuthContext.tsx)
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,                       -- e.g. 'user_admin_1', 'user_169...'
  name        TEXT NOT NULL,                          -- ชื่อจริง
  lastname    TEXT NOT NULL DEFAULT '',               -- นามสกุล
  email       TEXT NOT NULL UNIQUE,                   -- อีเมล (unique)
  phone       TEXT DEFAULT '',                        -- เบอร์โทร
  address     TEXT DEFAULT '',                        -- ที่อยู่ (เลขที่/ซอย/ถนน)
  district    TEXT DEFAULT '',                        -- เขต/อำเภอ
  province    TEXT DEFAULT '',                        -- จังหวัด
  postal_code TEXT DEFAULT '',                        -- รหัสไปรษณีย์ 5 หลัก
  username    TEXT NOT NULL UNIQUE,                   -- ชื่อผู้ใช้ login (unique)
  password    TEXT NOT NULL,                          -- demo เก็บ plaintext; production ควรเป็น hash (ดู database/README)
  role        TEXT NOT NULL DEFAULT 'user'
              CHECK (role IN ('admin', 'user')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============ 2. categories ============
-- แทน union type Category ใน src/types.ts ('Running' | 'Lifestyle' | 'Basketball' | 'Training')
CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  slug  TEXT NOT NULL UNIQUE,                         -- 'Running' ตรงกับโค้ดเดิมพอดี
  name_th TEXT NOT NULL DEFAULT ''                    -- ชื่อไทยสำหรับแสดงผล
);

-- ============ 3. products ============
-- แทน localStorage: monoStepProducts (ดู src/data/products.ts + src/utils/localStorage.ts)
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY,                    -- คง id ตัวเลขเดิม (1..30) เพื่อให้ order_items อ้างได้
  sku         TEXT UNIQUE,                            -- e.g. 'MS-RUN-01'
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category_id INTEGER NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
  price       INTEGER NOT NULL CHECK (price > 0),     -- บาท (integer)
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured    INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  is_new      INTEGER NOT NULL DEFAULT 0 CHECK (is_new IN (0, 1)),
  main_image  TEXT NOT NULL DEFAULT '',               -- รูปหลัก (เดิมคือ Product.image)
  sizes       TEXT NOT NULL DEFAULT '[]',             -- JSON array ของ EU sizes, e.g. '[38,39,40,41,42,43,44]'
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- ============ 4. product_images ============
-- แทน Product.additionalImages[] (รูปเสริมต่อสินค้า)
CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- ============ 5. cart_items ============
-- แทน localStorage: shoes_shop_cart_<userId> (ดู src/utils/localStorage.ts)
-- เดิม id ตะกร้า = '<productId>-<size>' → ที่นี่ enforce ด้วย UNIQUE(user_id, product_id, size)
CREATE TABLE IF NOT EXISTS cart_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       INTEGER NOT NULL,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  added_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, product_id, size)
);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- ============ 6. orders ============
-- แทน localStorage: shoes_shop_orders_v1 (ดู src/utils/localStorage.ts INITIAL_ORDERS)
-- กฎค่าส่ง (ดู CheckoutModal.tsx): cartTotal >= 2500 ส่งฟรี ไม่งั้น 150
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,                  -- e.g. 'SS-849201'
  user_id          TEXT REFERENCES users(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT NOT NULL DEFAULT '',
  shipping_address TEXT NOT NULL DEFAULT '',
  subtotal         INTEGER NOT NULL CHECK (subtotal >= 0),
  shipping_cost    INTEGER NOT NULL CHECK (shipping_cost >= 0),
  total            INTEGER NOT NULL CHECK (total >= 0),
  payment_method   TEXT NOT NULL DEFAULT 'promptpay'
                   CHECK (payment_method IN ('promptpay', 'card', 'cod')),
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes            TEXT DEFAULT '',
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- ============ 7. order_items ============
-- แทน OrderItem[] — เก็บ snapshot ชื่อ/ราคา/รูปตอนสั่ง (กัน admin แก้สินค้าทีหลังแล้วประวัติเพี้ยน)
CREATE TABLE IF NOT EXISTS order_items (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id          TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        INTEGER REFERENCES products(id) ON DELETE SET NULL,
  name_snapshot     TEXT NOT NULL,                    -- ชื่อสินค้าตอนสั่ง
  category_snapshot TEXT NOT NULL DEFAULT '',         -- หมวดตอนสั่ง
  price_snapshot    INTEGER NOT NULL CHECK (price_snapshot >= 0),
  size              INTEGER NOT NULL,
  quantity          INTEGER NOT NULL CHECK (quantity > 0),
  image_snapshot    TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
