export type Category = 'Running' | 'Lifestyle' | 'Basketball' | 'Training';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  additionalImages?: string[];
  sizes: number[];
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  sku?: string;
}

export interface CartItem {
  id: string; // Unique cart item ID (combines product id and size)
  productId: number;
  name: string;
  category: Category;
  price: number;
  size: number;
  quantity: number;
  image: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
  category: string;
  search: string;
  sortBy: SortOption;
  minPrice?: number;
  maxPrice?: number;
  selectedSize?: number | null;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  address: string;
  postalCode?: string;
  province?: string;
  district?: string;
  phone?: string;
  username: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  lastname: string;
  email: string;
  address: string;
  postalCode: string;
  province?: string;
  district?: string;
  phone?: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  role?: UserRole;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  category: Category;
  price: number;
  size: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. SS-839201
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'promptpay' | 'card' | 'cod';
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}
