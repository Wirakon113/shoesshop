import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Ruler,
  Share2,
  Check,
  Layers,
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getProductById, products, addToCart, setIsCartDrawerOpen, showToast } = useStore();

  const product = id ? getProductById(Number(id)) : undefined;

  const [selectedSize, setSelectedSize] = useState<number>(42);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Set default size when product loads
  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      setActiveImageIndex(0);
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black uppercase text-black mb-2">Sneaker Not Found</h2>
        <p className="text-neutral-500 text-sm mb-6 max-w-md">
          The sneaker you are looking for might have been removed or does not exist in our catalog.
        </p>
        <Link
          to="/shop"
          className="bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const galleryImages = [
    product.image,
    ...(product.additionalImages || []),
  ];

  const formattedPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleAddToCart = () => {
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า', 'info');
      navigate('/login', {
        state: {
          from: { pathname: `/product/${product.id}` },
          message: 'กรุณาเข้าสู่ระบบเพื่อเลือกซื้อและเพิ่มสินค้าลงในตะกร้า',
        },
      });
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า', 'warning');
      navigate('/login', {
        state: {
          from: { pathname: `/product/${product.id}` },
          message: 'กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้า',
        },
      });
      return;
    }
    addToCart(product, selectedSize, quantity);
    setIsCartDrawerOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Product link copied to clipboard!', 'info');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-24 animate-in fade-in duration-300">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#E5E5E5] bg-[#F5F5F5] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <Link to="/shop" className="hover:text-black">
              Shop
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-black">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="text-black font-bold uppercase truncate max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex items-center gap-1 text-black hover:opacity-70 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Main 2-Column Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Gallery Images */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Display Image */}
            <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden group">
              <img
                src={galleryImages[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {product.isNew && (
                <span className="absolute top-4 left-4 bg-black text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5">
                  New Release
                </span>
              )}

              {/* Quick Share button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 bg-white/90 p-2 text-black hover:bg-black hover:text-white transition-colors"
                title="Share product"
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Thumbnail Navigation */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F5F5] border-2 shrink-0 overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-black opacity-100 shadow-sm'
                        : 'border-[#E5E5E5] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Purchase Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category & Name */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-400">
                    MONO STEP • {product.category}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {product.sku || `MS-${product.id}`}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black mt-2 leading-none font-display">
                  {product.name}
                </h1>

                <div className="text-2xl sm:text-3xl font-black text-black mt-3 font-display tracking-tight">
                  {formattedPrice}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-b border-[#E5E5E5] py-4">
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Available Sizes (Prompt Requirement: 38, 39, 40, 41, 42, 43, 44) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-black">
                    Available Sizes (EU)
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-neutral-500 hover:text-black underline flex items-center gap-1 font-semibold"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[38, 39, 40, 41, 42, 43, 44].map((size) => {
                    const isAvailable = product.sizes.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-xs font-bold transition-all border ${
                          !isAvailable
                            ? 'bg-neutral-100 text-neutral-300 border-neutral-200 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-black text-white border-black shadow-md scale-102'
                            : 'bg-white text-black border-[#E5E5E5] hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                  <span>Selected: <strong>EU {selectedSize}</strong></span>
                  <span>{product.stock > 0 ? `Stock: ${product.stock} in warehouse` : 'Out of stock'}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-black">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-sm font-bold hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-sm font-bold min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-sm font-bold hover:bg-neutral-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: ADD TO CART & BUY NOW */}
              <div className="space-y-3 pt-4">
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-4 px-8 text-xs uppercase tracking-[0.25em] font-extrabold hover:bg-[#222222] transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART • EU {selectedSize}</span>
                </button>

                <button
                  id="buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full bg-white text-black border-2 border-black py-4 px-8 text-xs uppercase tracking-[0.25em] font-extrabold hover:bg-neutral-100 transition-all text-center"
                >
                  BUY NOW
                </button>
              </div>

              {/* Service Highlights */}
              <div className="pt-6 border-t border-[#E5E5E5] space-y-3">
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <Truck className="w-4 h-4 text-black shrink-0" />
                  <span>Free standard & express shipping for orders over ฿2,500</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <RefreshCw className="w-4 h-4 text-black shrink-0" />
                  <span>30-Day trial period with free size exchanges</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                  <span>Guaranteed authentic handcrafted quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Technical Details */}
        <div className="mt-20 pt-12 border-t border-[#E5E5E5]">
          <h3 className="text-xl font-black uppercase tracking-tight text-black mb-6">
            ENGINEERING & SPECIFICATIONS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-[#F5F5F5] p-6 sm:p-8 border border-[#E5E5E5]">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
                Upper Material
              </span>
              <p className="text-sm font-bold text-black mt-1">High-density breathable mono-knit</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
                Midsole Foam
              </span>
              <p className="text-sm font-bold text-black mt-1">Responsive EVA with air matrix</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
                Outsole Pattern
              </span>
              <p className="text-sm font-bold text-black mt-1">High-abrasion carbon rubber tread</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
                Drop & Weight
              </span>
              <p className="text-sm font-bold text-black mt-1">8mm Drop / 285g (EU 42)</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 block mb-1">
                  Similar Aesthetics
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">
                  YOU MIGHT ALSO LIKE
                </h3>
              </div>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs uppercase tracking-widest font-extrabold text-black underline"
              >
                More in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-xl font-black uppercase tracking-tight text-black mb-4">
              MONO STEP SNEAKER SIZE GUIDE
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Our sneakers fit true to European standard sizing. If you are between sizes, we recommend sizing up for casual wear.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-neutral-200">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-2.5 font-bold">EU</th>
                    <th className="p-2.5 font-bold">US Men</th>
                    <th className="p-2.5 font-bold">US Women</th>
                    <th className="p-2.5 font-bold">CM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-medium">
                  <tr><td className="p-2.5 font-bold">38</td><td className="p-2.5">5.5</td><td className="p-2.5">7.0</td><td className="p-2.5">24.0 cm</td></tr>
                  <tr className="bg-neutral-50"><td className="p-2.5 font-bold">39</td><td className="p-2.5">6.5</td><td className="p-2.5">8.0</td><td className="p-2.5">24.5 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">40</td><td className="p-2.5">7.0</td><td className="p-2.5">8.5</td><td className="p-2.5">25.0 cm</td></tr>
                  <tr className="bg-neutral-50"><td className="p-2.5 font-bold">41</td><td className="p-2.5">8.0</td><td className="p-2.5">9.5</td><td className="p-2.5">26.0 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">42</td><td className="p-2.5">8.5</td><td className="p-2.5">10.0</td><td className="p-2.5">26.5 cm</td></tr>
                  <tr className="bg-neutral-50"><td className="p-2.5 font-bold">43</td><td className="p-2.5">9.5</td><td className="p-2.5">11.0</td><td className="p-2.5">27.5 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">44</td><td className="p-2.5">10.0</td><td className="p-2.5">11.5</td><td className="p-2.5">28.0 cm</td></tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-6 w-full bg-black text-white py-3 text-xs uppercase font-bold tracking-widest hover:bg-neutral-800"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
