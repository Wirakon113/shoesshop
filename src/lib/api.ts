// Client เรียก localhost SQLite API (ใช้เมื่อรัน `npm run server` + `npm run dev` คู่กัน)
// ถ้า API ไม่ติด (เช่น เปิดบน GitHub Pages) ให้ caller fallback ไปใช้ localStorage เดิม
const BASE = '';

async function req(path: string, init?: RequestInit, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error || `request failed: ${res.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// probe ครั้งเดียวแล้วจำผล (มี server ไหม?) — contexts ใช้ตัวนี้เลือกโหมด API vs localStorage
// จำเฉพาะผล true ไว้ยาวๆ ส่วนผล false จะ probe ใหม่ถ้าผ่านไปเกิน STALE_MS (กันติดโหมด local ค้าง)
let cached: boolean | null = null;
let lastProbeAt = 0;
let inflight: Promise<boolean> | null = null;
const STALE_MS = 60000;

async function probeApi(timeoutMs: number): Promise<boolean> {
  try {
    const h = (await req('/api/health', undefined, timeoutMs)) as { ok?: boolean };
    return h.ok === true;
  } catch {
    return false;
  }
}

function freshProbe(timeoutMs: number): Promise<boolean> {
  if (!inflight) {
    inflight = probeApi(timeoutMs).then((ok) => {
      cached = ok;
      lastProbeAt = Date.now();
      inflight = null;
      return ok;
    });
  }
  return inflight;
}

export function isApiAvailable(): Promise<boolean> {
  if (cached === true) return Promise.resolve(true);
  if (cached === false && Date.now() - lastProbeAt < STALE_MS) return Promise.resolve(false);
  return freshProbe(2500);
}

/** เรียกตอน mount: ลองหลายรอบเผื่อ server (tsx) กำลัง cold start — ไม่บล็อกการ render ครั้งแรก */
export function waitForApi(tries = 4, timeoutMs = 3000): Promise<boolean> {
  const attempt = async (n: number): Promise<boolean> => {
    const ok = await freshProbe(timeoutMs);
    if (ok || n <= 1) return ok;
    await new Promise((r) => setTimeout(r, 1200));
    inflight = null; // บังคับ probe ใหม่รอบถัดไป
    return attempt(n - 1);
  };
  return attempt(tries);
}

/** ปุ่ม reconnect: บังคับ probe ใหม่ทันที ไม่สน cache */
export function reconnectApi(): Promise<boolean> {
  inflight = null;
  return freshProbe(5000);
}

export const shopApi = {
  health: () => req('/api/health'),
  products: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/api/products${q ? `?${q}` : ''}`);
  },
  product: (id: number) => req(`/api/products/${id}`),
  createProduct: (payload: Record<string, unknown>) =>
    req('/api/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (id: number, payload: Record<string, unknown>) =>
    req(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id: number) => req(`/api/products/${id}`, { method: 'DELETE' }),
  categories: () => req('/api/categories'),
  login: (username: string, password: string) =>
    req('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (payload: Record<string, unknown>) =>
    req('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  users: () => req('/api/users'),
  createUser: (payload: Record<string, unknown>) =>
    req('/api/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id: string, payload: Record<string, unknown>) =>
    req(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteUser: (id: string) => req(`/api/users/${id}`, { method: 'DELETE' }),
  cart: (userId: string) => req(`/api/cart?userId=${encodeURIComponent(userId)}`),
  addToCart: (userId: string, productId: number, size: number, quantity = 1) =>
    req('/api/cart', { method: 'POST', body: JSON.stringify({ userId, productId, size, quantity }) }),
  setCartQuantity: (userId: string, productId: number, size: number, quantity: number) =>
    req('/api/cart', { method: 'PUT', body: JSON.stringify({ userId, productId, size, quantity }) }),
  removeFromCart: (userId: string, productId: number, size: number) =>
    req(`/api/cart?userId=${encodeURIComponent(userId)}&productId=${productId}&size=${size}`, { method: 'DELETE' }),
  clearCart: (userId: string) =>
    req(`/api/cart?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' }),
  orders: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/api/orders${q ? `?${q}` : ''}`);
  },
  createOrder: (payload: Record<string, unknown>) =>
    req('/api/orders', { method: 'POST', body: JSON.stringify(payload) }),
  updateOrderStatus: (id: string, status: string, cancelReason?: string) =>
    req(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, cancelReason }) }),
  deleteOrder: (id: string) => req(`/api/orders/${id}`, { method: 'DELETE' }),
  resetUsers: () => req('/api/admin/reset-users', { method: 'POST' }),
  resetProducts: () => req('/api/admin/reset-products', { method: 'POST' }),
  resetOrders: () => req('/api/admin/reset-orders', { method: 'POST' }),
};
