import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { useAuth } from './AuthContext';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredUserCart,
  saveStoredUserCart,
  resetStoredProducts,
  getStoredOrders,
  saveStoredOrders,
  resetStoredOrders,
} from '../utils/localStorage';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  cartTotal: number;
  cartCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (product: Product, size: number, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (id: number, productData: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  resetCatalog: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  reorderItems: (orderItems: Order['items']) => void;
  deleteOrder: (orderId: string) => void;
  resetOrdersCatalog: () => void;
  getProductById: (id: number) => Product | undefined;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [cart, setCart] = useState<CartItem[]>(() => (currentUser ? getStoredUserCart(currentUser.id) : []));
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync cart when user logs in / logs out
  useEffect(() => {
    if (currentUser) {
      setCart(getStoredUserCart(currentUser.id));
    } else {
      setCart([]);
    }
  }, [currentUser?.id]);

  // Sync products to local storage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  // Sync user-specific cart to local storage
  useEffect(() => {
    if (currentUser) {
      saveStoredUserCart(currentUser.id, cart);
    }
  }, [cart, currentUser?.id]);

  // Sync orders to local storage
  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, size: number, quantity = 1) => {
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า', 'info');
      return;
    }

    const cartItemId = `${product.id}-${size}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          size,
          quantity,
          image: product.image,
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`เพิ่ม ${product.name} (ไซส์ ${size}) ลงในตะกร้าแล้ว`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        showToast(`ลบ ${item.name} ออกจากตะกร้าแล้ว`, 'info');
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast('ล้างตะกร้าสินค้าเรียบร้อยแล้ว', 'info');
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      ...productData,
      id: newId,
      sku: productData.sku || `MS-${productData.category.slice(0, 3).toUpperCase()}-${String(newId).padStart(2, '0')}`,
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Successfully added "${newProduct.name}" to catalog!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: number, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    showToast('Product details updated successfully', 'success');
  };

  const deleteProduct = (id: number) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also clean up any cart items of this product
    setCart((prev) => prev.filter((item) => item.productId !== id));
    showToast(`Product "${target?.name || id}" removed from store`, 'info');
  };

  const resetCatalog = () => {
    const reset = resetStoredProducts();
    setProducts(reset);
    showToast('Catalog restored to original 10 sample products', 'info');
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`อัปเดตสถานะคำสั่งซื้อ #${orderId} เป็น "${status.toUpperCase()}"`, 'success');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'cancelled' as OrderStatus,
              notes: reason ? `${ord.notes ? ord.notes + ' | ' : ''}เหตุผลที่ยกเลิก: ${reason}` : ord.notes,
            }
          : ord
      )
    );
    showToast(`ยกเลิกคำสั่งซื้อ #${orderId} สำเร็จแล้ว`, 'info');
  };

  const reorderItems = (orderItems: Order['items']) => {
    orderItems.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.size, item.quantity);
      } else {
        // Fallback reconstructed product
        const fallbackProd: Product = {
          id: item.productId,
          name: item.name,
          category: item.category,
          price: item.price,
          description: '',
          image: item.image,
          sizes: [item.size],
          stock: 10,
        };
        addToCart(fallbackProd, item.size, item.quantity);
      }
    });
    setIsCartDrawerOpen(true);
    showToast(`เพิ่มสินค้าจากคำสั่งซื้อเข้าสู่ตะกร้าเรียบร้อยแล้ว`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast(`ลบคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว`, 'info');
  };

  const resetOrdersCatalog = () => {
    const reset = resetStoredOrders();
    setOrders(reset);
    showToast('รีเซ็ตรายการคำสั่งซื้อเป็นข้อมูลตัวอย่างตั้งต้นแล้ว', 'info');
  };

  const getProductById = (id: number) => {
    return products.find((p) => p.id === id);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        cartTotal,
        cartCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        resetCatalog,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        reorderItems,
        deleteOrder,
        resetOrdersCatalog,
        getProductById,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

