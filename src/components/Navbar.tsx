import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  PlusCircle,
  ArrowRight,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Mail,
  MapPin,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartDrawerOpen, showToast } = useStore();
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and search on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
      setIsSearchOpen(false);
      setSearchInput('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm uppercase tracking-widest font-medium transition-all duration-200 py-2 relative hover:text-neutral-500 ${
      isActive ? 'text-black font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black' : 'text-neutral-800'
    }`;

  return (
    <>
      {/* Top Announcement Marquee Bar */}
      <div className="bg-black text-white text-[10px] uppercase tracking-[0.25em] font-bold py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span>Complimentary Express Delivery on Orders over ฿2,500</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:inline opacity-80">Authentic Shoes Shop Quality</span>
        </div>
      </div>

      {/* Sticky Navbar */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#E5E5E5]'
            : 'bg-white border-b border-[#E5E5E5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center space-x-12">
            <Logo size="md" />
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                Shop
              </NavLink>
              <NavLink to="/orders" className={navLinkClass}>
                ประวัติคำสั่งซื้อ
              </NavLink>
              {currentUser?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-widest font-extrabold transition-all duration-200 py-1.5 px-3 flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-neutral-100 text-black border-neutral-300 hover:border-black'
                    }`
                  }
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Admin Dashboard</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Action Icons (Top Right) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Pill Capsule */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="px-3 py-1.5 bg-[#F5F5F5] rounded-full flex items-center gap-2 text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
              aria-label="Search sneakers"
            >
              <Search className="w-4 h-4 text-neutral-400" />
              <span className="text-xs uppercase tracking-wider font-semibold hidden sm:inline">Search</span>
            </button>

            {/* User Authentication Menu (Top-Right) */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                /* Logged In User Pill */
                <button
                  id="navbar-user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="px-3 py-1.5 bg-[#F5F5F5] border border-[#E5E5E5] hover:border-black rounded-full flex items-center gap-2 text-black transition-all group"
                  aria-label="User profile menu"
                >
                  <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center uppercase">
                    {currentUser.name.charAt(0) || currentUser.username.charAt(0)}
                  </div>
                  <span className="text-xs font-bold max-w-[90px] sm:max-w-[120px] truncate">
                    {currentUser.name || currentUser.username}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                /* Not Logged In Auth Trigger */
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    id="navbar-login-btn"
                    className="px-3 py-1.5 bg-black text-white hover:bg-[#222222] rounded-full flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>เข้าสู่ระบบ</span>
                  </Link>
                  <Link
                    to="/register"
                    id="navbar-register-link"
                    className="hidden sm:inline-block px-2.5 py-1.5 text-xs font-bold text-neutral-600 hover:text-black uppercase tracking-wider transition-colors"
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              )}

              {/* User Dropdown Drawer / Menu */}
              {isUserMenuOpen && currentUser && (
                <div
                  id="navbar-user-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E5E5E5] shadow-xl py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="pb-3 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center uppercase shrink-0">
                        {currentUser.name.charAt(0) || currentUser.username.charAt(0)}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-black truncate">
                            {currentUser.name} {currentUser.lastname}
                          </p>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 tracking-wider ${
                              currentUser.role === 'admin'
                                ? 'bg-black text-emerald-400'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {currentUser.role}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 truncate">@{currentUser.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 border-b border-[#E5E5E5]">
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-2 py-2 text-xs font-bold text-black bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                        <span>ประวัติคำสั่งซื้อของฉัน (Orders)</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  {currentUser.role === 'admin' && (
                    <div className="py-2 border-b border-[#E5E5E5] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block px-1">
                        ระบบจัดการแอดมิน
                      </span>
                      <Link
                        to="/admin?tab=overview"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-2 py-1.5 text-xs font-bold text-black hover:bg-neutral-100 transition-colors"
                      >
                        📊 ภาพรวมร้านค้า (Overview)
                      </Link>
                      <Link
                        to="/admin?tab=products"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-2 py-1.5 text-xs font-bold text-black hover:bg-neutral-100 transition-colors"
                      >
                        👟 จัดการสินค้า (Products)
                      </Link>
                      <Link
                        to="/admin?tab=users"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-2 py-1.5 text-xs font-bold text-black hover:bg-neutral-100 transition-colors"
                      >
                        👥 จัดการผู้ใช้ (Users)
                      </Link>
                      <Link
                        to="/admin?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-2 py-1.5 text-xs font-bold text-black hover:bg-neutral-100 transition-colors"
                      >
                        📦 จัดการคำสั่งซื้อ (Orders)
                      </Link>
                    </div>
                  )}

                  <div className="py-2.5 space-y-2 text-xs text-neutral-600 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                    {currentUser.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-[11px] leading-snug">{currentUser.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      id="navbar-logout-btn"
                      onClick={handleLogout}
                      className="w-full py-2 px-3 text-xs font-bold text-neutral-700 hover:text-black hover:bg-[#F5F5F5] rounded-xl transition-colors flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black" />
                        ออกจากระบบ (Log out)
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-black hover:bg-[#F5F5F5] rounded-full transition-colors relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.75]" />
              {cartCount > 0 && (
                <span
                  id="navbar-cart-count"
                  className="absolute top-0 right-0 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-black hover:bg-[#F5F5F5] rounded-full transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-[#E5E5E5] bg-[#F5F5F5] py-4 px-4 transition-all duration-300 animate-in slide-in-from-top-2">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by sneaker name, category, or style..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoFocus
                  className="w-full bg-white border border-[#E5E5E5] pl-12 pr-28 py-3.5 text-sm focus:outline-none focus:border-black font-medium transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-black text-white px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-[#222222] transition-colors"
                >
                  Search
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2.5 text-xs text-neutral-500">
                <span className="font-semibold uppercase tracking-wider">Popular:</span>
                <button
                  onClick={() => {
                    navigate('/shop?category=Running');
                    setIsSearchOpen(false);
                  }}
                  className="underline hover:text-black"
                >
                  Running
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    navigate('/shop?category=Lifestyle');
                    setIsSearchOpen(false);
                  }}
                  className="underline hover:text-black"
                >
                  Lifestyle
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    navigate('/shop?category=Basketball');
                    setIsSearchOpen(false);
                  }}
                  className="underline hover:text-black"
                >
                  Basketball
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E5E5] bg-white px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4">
            {/* User authentication info in mobile */}
            {currentUser ? (
              <div className="p-3.5 bg-[#F9F9F9] rounded-xl border border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center uppercase">
                    {currentUser.name.charAt(0) || currentUser.username.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">{currentUser.name} {currentUser.lastname}</p>
                    <p className="text-[11px] text-neutral-500">@{currentUser.username}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>ออก</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 bg-black text-white text-center rounded-xl text-xs uppercase tracking-wider font-bold"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 bg-[#F5F5F5] text-black text-center rounded-xl text-xs uppercase tracking-wider font-bold border border-[#E5E5E5]"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}

            <nav className="flex flex-col space-y-3 pt-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest font-bold py-2 border-b border-neutral-100 flex items-center justify-between"
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest font-bold py-2 border-b border-neutral-100 flex items-center justify-between"
              >
                <span>Shop All Sneakers</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest font-bold py-2 border-b border-neutral-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" />
                  ประวัติคำสั่งซื้อ (Order History)
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              {currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-widest font-bold py-2 border-b border-neutral-100 flex items-center justify-between bg-black text-white px-3"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Admin Dashboard (จัดการร้าน)
                  </span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              )}
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest font-bold py-2 flex items-center justify-between"
              >
                <span>Bag ({cartCount})</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </nav>

            <div className="pt-4 border-t border-neutral-200">
              <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
                SHOES SHOP — STEP INTO YOUR STYLE.
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

