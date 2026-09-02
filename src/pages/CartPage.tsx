import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, RotateCcw, Truck, AlertCircle } from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart, showToast, setIsCheckoutModalOpen } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'SHOES10' || code === 'MONO10' || code === 'WELCOME10') {
      setAppliedDiscountPercent(10);
      showToast('10% discount promo applied!', 'success');
    } else if (code === 'SHOES20' || code === 'MONO20') {
      setAppliedDiscountPercent(20);
      showToast('20% VIP discount promo applied!', 'success');
    } else {
      showToast('Invalid promo code. Try "SHOES10"', 'error');
    }
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า', 'warning');
      navigate('/login', {
        state: {
          from: { pathname: '/cart' },
          message: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการสั่งซื้อสินค้าและชำระเงิน',
        },
      });
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const discountAmount = Math.round((cartTotal * appliedDiscountPercent) / 100);
  const FREE_SHIPPING_THRESHOLD = 2500;
  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD || cart.length === 0 ? 0 : 150;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  const formattedSubtotal = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cartTotal);

  const formattedFinalTotal = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(finalTotal);

  if (!currentUser) {
    return (
      <div className="bg-white min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center text-neutral-400 mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า
        </h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-md leading-relaxed">
          เข้าสู่ระบบบัญชีของคุณเพื่อดูรายการสินค้าในตะกร้า บันทึกสินค้าที่เลือก และดำเนินการชำระเงิน
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <Link
            to="/login"
            state={{ from: { pathname: '/cart' }, message: 'กรุณาเข้าสู่ระบบเพื่อจัดการตะกร้าสินค้าของคุณ' }}
            className="w-full sm:w-auto bg-black text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-extrabold hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2 shadow-md"
          >
            <span>เข้าสู่ระบบ (Log In)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto bg-white border border-neutral-300 text-black px-8 py-4 text-xs uppercase tracking-[0.25em] font-extrabold hover:bg-neutral-100 transition-colors inline-block"
          >
            เลือกซื้อรองเท้า
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center text-neutral-400 mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          YOUR SHOPPING BAG IS EMPTY
        </h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          คุณยังไม่มีสินค้าในตะกร้า เลือกชมรองเท้าและสั่งซื้อสินค้าได้ทันที
        </p>
        <Link
          to="/shop"
          className="mt-6 bg-black text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-extrabold hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 shadow-md"
        >
          <span>Explore Sneakers</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-[#F5F5F5] border-b border-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 block mb-2">
            Review Selection
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black font-sans">
            SHOPPING BAG
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items List Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-black">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items in Bag
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-neutral-400 hover:text-black underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Items</span>
              </button>
            </div>

            <div className="divide-y divide-[#E5E5E5]">
              {cart.map((item) => {
                const subtotal = item.price * item.quantity;
                return (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-6 flex-1">
                      {/* Thumbnail */}
                      <Link
                        to={`/product/${item.productId}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F5F5F5] border border-neutral-200 shrink-0 overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Details */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                          {item.category}
                        </span>
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="text-base font-bold text-black hover:text-neutral-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-neutral-500">
                          Size: <strong className="text-black font-semibold">EU {item.size}</strong>
                        </p>
                        <p className="text-xs font-bold text-black sm:hidden">
                          ฿{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Subtotal Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-neutral-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-xs font-bold hover:bg-neutral-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1.5 text-xs font-bold text-center min-w-8">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-xs font-bold hover:bg-neutral-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-24">
                        <span className="text-base font-extrabold text-black">
                          ฿{subtotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-600 p-2 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-black uppercase tracking-tight text-black border-b border-[#E5E5E5] pb-4">
                ORDER SUMMARY
              </h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs uppercase font-bold tracking-wider text-neutral-600">
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="e.g. MONO10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] px-3 py-2 text-xs uppercase font-semibold focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 text-xs uppercase font-bold tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscountPercent > 0 && (
                  <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {appliedDiscountPercent}% discount active!
                  </p>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-3 pt-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">{formattedSubtotal}</span>
                </div>

                {appliedDiscountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedDiscountPercent}%)</span>
                    <span className="font-bold">-฿{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-black">
                    {shippingCost === 0 ? 'FREE' : '฿150'}
                  </span>
                </div>

                <div className="border-t border-[#E5E5E5] pt-4 flex justify-between text-base font-black text-black">
                  <span>TOTAL</span>
                  <span>{formattedFinalTotal}</span>
                </div>
              </div>

              {/* Login Warning Banner if Guest */}
              {!currentUser && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-medium">
                    คุณต้องเข้าสู่ระบบก่อน จึงจะสามารถยืนยันคำสั่งซื้อได้
                  </span>
                </div>
              )}

              {/* Checkout Trigger */}
              <button
                id="cart-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] font-extrabold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT (ชำระเงิน)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/shop"
                  className="text-xs uppercase tracking-widest font-bold text-neutral-500 hover:text-black underline"
                >
                  ← Continue Shopping
                </Link>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Complimentary returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
