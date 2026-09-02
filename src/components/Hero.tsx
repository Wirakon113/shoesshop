import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero-section" className="relative bg-white overflow-hidden border-b border-[#E5E5E5] min-h-[520px] lg:min-h-[580px] flex items-center">
      {/* Huge Background Watermark Typography */}
      <div className="absolute right-[-60px] lg:right-[-20px] top-1/2 -translate-y-1/2 w-full lg:w-[800px] opacity-10 pointer-events-none select-none text-right z-0">
        <span className="text-[120px] sm:text-[190px] md:text-[240px] lg:text-[280px] font-black leading-none uppercase tracking-tighter font-display">
          SHOES
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-4">
              <h1 className="text-[56px] xs:text-[68px] sm:text-[88px] md:text-[100px] lg:text-[108px] xl:text-[116px] leading-[0.85] font-black tracking-tighter text-black uppercase font-display">
                MOVE<br />
                DIFFERENT.
              </h1>
              <p className="text-sm uppercase tracking-widest text-neutral-500 max-w-xs font-medium">
                Discover sneakers designed for your everyday movement.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                id="hero-shop-now-btn"
                className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#222222] transition-colors inline-flex items-center gap-3 group shadow-md"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </Link>

              <Link
                to="/shop?category=Running"
                className="bg-transparent text-black border-b-2 border-black pb-1 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
              >
                Explore Running
              </Link>
            </div>

            {/* Quick Metrics / Features with Bold Typography */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E5E5E5] max-w-md">
              <div>
                <div className="text-xl sm:text-2xl font-black text-black tracking-tighter font-display">100%</div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-0.5">
                  Monochrome
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-black tracking-tighter font-display">38-44</div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-0.5">
                  EU Sizing
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-black tracking-tighter font-display">24H</div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-0.5">
                  Dispatch
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Showcase with Circular Accent & Tilted Sneaker */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] group">
            {/* Minimal Circular Background Backdrop */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#F5F5F5] rounded-full -z-10 transition-transform duration-700 group-hover:scale-105" />

            {/* Dynamic Tilted Sneaker Image */}
            <div className="relative w-full max-w-[480px] aspect-4/3 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
                alt="MONO STEP Hero Sneaker"
                className="w-full h-full object-contain rotate-[-15deg] group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-700 ease-out filter drop-shadow-2xl select-none"
              />
            </div>

            {/* Floating Minimalist Product Tag */}
            <div className="absolute bottom-2 left-4 sm:left-8 bg-white/95 backdrop-blur-xs p-4 border border-[#E5E5E5] shadow-lg max-w-[220px]">
              <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 block mb-0.5">
                Signature Drop
              </span>
              <span className="text-xs font-black text-black block uppercase tracking-tight">
                MONO RUNNER 01
              </span>
              <div className="flex items-center justify-between gap-4 mt-2">
                <span className="text-xs font-black text-black">฿2,990</span>
                <Link
                  to="/product/1"
                  className="text-[10px] uppercase font-bold border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
