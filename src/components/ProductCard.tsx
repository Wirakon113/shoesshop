import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setQuickViewProduct, addToCart, showToast } = useStore();
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 42);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า', 'info');
      navigate('/login', {
        state: {
          from: { pathname: window.location.pathname },
          message: 'กรุณาเข้าสู่ระบบเพื่อเลือกซื้อและเพิ่มสินค้าลงในตะกร้า',
        },
      });
      return;
    }
    addToCart(product, selectedSize, 1);
    setAddedAnimation(true);
    setIsSizeSelectorOpen(false);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const formattedPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white border border-[#E5E5E5] transition-all duration-300 hover:border-black"
    >
      {/* Image Container with Minimal Hover Scale */}
      <div className="relative aspect-square w-full bg-[#F5F5F5] overflow-hidden p-4 sm:p-6 flex items-center justify-center">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop';
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              New
            </span>
          )}
          {product.featured && (
            <span className="bg-white text-black border border-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              Featured
            </span>
          )}
        </div>

        {/* Quick View Button Top Right */}
        <button
          onClick={openQuickView}
          aria-label="Quick View"
          className="absolute top-3 right-3 bg-white text-black p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black hover:text-white shadow-sm border border-[#E5E5E5]"
          title="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Quick Add Overlay on Hover Bottom of Image */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 backdrop-blur-xs border-t border-[#E5E5E5] translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2 z-20">
          {!isSizeSelectorOpen ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSizeSelectorOpen(true);
              }}
              className="w-full bg-black text-white py-2 px-3 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 hover:bg-[#222222] transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{addedAnimation ? 'Added' : 'Quick Add'}</span>
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white p-2 border border-[#E5E5E5] animate-in fade-in flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-black">
                <span>Size EU:</span>
                <button
                  onClick={() => setIsSizeSelectorOpen(false)}
                  className="text-neutral-400 hover:text-black font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-6 h-6 text-[10px] font-bold transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-[#F5F5F5] text-black hover:bg-neutral-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={handleQuickAdd}
                className="w-full bg-black text-white text-[9px] uppercase tracking-widest font-bold py-1 flex items-center justify-center gap-1 hover:bg-[#222222]"
              >
                <Check className="w-3 h-3" /> Add EU {selectedSize}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Details with Bold Typography */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <Link to={`/product/${product.id}`} className="block group-hover:text-neutral-600 transition-colors">
            <h3 className="text-xs sm:text-sm font-bold uppercase mb-1 tracking-tight text-black line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-2">
            {product.category}
          </p>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-[#E5E5E5]">
          <p className="text-xs sm:text-sm font-black text-black tracking-tight">
            {formattedPrice}
          </p>

          <Link
            to={`/product/${product.id}`}
            className="text-[10px] uppercase font-bold border-b border-black pb-0.5 hover:opacity-60 transition-opacity tracking-widest text-black"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
