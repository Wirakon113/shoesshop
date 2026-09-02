import React from 'react';
import { Hero } from '../components/Hero';
import { ValueProps } from '../components/ValueProps';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { BrandSection } from '../components/BrandSection';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero Banner */}
      <Hero />

      {/* Brand Perks / Value Props */}
      <ValueProps />

      {/* Featured Products Section (4 items with zoom effect) */}
      <FeaturedProducts />

      {/* Category Quick Banners */}
      <section className="bg-white py-16 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 block mb-1">
                Shop By Discipline
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">
                CATEGORIES
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Running */}
            <Link
              to="/shop?category=Running"
              className="group relative aspect-4/3 overflow-hidden bg-black text-white p-8 flex flex-col justify-end border border-neutral-200"
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
                alt="Running Sneakers"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-108 transition-transform duration-700"
              />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">
                  Performance & Velocity
                </span>
                <h4 className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
                  <span>RUNNING</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </h4>
              </div>
            </Link>

            {/* Lifestyle */}
            <Link
              to="/shop?category=Lifestyle"
              className="group relative aspect-4/3 overflow-hidden bg-black text-white p-8 flex flex-col justify-end border border-neutral-200"
            >
              <img
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop"
                alt="Lifestyle Sneakers"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-108 transition-transform duration-700"
              />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">
                  Streetwear & Daily
                </span>
                <h4 className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
                  <span>LIFESTYLE</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </h4>
              </div>
            </Link>

            {/* Training & Basketball */}
            <Link
              to="/shop?category=Training"
              className="group relative aspect-4/3 overflow-hidden bg-black text-white p-8 flex flex-col justify-end border border-neutral-200"
            >
              <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop"
                alt="Training & Court"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-108 transition-transform duration-700"
              />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">
                  Gym & High Performance
                </span>
                <h4 className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
                  <span>TRAINING & COURT</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </h4>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Section ("BUILT TO MOVE") */}
      <BrandSection />
    </div>
  );
};
