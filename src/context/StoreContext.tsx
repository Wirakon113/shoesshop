import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { useAuth } from './AuthContext';
import { shopApi, isApiAvailable, waitForApi } from '../lib/api';
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
  useApi: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (product: Product, size: number, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  clearCart: (quiet?: boolean) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  resetCatalog: () => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  reorderItems: (orderItems: Order['items']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  resetOrdersCatalog: () => Promise<void>;
  getProductById: (id: number) => Product | undefined;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

/** แยก productId/size กลับจาก CartItem.id รูป '<productId>-<size>' */
function splitCartId(cartItemId: string): { productId: number; size: number } {
  const idx = cartItemId.lastIndexOf('-');
  return {
    productId: Number(cartItemId.slice(0, idx)),
    size: Number(cartItemId.slice(idx + 1)),
  };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [cart, setCart] = useState<CartItem[]>(() => (currentUser ? getStoredUserCart(currentUser.id) : []));
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [useApi, setUseApi] = useState(false);
  const useApiRef = useRef(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshProducts = useCallback(async () => {
    const list = (await shopApi.products()) as Product[];
    setProducts(list);
  }, []);

  const refreshOrders = useCallback(async () => {
    const list = (await shopApi.orders()) as Order[];
    setOrders(list);
  }, []);

  const refreshCart = useCallback(async (userId: string) => {
    const list = (await shopApi.cart(userId)) as CartItem[];
    setCart(list);
  }, []);

  // ก่อน mutation: ถ้าตอนนี้อยู่โหมด local ให้ลองต่อ API ใหม่อีกรอบ
  // (กันกรณีเปิดหน้าเว็บตอน server ยังไม่ติด แล้ว server มาติดทีหลัง)
  const upgradeToApi = async (): Promise<boolean> => {
    if (useApiRef.current) return true;
    if (!(await isApiAvailable())) return false;
    useApiRef.current = true;
    setUseApi(true);
    try {
      const [plist, olist] = await Promise.all([shopApi.products(), shopApi.orders()]);
      setProducts(plist as Product[]);
      setOrders(olist as Order[]);
      if (currentUser) {
        try {
          await refreshCart(currentUser.id);
        } catch {
          /* ตะกร้าโหลดไม่ติดก็ยังถือว่า API ใช้ได้ */
        }
      }
    } catch {
      useApiRef.current = false;
      setUseApi(false);
      return false;
    }
    return true;
  };

  // ตรวจว่ามี API server (SQLite) ไหม — ถ้ามี ดึงข้อมูลจาก DB แทน localStorage
  // ลองหลายรอบเผื่อ server เพิ่งสตาร์ท (tsx cold start ช้า) และหน้าเว็บโหลดเร็วกว่า
  useEffect(() => {
    let cancelled = false;
    waitForApi().then(async (ok) => {
      if (cancelled) return;
      useApiRef.current = ok;
      setUseApi(ok);
      if (ok) {
        try {
          const [plist, olist] = await Promise.all([shopApi.products(), shopApi.orders()]);
          if (!cancelled) {
            setProducts(plist as Product[]);
            setOrders(olist as Order[]);
          }
        } catch {
          useApiRef.current = false;
          if (!cancelled) setUseApi(false);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync cart when user logs in / logs out
  useEffect(() => {
    if (useApiRef.current) {
      if (currentUser) {
        refreshCart(currentUser.id).catch(() => {
          useApiRef.current = false;
          setUseApi(false);
          setCart(getStoredUserCart(currentUser.id));
        });
      } else {
        setCart([]);
      }
      return;
    }
    if (currentUser) {
      setCart(getStoredUserCart(currentUser.id));
    } else {
      setCart([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, useApi]);

  // Sync products to local storage (โหมด localStorage เท่านั้น)
  useEffect(() => {
    if (useApiRef.current) return;
    saveStoredProducts(products);
  }, [products, useApi]);

  // Sync user-specific cart to local storage (โหมด localStorage เท่านั้น)
  useEffect(() => {
    if (useApiRef.current) return;
    if (currentUser) {
      saveStoredUserCart(currentUser.id, cart);
    }
  }, [cart, currentUser?.id, useApi]);

  // Sync orders to local storage (โหมด localStorage เท่านั้น)
  useEffect(() => {
    if (useApiRef.current) return;
    saveStoredOrders(orders);
  }, [orders, useApi]);

  const addToCart = async (product: Product, size: number, quantity = 1) => {
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า', 'info');
      return;
    }

    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.addToCart(currentUser.id, product.id, size, quantity);
        await refreshCart(currentUser.id);
        showToast(`เพิ่ม ${product.name} (ไซส์ ${size}) ลงในตะกร้าแล้ว`, 'success');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'เพิ่มสินค้าลงตะกร้าไม่สำเร็จ', 'error');
      }
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

  const removeFromCart = async (cartItemId: string) => {
    await upgradeToApi();
    if (useApiRef.current && currentUser) {
      const { productId, size } = splitCartId(cartItemId);
      const item = cart.find((i) => i.id === cartItemId);
      try {
        await shopApi.removeFromCart(currentUser.id, productId, size);
        await refreshCart(currentUser.id);
        if (item) showToast(`ลบ ${item.name} ออกจากตะกร้าแล้ว`, 'info');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'ลบสินค้าไม่สำเร็จ', 'error');
      }
      return;
    }
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        showToast(`ลบ ${item.name} ออกจากตะกร้าแล้ว`, 'info');
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    await upgradeToApi();
    if (useApiRef.current && currentUser) {
      const { productId, size } = splitCartId(cartItemId);
      try {
        await shopApi.setCartQuantity(currentUser.id, productId, size, newQuantity);
        await refreshCart(currentUser.id);
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'อัปเดตจำนวนไม่สำเร็จ', 'error');
      }
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = async (quiet = false) => {
    await upgradeToApi();
    if (useApiRef.current && currentUser) {
      try {
        await shopApi.clearCart(currentUser.id);
        setCart([]);
      } catch (e) {
        if (!quiet) showToast(e instanceof Error ? e.message : 'ล้างตะกร้าไม่สำเร็จ', 'error');
        return;
      }
    } else {
      setCart([]);
    }
    if (!quiet) {
      showToast('ล้างตะกร้าสินค้าเรียบร้อยแล้ว', 'info');
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    await upgradeToApi();
    if (useApiRef.current) {
      const created = (await shopApi.createProduct({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        sku: productData.sku,
        description: productData.description,
        image: productData.image,
        additionalImages: productData.additionalImages ?? [],
        sizes: productData.sizes,
        featured: productData.featured,
        isNew: productData.isNew,
      })) as Product;
      await refreshProducts();
      showToast(`Successfully added "${created.name}" to catalog!`, 'success');
      return created;
    }
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

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.updateProduct(id, {
          name: productData.name,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          sku: productData.sku,
          description: productData.description,
          image: productData.image,
          additionalImages: productData.additionalImages,
          sizes: productData.sizes,
          featured: productData.featured,
          isNew: productData.isNew,
        });
        await refreshProducts();
        showToast('Product details updated successfully', 'success');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'อัปเดตสินค้าไม่สำเร็จ', 'error');
      }
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    showToast('Product details updated successfully', 'success');
  };

  const deleteProduct = async (id: number) => {
    const target = products.find((p) => p.id === id);
    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.deleteProduct(id);
        await Promise.all([refreshProducts(), ...(currentUser ? [refreshCart(currentUser.id)] : [])]);
        showToast(`Product "${target?.name || id}" removed from store`, 'info');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'ลบสินค้าไม่สำเร็จ', 'error');
      }
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also clean up any cart items of this product
    setCart((prev) => prev.filter((item) => item.productId !== id));
    showToast(`Product "${target?.name || id}" removed from store`, 'info');
  };

  const resetCatalog = async () => {
    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.resetProducts();
        await refreshProducts();
        showToast('Catalog restored to original sample products', 'info');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'รีเซ็ตสินค้าไม่สำเร็จ', 'error');
      }
      return;
    }
    const reset = resetStoredProducts();
    setProducts(reset);
    showToast('Catalog restored to original 10 sample products', 'info');
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    await upgradeToApi();
    if (useApiRef.current) {
      // server คำนวณยอดจากราคาจริง + ตัดสต็อก + ล้างตะกร้าให้ใน transaction เดียว
      const created = (await shopApi.createOrder({
        userId: orderData.userId ?? currentUser?.id ?? null,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        items: orderData.items.map((it) => ({
          productId: it.productId,
          size: it.size,
          quantity: it.quantity,
        })),
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes ?? '',
      })) as Order;
      await Promise.all([
        refreshOrders(),
        refreshProducts(),
        ...(currentUser ? [refreshCart(currentUser.id)] : []),
      ]);
      return created;
    }
    const newId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.updateOrderStatus(orderId, status);
        await refreshOrders();
        showToast(`อัปเดตสถานะคำสั่งซื้อ #${orderId} เป็น "${status.toUpperCase()}"`, 'success');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'อัปเดตสถานะไม่สำเร็จ', 'error');
      }
      return;
    }
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`อัปเดตสถานะคำสั่งซื้อ #${orderId} เป็น "${status.toUpperCase()}"`, 'success');
  };

  const cancelOrder = async (orderId: string, reason?: string) => {
    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.updateOrderStatus(orderId, 'cancelled', reason);
        await refreshOrders();
        showToast(`ยกเลิกคำสั่งซื้อ #${orderId} สำเร็จแล้ว`, 'info');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'ยกเลิกคำสั่งซื้อไม่สำเร็จ', 'error');
      }
      return;
    }
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

  const reorderItems = async (orderItems: Order['items']) => {
    for (const item of orderItems) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        await addToCart(prod, item.size, item.quantity);
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
        await addToCart(fallbackProd, item.size, item.quantity);
      }
    }
    setIsCartDrawerOpen(true);
    showToast(`เพิ่มสินค้าจากคำสั่งซื้อเข้าสู่ตะกร้าเรียบร้อยแล้ว`, 'success');
  };

  const deleteOrder = async (orderId: string) => {
    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.deleteOrder(orderId);
        await refreshOrders();
        showToast(`ลบคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว`, 'info');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'ลบคำสั่งซื้อไม่สำเร็จ', 'error');
      }
      return;
    }
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast(`ลบคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว`, 'info');
  };

  const resetOrdersCatalog = async () => {
    await upgradeToApi();
    if (useApiRef.current) {
      try {
        await shopApi.resetOrders();
        await refreshOrders();
        showToast('รีเซ็ตรายการคำสั่งซื้อเป็นข้อมูลตัวอย่างตั้งต้นแล้ว', 'info');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'รีเซ็ตคำสั่งซื้อไม่สำเร็จ', 'error');
      }
      return;
    }
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
        useApi,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isQuizOpen,
        setIsQuizOpen,
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
