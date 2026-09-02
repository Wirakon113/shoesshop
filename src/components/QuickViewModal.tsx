import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingBag, ArrowRight, Check, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const QuickViewModal: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCartDrawerOpen, showToast } = useStore();
  const [selectedSize, setSelectedSize] = useState<number>(42);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct && quickViewProduct.sizes.length > 0) {
      setSelectedSize(quickViewProduct.sizes[0]);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const formattedPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(quickViewProduct.price);

  const handleAddToCart = () => {
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า', 'info');
      setQuickViewProduct(null);
      navigate('/login', {
        state: {
          from: { pathname: `/product/${quickViewProduct.id}` },
          message: 'กรุณาเข้าสู่ระบบเพื่อเลือกซื้อและเพิ่มสินค้าลงในตะกร้า',
        },
      });
      return;
    }
    addToCart(quickViewProduct, selectedSize, quantity);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า', 'warning');
      setQuickViewProduct(null);
      navigate('/login', {
        state: {
          from: { pathname: `/product/${quickViewProduct.id}` },
          message: 'กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้า',
        },
      });
      return;
    }
    addToCart(quickViewProduct, selectedSize, quantity);
    setQuickViewProduct(null);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white max-w-3xl w-full border border-neutral-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 bg-white/90 p-2 text-black hover:bg-black hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square md:aspect-auto bg-[#F5F5F5] h-full flex items-center justify-center overflow-hidden">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
          {quickViewProduct.isNew && (
            <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
              New Arrival
            </span>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-1">
              {quickViewProduct.category}
            </div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight mb-2">
              {quickViewProduct.name}
            </h2>
            <div className="text-xl font-bold text-black mb-4">{formattedPrice}</div>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              {quickViewProduct.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Select Size (EU)
                </span>
                <span className="text-xs text-neutral-400">EU Standard</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {quickViewProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-xs font-bold transition-all border ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white text-black border-neutral-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-black">Quantity</span>
              <div className="flex items-center border border-neutral-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-bold hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm font-bold hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-neutral-500">
                {quickViewProduct.stock} pairs available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add To Bag (EU {selectedSize})
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-white text-black border border-black py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-100 transition-colors"
            >
              Buy Now
            </button>

            <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
              <Link
                to={`/product/${quickViewProduct.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="underline font-semibold hover:text-black flex items-center gap-1"
              >
                <span>Full details & specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Free returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
