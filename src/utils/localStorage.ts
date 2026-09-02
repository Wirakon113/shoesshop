import { Product, CartItem, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'monoStepProducts';
const CART_STORAGE_KEY = 'monoStepCart';
const ORDERS_STORAGE_KEY = 'shoes_shop_orders_v1';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SS-849201',
    userId: 'user_demo_1',
    customerName: 'สมชาย ใจดี',
    customerEmail: 'somchai@example.com',
    customerPhone: '089-987-6543',
    shippingAddress: '99/1 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    items: [
      {
        productId: 1,
        name: 'Nike Air Zoom Pegasus 40',
        category: 'Running',
        price: 4600,
        size: 42,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      },
      {
        productId: 3,
        name: 'Jordan Stay Loyal 3',
        category: 'Basketball',
        price: 4300,
        size: 43,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop',
      }
    ],
    subtotal: 8900,
    shippingCost: 0,
    total: 8900,
    paymentMethod: 'promptpay',
    status: 'processing',
    createdAt: '2026-03-01T14:20:00.000Z',
    notes: 'ฝากวางไว้ที่ตู้รับพัสดุหน้าบ้านครับ',
  },
  {
    id: 'SS-802194',
    userId: 'user_demo_1',
    customerName: 'สมชาย ใจดี',
    customerEmail: 'somchai@example.com',
    customerPhone: '089-987-6543',
    shippingAddress: '99/1 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    items: [
      {
        productId: 6,
        name: 'Nike Metcon 9',
        category: 'Training',
        price: 5200,
        size: 42,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
      }
    ],
    subtotal: 5200,
    shippingCost: 0,
    total: 5200,
    paymentMethod: 'card',
    status: 'delivered',
    createdAt: '2026-02-18T11:30:00.000Z',
    notes: 'ได้รับสินค้าเรียบร้อย สวยมากครับ',
  },
  {
    id: 'SS-791054',
    userId: 'user_demo_1',
    customerName: 'สมชาย ใจดี',
    customerEmail: 'somchai@example.com',
    customerPhone: '089-987-6543',
    shippingAddress: '99/1 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    items: [
      {
        productId: 8,
        name: 'Nike Dunk Low Retro',
        category: 'Lifestyle',
        price: 3700,
        size: 42,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=1000&auto=format&fit=crop',
      }
    ],
    subtotal: 3700,
    shippingCost: 0,
    total: 3700,
    paymentMethod: 'promptpay',
    status: 'cancelled',
    createdAt: '2026-02-10T16:45:00.000Z',
    notes: 'ขอยกเลิกคำสั่งซื้อเนื่องจากเปลี่ยนใจเรื่องสีรองเท้าครับ',
  },
  {
    id: 'SS-718293',
    userId: 'user_demo_2',
    customerName: 'กานดา รักษ์ดี',
    customerEmail: 'kanda.r@example.com',
    customerPhone: '084-555-1234',
    shippingAddress: '254/8 ซอยทองหล่อ 10 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
    items: [
      {
        productId: 2,
        name: 'Adidas Ultraboost Light',
        category: 'Running',
        price: 5900,
        size: 39,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop',
      }
    ],
    subtotal: 5900,
    shippingCost: 0,
    total: 5900,
    paymentMethod: 'card',
    status: 'shipped',
    createdAt: '2026-02-28T09:45:00.000Z',
  },
  {
    id: 'SS-620194',
    customerName: 'ธนากร มั่งมี',
    customerEmail: 'thanakorn@example.com',
    customerPhone: '081-112-2334',
    shippingAddress: '15/22 ซอยอารีย์สัมพันธ์ 1 ถ.พหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพมหานคร 10400',
    items: [
      {
        productId: 4,
        name: 'New Balance 9060',
        category: 'Lifestyle',
        price: 5500,
        size: 41,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop',
      }
    ],
    subtotal: 5500,
    shippingCost: 0,
    total: 5500,
    paymentMethod: 'cod',
    status: 'pending',
    createdAt: '2026-03-02T01:10:00.000Z',
    notes: 'โทรแจ้งก่อนส่งประมาณ 15 นาที',
  },
  {
    id: 'SS-551029',
    customerName: 'พิมพ์ใจ รัตนศิลป์',
    customerEmail: 'pimjai@example.com',
    customerPhone: '086-777-8899',
    shippingAddress: '88/9 หมู่บ้านปัญญารามอินทรา แขวงคันนายาว เขตคันนายาว กรุงเทพมหานคร 10230',
    items: [
      {
        productId: 5,
        name: 'Asics GEL-KAYANO 30',
        category: 'Running',
        price: 6500,
        size: 40,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1551107696-a4b085a6d9a0?q=80&w=1000&auto=format&fit=crop',
      }
    ],
    subtotal: 6500,
    shippingCost: 0,
    total: 6500,
    paymentMethod: 'promptpay',
    status: 'delivered',
    createdAt: '2026-02-24T16:00:00.000Z',
  }
];

// Products Storage Helpers
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      // Seed with initial products
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    // Auto-fix any stale placeholder dumbbell image
    let hasMigrated = false;
    const sanitized = parsed.map((prod: Product) => {
      if (prod.image && prod.image.includes('1584735935682-2f2b69dff9d2')) {
        hasMigrated = true;
        const newImg = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop';
        return {
          ...prod,
          image: newImg,
          additionalImages: prod.additionalImages?.map((img) =>
            img.includes('1584735935682-2f2b69dff9d2') ? newImg : img
          ) || [newImg],
        };
      }
      return prod;
    });

    if (hasMigrated) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch (error) {
    console.error('Error reading products from localStorage:', error);
    return INITIAL_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
}

export function resetStoredProducts(): Product[] {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  } catch (error) {
    console.error('Error resetting products:', error);
    return INITIAL_PRODUCTS;
  }
}

// Cart Storage Helpers
export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: CartItem) => {
      if (item.image && item.image.includes('1584735935682-2f2b69dff9d2')) {
        return {
          ...item,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
        };
      }
      return item;
    });
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

export function getStoredUserCart(userId?: string): CartItem[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`shoes_shop_cart_${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: CartItem) => {
      if (item.image && item.image.includes('1584735935682-2f2b69dff9d2')) {
        return {
          ...item,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
        };
      }
      return item;
    });
  } catch (error) {
    console.error('Error reading user cart from localStorage:', error);
    return [];
  }
}

export function saveStoredUserCart(userId: string, cart: CartItem[]): void {
  if (!userId) return;
  try {
    localStorage.setItem(`shoes_shop_cart_${userId}`, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving user cart to localStorage:', error);
  }
}

// Orders Storage Helpers
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading orders from localStorage:', error);
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
}

export function resetStoredOrders(): Order[] {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  } catch (error) {
    console.error('Error resetting orders:', error);
    return INITIAL_ORDERS;
  }
}

