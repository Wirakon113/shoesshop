import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    cart,
    cartTotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    setIsCheckoutModalOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    showToast,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2500;
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const formattedTotal = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cartTotal);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-base font-extrabold uppercase tracking-widest text-black">
                  Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close bag"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#F5F5F5] px-6 py-3 border-b border-[#E5E5E5]">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                <span>
                  {remainingForFreeShipping === 0
                    ? '🎉 You unlocked Free Express Shipping!'
                    : `Add ฿${remainingForFreeShipping.toLocaleString()} more for Free Shipping`}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                <div
                  className="bg-black h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E5E5E5]">
              {!currentUser ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wider text-black">
                      กรุณาเข้าสู่ระบบ
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                      เข้าสู่ระบบเพื่อดูสินค้าในตะกร้าของคุณและดำเนินการสั่งซื้อ
                    </p>
                  </div>
                  <div className="flex flex-col w-full max-w-xs gap-2 pt-2">
                    <Link
                      to="/login"
                      state={{ from: { pathname: '/cart' }, message: 'กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า' }}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>เข้าสู่ระบบ (Log In)</span>
                    </Link>
                    <Link
                      to="/shop"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="border border-neutral-300 text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors inline-block"
                    >
                      เลือกซื้อสินค้า
                    </Link>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wider text-black">
                      ตะกร้าของคุณว่างเปล่า
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                      คุณยังไม่มีสินค้าในตะกร้า เริ่มต้นเลือกซื้อรองเท้าคู่โปรดได้เลย
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-block shadow-sm"
                  >
                    เริ่มเลือกซื้อรองเท้า
                  </Link>
                </div>
              ) : (
                cart.map((item) => {
                  const itemSubtotal = item.price * item.quantity;
                  return (
                    <div key={item.id} className="py-4 flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 bg-[#F5F5F5] shrink-0 overflow-hidden border border-neutral-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                                {item.category}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-black leading-tight line-clamp-1">
                                {item.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            Size: <span className="font-semibold text-black">EU {item.size}</span>
                          </div>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                          <div className="flex items-center border border-neutral-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-neutral-100"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-neutral-100"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-xs font-bold text-black">
                            ฿{itemSubtotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Actions */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#E5E5E5] bg-white space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping</span>
                    <span className="font-medium text-black">
                      {remainingForFreeShipping === 0 ? 'FREE' : '฿150'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-neutral-100">
                    <span>Estimated Total</span>
                    <span>
                      ฿{(cartTotal + (remainingForFreeShipping === 0 ? 0 : 150)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    id="cart-drawer-checkout-btn"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      if (!currentUser) {
                        showToast('กรุณาเข้าสู่ระบบก่อนดำเนินการสั่งซื้อสินค้า', 'warning');
                        navigate('/login', {
                          state: {
                            from: { pathname: '/cart' },
                            message: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการสั่งซื้อสินค้าและชำระเงิน',
                          },
                        });
                        return;
                      }
                      setIsCheckoutModalOpen(true);
                    }}
                    className="w-full bg-black text-white py-3.5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Check Out Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/cart"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="w-full text-center border border-black py-2.5 text-xs uppercase tracking-wider font-bold text-black hover:bg-neutral-100 transition-colors"
                    >
                      View Cart
                    </Link>
                    <button
                      onClick={clearCart}
                      className="w-full text-center border border-neutral-200 py-2.5 text-xs uppercase tracking-wider font-semibold text-neutral-500 hover:text-black hover:border-black transition-colors"
                    >
                      Clear Bag
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure 256-Bit Encrypted Checkout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
