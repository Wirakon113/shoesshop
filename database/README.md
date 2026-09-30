# database/ — SQLite ของร้าน MONO

SQLite จริง (ไฟล์ `mono-shop.db`) สำหรับรัน **localhost** ก่อนเอาไป deploy จริง

## โครงสร้าง

| ไฟล์ | หน้าที่ |
|---|---|
| `schema.sql` | CREATE TABLE ทั้ง 7: `users`, `categories`, `products`, `product_images`, `cart_items`, `orders`, `order_items` |
| `db.ts` | helper เปิด DB ด้วย `node:sqlite` (built-in Node 22+, ไม่ต้องลง package) |
| `init.ts` | สร้าง + seed DB จากข้อมูลเดิมของเว็บ (`INITIAL_PRODUCTS` 30 คู่, users 3 คน, orders ตัวอย่าง) |
| `mono-shop.db` | ไฟล์ DB จริง (ถูก gitignore — ไม่ commit) |

## ตารางเก็บอะไร (สรุป)

- **users** — แทน `shoes_shop_users_v2`: ข้อมูลสมัครสมาชิก + role (`admin`/`user`)
- **categories** — แทน union `Category`: Running / Lifestyle / Basketball / Training
- **products** — แทน `monoStepProducts`: sku/ชื่อ/ราคา/สต็อก/featured/isNew/รูปหลัก + `sizes` (JSON เช่น `[38,39,40]`)
- **product_images** — แทน `additionalImages[]`: รูปเสริมต่อสินค้า
- **cart_items** — แทน `shoes_shop_cart_<userId>`: ตะกร้าผูกกับ user (`UNIQUE(user_id, product_id, size)`)
- **orders** — แทน `shoes_shop_orders_v1`: หัวบิล + ยอด + ช่องทางจ่าย + สถานะ 5 ขั้น
- **order_items** — แทน `OrderItem[]`: เก็บ **snapshot** ชื่อ/ราคา/รูปตอนสั่ง (admin แก้สินค้าทีหลัง ประวัติไม่เพี้ยน)

## วิธีรันทดสอบ localhost

```powershell
npx tsx database/init.ts --reset   # สร้าง mono-shop.db + seed ใหม่
npm run server                     # API ที่ http://localhost:4000 (รันผ่าน tsx)
npm run dev                        # หน้าเว็บที่ http://localhost:3000 (proxy /api → :4000)
```

เช็คว่าบันทึก/แสดงผลได้จริง:

```powershell
Invoke-RestMethod http://localhost:4000/api/health
Invoke-RestMethod "http://localhost:4000/api/products?category=Running"
Invoke-RestMethod -Method Post http://localhost:4000/api/auth/login `
  -ContentType 'application/json' -Body '{"username":"demo","password":"password123"}'
```

## ก่อนขึ้น production จริง

1. **รหัสผ่านต้อง hash** (ตอนนี้ seed เก็บ plaintext ตาม demo เดิม) — ใช้ `bcryptjs` + column `password_hash`
2. ย้าย secret/connection string ลง `.env` (ดู `.env.example`)
3. ใช้ `mono-shop.db` บน volume ของ server จริง (อย่า commit ไฟล์ `.db` ขึ้น git)

> หมายเหตุ: ในโฟลเดอร์อาจมี `shop.db` เก่าค้างอยู่ — ไฟล์นั้นถูกล็อกโดยโปรแกรมภายนอก
> (เช่น เปิดดูใน VS Code/DB Browser) จนเขียนไม่ได้ จึงย้ายข้อมูลทั้งหมดมา `mono-shop.db`
> แทน (รวม user ที่สมัครผ่านเว็บแล้ว) เมื่อปิดโปรแกรมที่เปิด `shop.db` ค้างไว้แล้ว
> สามารถลบ `shop.db*` ทิ้งได้เลย
