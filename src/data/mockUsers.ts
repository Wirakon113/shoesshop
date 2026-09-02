import { User } from '../types';

export const USERS_STORAGE_KEY = 'shoes_shop_users_v2';
export const CURRENT_USER_STORAGE_KEY = 'shoes_shop_current_user_v2';
export const REMEMBERED_USERNAME_KEY = 'shoes_shop_remembered_username_v1';

/**
 * บัญชีผู้ใช้ตั้งต้น (Initial Mock Users)
 * รวมข้อมูลสำคัญ: name, lastname, email, phone, address, province, district, postalCode, username, password, role
 */
export const INITIAL_MOCK_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'ผู้ดูแลระบบ',
    lastname: 'ShoesShop',
    email: 'admin@shoesshop.com',
    phone: '081-234-5678',
    address: '100/1 ศูนย์การค้าสยามสแควร์ อาคารวันสยาม ชั้น 4',
    district: 'ปทุมวัน',
    province: 'กรุงเทพมหานคร',
    postalCode: '10330',
    username: 'admin2547',
    password: 'admin2547',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user_demo_1',
    name: 'สมชาย',
    lastname: 'ใจดี',
    email: 'somchai@example.com',
    phone: '089-987-6543',
    address: '99/1 ถ.สุขุมวิท ซอยสุขุมวิท 24 แขวงคลองตัน',
    district: 'คลองเตย',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    username: 'demo',
    password: 'password123',
    role: 'user',
    createdAt: '2026-02-15T08:30:00.000Z',
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
    postalCode: '10110',
    username: 'kanda',
    password: 'password123',
    role: 'user',
    createdAt: '2026-03-01T10:15:00.000Z',
  },
  {
    id: 'user_demo_3',
    name: 'วีรภัทร',
    lastname: 'มงคลสุข',
    email: 'weerapat.m@example.com',
    phone: '082-111-9988',
    address: '128/45 ถนนพหลโยธิน แขวงลาดยาว',
    district: 'จตุจักร',
    province: 'กรุงเทพมหานคร',
    postalCode: '10900',
    username: 'weerapat',
    password: 'password123',
    role: 'user',
    createdAt: '2026-03-02T04:00:00.000Z',
  },
];

/**
 * ตัวแปรเก็บรายชื่อ User ในระบบ (Active Mock Users in memory)
 */
export let MOCK_USERS: User[] = [...INITIAL_MOCK_USERS];

/**
 * ดึงข้อมูลผู้ใช้ทั้งหมดจาก LocalStorage หรือ MockUsers
 */
export const getStoredMockUsers = (): User[] => {
  if (typeof window === 'undefined') return MOCK_USERS;
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // ตรวจสอบว่ามีบัญชี admin2547 อยู่ในระบบเสมอ
        const hasAdmin = parsed.some((u: User) => u.username.toLowerCase() === 'admin2547');
        let updatedList = parsed.map((u: User) => ({
          ...u,
          role: u.role || (u.username.toLowerCase() === 'admin2547' ? 'admin' : 'user'),
        }));
        if (!hasAdmin) {
          updatedList = [INITIAL_MOCK_USERS[0], ...updatedList];
        }
        MOCK_USERS = updatedList;
        return updatedList;
      }
    }
    // ถ้ายังไม่มีใน LocalStorage ให้บันทึกค่าเริ่มต้นลงไป
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
    MOCK_USERS = [...INITIAL_MOCK_USERS];
    return MOCK_USERS;
  } catch (error) {
    console.error('Error reading mock users from storage:', error);
    return MOCK_USERS;
  }
};

/**
 * บันทึกรายการผู้ใช้ทั้งหมดลงใน LocalStorage และอัปเดตตัวแปร MOCK_USERS
 */
export const saveMockUsers = (users: User[]): void => {
  MOCK_USERS = [...users];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving mock users to storage:', error);
    }
  }
};

/**
 * เพิ่ม User ใหม่เข้าไปใน MOCK_USERS และบันทึกลง LocalStorage
 */
export const addMockUser = (newUser: User): User[] => {
  const current = getStoredMockUsers();
  const updated = [...current, newUser];
  saveMockUsers(updated);
  return updated;
};

/**
 * อัปเดตข้อมูล User ใน MOCK_USERS
 */
export const updateMockUser = (userId: string, updatedData: Partial<User>): User[] => {
  const current = getStoredMockUsers();
  const updated = current.map((user) => (user.id === userId ? { ...user, ...updatedData } : user));
  saveMockUsers(updated);
  return updated;
};

/**
 * ลบ User ออกจาก MOCK_USERS
 */
export const deleteMockUser = (userId: string): User[] => {
  const current = getStoredMockUsers();
  const updated = current.filter((user) => user.id !== userId);
  saveMockUsers(updated);
  return updated;
};

/**
 * คืนค่าผู้ใช้เริ่มต้น (Reset to default initial mock users)
 */
export const resetMockUsersToDefault = (): User[] => {
  saveMockUsers(INITIAL_MOCK_USERS);
  return [...INITIAL_MOCK_USERS];
};
