import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminOrders } from '../components/admin/AdminOrders';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Store,
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'users' | 'orders';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout, login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabParam = (searchParams.get('tab') as AdminTab) || 'overview';
  const [activeTab, setActiveTab] = useState<AdminTab>(
    ['overview', 'products', 'users', 'orders'].includes(tabParam) ? tabParam : 'overview'
  );

  useEffect(() => {
    const currentTab = searchParams.get('tab') as AdminTab;
    if (currentTab && ['overview', 'products', 'users', 'orders'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // If user is not logged in as Admin, show Access Guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-neutral-50 animate-in fade-in duration-200">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-8 text-center shadow-xl">
          <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">
            Access Restricted
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-black mt-1 mb-2">
            พื้นที่เฉพาะผู้ดูแลระบบ (ADMIN)
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed mb-6">
            คุณจำเป็นต้องเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ (Admin) เพื่อเข้าถึงระบบจัดการสินค้า จัดการผู้ใช้ และจัดการคำสั่งซื้อ
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                const res = login({ username: 'admin2547', password: 'admin2547' });
                if (res.success) {
                  navigate('/admin');
                }
              }}
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              เข้าสู่ระบบด้วยบัญชี Admin (admin2547)
            </button>

            <Link
              to="/login"
              className="block w-full py-2.5 border border-neutral-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider transition-colors text-center"
            >
              ไปหน้าเข้าสู่ระบบปกติ
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-black font-semibold mt-2"
            >
              <Store className="w-3.5 h-3.5" /> กลับสู่หน้าร้านค้า
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-16">
      {/* Top Admin Sub-Header */}
      <div className="bg-black text-white border-b border-neutral-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 gap-3">
            <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Admin Mode
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                  ระบบจัดการร้านค้า (SHOES SHOP PORTAL)
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-neutral-400 hidden sm:inline">
                เข้าสู่ระบบโดย: <strong className="text-white">@{currentUser.username}</strong> ({currentUser.name})
              </span>
              <Link
                to="/"
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 transition-colors"
              >
                <Store className="w-3.5 h-3.5" /> หน้าร้านค้า
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-neutral-800/80 pt-1">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-white text-white bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              ภาพรวม (Overview)
            </button>

            <button
              onClick={() => handleTabChange('products')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-white text-white bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              จัดการสินค้า (Products)
            </button>

            <button
              onClick={() => handleTabChange('users')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-white text-white bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              จัดการผู้ใช้ (Users)
            </button>

            <button
              onClick={() => handleTabChange('orders')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-white text-white bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              จัดการคำสั่งซื้อ (Orders)
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && <AdminOverview onNavigateTab={handleTabChange} />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'orders' && <AdminOrders />}
      </main>
    </div>
  );
};
