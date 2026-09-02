import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Feather, Compass } from 'lucide-react';

export const BrandSection: React.FC = () => {
  return (
    <section id="brand-section" className="bg-[#F5F5F5] py-20 border-b border-[#E5E5E5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Visual Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            <div className="aspect-4/5 bg-white border border-[#E5E5E5] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
                alt="Shoes Shop Detail 1"
                className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="aspect-4/5 bg-white border border-[#E5E5E5] overflow-hidden translate-y-6 group">
              <img
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"
                alt="Shoes Shop Detail 2"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-8 lg:pl-6">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 block">
                The Philosophy
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black font-display leading-none">
                BUILT TO MOVE
              </h2>
              <p className="text-lg sm:text-xl font-semibold text-neutral-800 tracking-tight">
                “Minimal design. Everyday comfort. Made for every step.”
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-lg">
                At Shoes Shop, we strip away all unnecessary noise to highlight pure form and dynamic function.
                By pairing crisp monochrome palettes with advanced cushioning, every sneaker is tailored
                to adapt seamlessly from the morning commute to evening streetwear culture.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E5E5E5]">
              <div className="space-y-1.5">
                <Layers className="w-5 h-5 text-black" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-black">
                  Zero Clutter
                </h4>
                <p className="text-xs text-neutral-500">Pure monochrome balance</p>
              </div>

              <div className="space-y-1.5">
                <Feather className="w-5 h-5 text-black" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-black">
                  Featherlight
                </h4>
                <p className="text-xs text-neutral-500">Adaptive density foam</p>
              </div>

              <div className="space-y-1.5">
                <Compass className="w-5 h-5 text-black" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-black">
                  Every Terrain
                </h4>
                <p className="text-xs text-neutral-500">Multi-surface grip</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                to="/shop"
                className="bg-black text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold inline-flex items-center gap-3 hover:bg-[#222222] transition-colors"
              >
                <span>EXPLORE ALL COLLECTIONS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
