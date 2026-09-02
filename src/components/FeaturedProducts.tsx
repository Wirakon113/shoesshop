import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products } = useStore();

  // Get featured products or top 4 products
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const displayProducts = featured.length >= 4 ? featured : products.slice(0, 4);

  return (
    <section id="featured-products-section" className="bg-white py-16 sm:py-20 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Bold Typography */}
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-black">
              Featured Sneakers
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-[10px] sm:text-xs uppercase font-bold border-b border-black pb-1 hover:opacity-60 transition-opacity tracking-widest inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
