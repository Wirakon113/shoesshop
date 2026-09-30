// รายชื่อ user ตั้งต้น — ใช้ร่วมกันระหว่าง database/init.ts (seed)
// กับ server.js (reset endpoint) จะได้ตรงกันที่เดียว
// หมายเหตุ: password ที่นี่คือรหัสตั้งต้น (plaintext) — ตอน seed ลง DB
// จะถูก hash ด้วย bcrypt ก่อนเสมอ ห้ามเก็บ plaintext ลงตาราง users
export interface SeedUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postal_code: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  created_at: string;
}

export const SEED_USERS: SeedUser[] = [
  {
    id: 'user_admin_1',
    name: 'ผู้ดูแลระบบ',
    lastname: 'ShoesShop',
    email: 'admin@gmail.com.com',
    phone: '081-234-5678',
    address: '100/1 ศูนย์การค้าสยามสแควร์ แขวงปทุมวัน',
    district: 'ปทุมวัน',
    province: 'กรุงเทพมหานคร',
    postal_code: '10330',
    username: 'admin2547',
    password: 'admin2547',
    role: 'admin',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user_demo_1',
    name: 'สมชาย',
    lastname: 'ใจดี',
    email: 'somchai@example.com',
    phone: '089-987-6543',
    address: '99/1 ถ.สุขุมวิท แขวงคลองเตย',
    district: 'คลองเตย',
    province: 'กรุงเทพมหานคร',
    postal_code: '10110',
    username: 'demo',
    password: 'password123',
    role: 'user',
    created_at: '2026-02-15T08:30:00.000Z',
  },
  {
    id: 'user_demo_2',
    name: 'กานดา',
    lastname: 'รักษ์ดี',
    email: 'kanda.r@example.com',
    phone: '084-555-1234',
    address: '254/8 ซอยทองหล่อ 10 แขวงคลองตันเหนือ',
    district: 'วัฒนา',
    province: 'กรุงเทพมหานคร',
    postal_code: '10110',
    username: 'kanda',
    password: 'password123',
    role: 'user',
    created_at: '2026-03-01T10:15:00.000Z',
  },
];

// กฎเดียวกับ AuthContext เดิม: บัญชีหลักห้ามแตะ
export const MASTER_ADMIN_USERNAME = 'admin2547';
