import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Package, Users, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: 'overview' | 'products' | 'users' | 'orders') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { products, orders } = useStore();
  const { users } = useAuth();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const recentOrders = [...orders].slice(0, 5);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">รอดำเนินการ</span>;
      case 'processing':
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">กำลังเตรียมจัดส่ง</span>;
      case 'shipped':
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">จัดส่งแล้ว</span>;
      case 'delivered':
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">สำเร็จแล้ว</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-neutral-100 text-neutral-600 border border-neutral-300">ยกเลิก</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-neutral-100 text-neutral-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 border border-neutral-200 shadow-xs hover:border-black transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">ยอดขายรวมทั้งหมด</span>
            <div className="w-9 h-9 bg-neutral-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-black" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-black">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              จากคำสั่งซื้อที่เสร็จสมบูรณ์
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-5 border border-neutral-200 shadow-xs hover:border-black cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">คำสั่งซื้อทั้งหมด</span>
            <div className="w-9 h-9 bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-black">{orders.length} ออเดอร์</div>
            <p className="text-xs text-amber-600 mt-1 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pendingOrders.length} รายการรอดำเนินการ
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 border border-neutral-200 shadow-xs hover:border-black cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">สินค้าในระบบ</span>
            <div className="w-9 h-9 bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-black">{products.length} รายการ</div>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              {lowStockProducts.length > 0 ? (
                <span className="text-red-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lowStockProducts.length} รายการใกล้หมด
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  สต็อกสินค้าพร้อมจำหน่าย
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Total Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-white p-5 border border-neutral-200 shadow-xs hover:border-black cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">ผู้ใช้งานในระบบ</span>
            <div className="w-9 h-9 bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-black">{users.length} บัญชี</div>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              {users.filter((u) => u.role === 'admin').length} Admin · {users.filter((u) => u.role === 'user').length} User
            </p>
          </div>
        </div>
      </div>

      {/* Quick Alerts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Panel */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-black uppercase tracking-wider">คำสั่งซื้อล่าสุด</h3>
              <p className="text-xs text-neutral-500">รายการสั่งซื้อรองเท้าจากลูกค้าในระบบ</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
            >
              ดูทั้งหมด <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-bold">รหัสคำสั่งซื้อ</th>
                  <th className="pb-3 font-bold">ลูกค้า</th>
                  <th className="pb-3 font-bold">ยอดเงิน</th>
                  <th className="pb-3 font-bold">ช่องทางชำระ</th>
                  <th className="pb-3 font-bold">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="py-3 font-mono font-bold text-black">{order.id}</td>
                    <td className="py-3">
                      <div className="font-medium text-black">{order.customerName}</div>
                      <div className="text-neutral-400 text-[11px]">{order.items.length} รายการ</div>
                    </td>
                    <td className="py-3 font-semibold text-black">{formatPrice(order.total)}</td>
                    <td className="py-3 uppercase text-neutral-600 font-mono text-[11px]">{order.paymentMethod}</td>
                    <td className="py-3">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Shortcuts */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="bg-white border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                สต็อกเหลือน้อย
              </h3>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 font-bold">
                {lowStockProducts.length} ชิ้น
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                ไม่มีสินค้าระดับสต็อกต่ำกว่า 5 ชิ้น
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-2.5">
                      <img src={p.image} alt={p.name} className="w-8 h-8 object-cover bg-neutral-100" />
                      <div>
                        <div className="font-semibold text-black truncate max-w-[140px]">{p.name}</div>
                        <div className="text-[10px] text-neutral-400">{p.category}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5">
                      เหลือ {p.stock} คู่
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigateTab('products')}
              className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-colors"
            >
              จัดการสต็อกสินค้า
            </button>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-black text-white p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">ระบบจัดการด่วน</h3>
            <p className="text-xs text-neutral-400 mb-4">
              เข้าถึงเมนูจัดการสินค้า จัดการผู้ใช้ และตรวจสอบคำสั่งซื้อ
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onNavigateTab('products')}
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors"
              >
                <span>+ เพิ่ม / แก้ไขสินค้า</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTab('users')}
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors"
              >
                <span>จัดการสิทธิ์ผู้ใช้งาน (Roles)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTab('orders')}
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors"
              >
                <span>อัปเดตสถานะการจัดส่ง</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
