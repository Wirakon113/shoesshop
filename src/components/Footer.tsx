import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Instagram, Facebook, ArrowUpRight, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Subscribed! Check your inbox for exclusive drops.', 'success');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer id="main-footer" className="bg-black text-white pt-20 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-neutral-800">
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-6">
            <Logo size="lg" white />
            <p className="text-sm font-semibold tracking-widest text-neutral-300 uppercase">
              “STEP INTO YOUR STYLE.”
            </p>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Engineered for everyday movement with unapologetic monochrome minimalism.
              Clean lines, progressive silhouettes, and all-day comfort.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation - Shop */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Shop</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Running" className="hover:text-white transition-colors">
                  Running Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Lifestyle" className="hover:text-white transition-colors">
                  Lifestyle & Casual
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Basketball" className="hover:text-white transition-colors">
                  Basketball Highs
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Training" className="hover:text-white transition-colors">
                  Training & Gym
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links / About Us */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-white">About Us</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Product Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Sustainability & Materials
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Store Locator (Bangkok)
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Size Guide
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Contact</h4>
            <div className="space-y-2 text-sm text-neutral-400">
              <p>support@monostep.com</p>
              <p>+66 (0) 2 123 4567</p>
              <p>Siam Square One, Bangkok</p>
            </div>

            <div className="pt-2">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Enter email for drops"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black px-3.5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors shrink-0"
                  >
                    {subscribed ? <Check className="w-4 h-4" /> : 'Join'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Bold Typography */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span>© SHOES SHOP {new Date().getFullYear()}</span>
            <span className="text-neutral-700">•</span>
            <span>STEP INTO YOUR STYLE.</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
            <Link to="/add-product" className="hover:text-white transition-colors">Studio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
