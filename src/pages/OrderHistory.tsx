import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import {
  PackageCheck,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  MapPin,
  CreditCard,
  QrCode,
  Calendar,
  Filter,
  Eye,
  FileText,
} from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const { orders, cancelOrder, reorderItems, showToast, setIsCheckoutModalOpen } = useStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders for the current user (strictly empty if not logged in)
  const userOrders = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    let filtered = orders.filter(
      (order) =>
        (order.userId && order.userId === currentUser.id) ||
        order.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
        order.customerName.toLowerCase().includes(currentUser.username.toLowerCase()) ||
        order.customerName.toLowerCase().includes(`${currentUser.name} ${currentUser.lastname}`.trim().toLowerCase())
    );

    // Filter by tab
    if (selectedStatusTab === 'active') {
      filtered = filtered.filter((o) => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped');
    } else if (selectedStatusTab === 'delivered') {
      filtered = filtered.filter((o) => o.status === 'delivered');
    } else if (selectedStatusTab === 'cancelled') {
      filtered = filtered.filter((o) => o.status === 'cancelled');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) ||
          o.shippingAddress.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, currentUser, selectedStatusTab, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold rounded-full">
            <Clock className="w-3.5 h-3.5" />
            รอดำเนินการ (Pending)
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold rounded-full">
            <AlertCircle className="w-3.5 h-3.5" />
            กำลังเตรียมสินค้า (Processing)
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold rounded-full">
            <Truck className="w-3.5 h-3.5" />
            กำลังจัดส่ง (Shipped)
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            สำเร็จแล้ว (Delivered)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            ยกเลิกแล้ว (Cancelled)
          </span>
        );
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?')) {
      cancelOrder(orderId);
      showToast('ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว', 'info');
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      }
    }
  };

  const handleReorder = (order: Order) => {
    reorderItems(order);
    showToast('เพิ่มรายการสินค้าลงในตะกร้าเรียบร้อยแล้ว', 'success');
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
            <Link to="/" className="hover:text-black transition-colors">
              หน้าแรก
            </Link>
            <span>/</span>
            <span className="text-black">ประวัติการสั่งซื้อและสถานะสินค้า</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-3">
                <PackageCheck className="w-8 h-8" />
                <span>ประวัติคำสั่งซื้อ (Order History)</span>
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                ติดตามสถานะการจัดส่ง ตรวจสอบรายการที่สำเร็จ และจัดการคำสั่งซื้อของคุณ
              </p>
            </div>

            {currentUser && (
              <div className="bg-white border border-neutral-200 px-4 py-2.5 shadow-xs flex items-center gap-3 self-start sm:self-auto">
                <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center uppercase">
                  {currentUser.name.charAt(0) || currentUser.username.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-black">{currentUser.name} {currentUser.lastname}</p>
                  <p className="text-[11px] text-neutral-500">@{currentUser.username}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Not Logged In Warning Banner */}
        {!currentUser && (
          <div className="mb-8 bg-amber-50 border border-amber-200 p-4 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-xs font-semibold">
                คุณยังไม่ได้เข้าสู่ระบบ เข้าสู่ระบบเพื่อดูประวัติคำสั่งซื้อทั้งหมดที่ผูกกับบัญชีของคุณ
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/login"
                className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                เข้าสู่ระบบ (Login)
              </Link>
              <Link
                to="/register"
                className="bg-white border border-neutral-300 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
              >
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        )}

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white border border-neutral-200 p-4 mb-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button
                id="tab-orders-all"
                onClick={() => setSelectedStatusTab('all')}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedStatusTab === 'all'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
                }`}
              >
                ทั้งหมด (All)
              </button>
              <button
                id="tab-orders-active"
                onClick={() => setSelectedStatusTab('active')}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatusTab === 'active'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>กำลังดำเนินการ / จัดส่ง</span>
              </button>
              <button
                id="tab-orders-delivered"
                onClick={() => setSelectedStatusTab('delivered')}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatusTab === 'delivered'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>สำเร็จแล้ว (Delivered)</span>
              </button>
              <button
                id="tab-orders-cancelled"
                onClick={() => setSelectedStatusTab('cancelled')}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatusTab === 'cancelled'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-rose-700 hover:bg-rose-50'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>ยกเลิกแล้ว (Cancelled)</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="search-orders-input"
                placeholder="ค้นหาตามรหัสคำสั่งซื้อ หรือชื่อรองเท้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-neutral-300 pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-black text-black"
              />
            </div>
          </div>
        </div>

        {/* Orders List & Detail View */}
        {!currentUser ? (
          /* Not Logged In State */
          <div className="bg-white border border-neutral-200 p-12 text-center space-y-4 shadow-xs max-w-xl mx-auto">
            <div className="w-16 h-16 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                กรุณาเข้าสู่ระบบเพื่อดูประวัติคำสั่งซื้อ
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                คุณต้องเข้าสู่ระบบก่อนเพื่อตรวจสอบประวัติคำสั่งซื้อ รายละเอียด และติดตามสถานะการจัดส่งรองเท้าของคุณ
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/login"
                state={{ from: { pathname: '/orders' } }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-md"
              >
                <span>เข้าสู่ระบบ (Log In)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-neutral-300 text-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors"
              >
                <span>สมัครสมาชิก (Register)</span>
              </Link>
            </div>
          </div>
        ) : userOrders.length === 0 ? (
          /* Empty State (Logged in but no orders) */
          <div className="bg-white border border-neutral-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">
                ไม่พบประวัติคำสั่งซื้อ
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `ไม่พบคำสั่งซื้อที่ตรงกับคำค้นหา "${searchQuery}"`
                  : 'คุณยังไม่มีประวัติคำสั่งซื้อในหมวดหมู่นี้ เลือกชมรองเท้าและสั่งซื้อสินค้าได้เลย'}
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-md"
            >
              <span>ไปเลือกซื้อรองเท้า</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => {
              const isDelivered = order.status === 'delivered';
              const isCancelled = order.status === 'cancelled';
              const canCancel = order.status === 'pending' || order.status === 'processing';

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-white border border-neutral-200 shadow-xs overflow-hidden transition-all hover:border-neutral-400"
                >
                  {/* Order Top Bar */}
                  <div className="bg-neutral-50 p-4 sm:p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                          รหัสคำสั่งซื้อ
                        </span>
                        <span className="text-sm font-black font-mono text-black">{order.id}</span>
                      </div>
                      <div className="h-6 w-px bg-neutral-300 hidden sm:block" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                          วันที่สั่งซื้อ
                        </span>
                        <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Delivery Status Stepper */}
                  <div className="p-4 sm:p-5 border-b border-neutral-100 bg-white">
                    <div className="max-w-3xl mx-auto">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-neutral-200 -z-0" />
                        
                        {/* Step 1: Order Placed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCancelled
                              ? 'bg-rose-100 text-rose-700 border-2 border-rose-500'
                              : 'bg-black text-white'
                          }`}>
                            1
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-black mt-1.5 text-center">
                            สั่งซื้อแล้ว
                          </span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCancelled
                              ? 'bg-neutral-200 text-neutral-400'
                              : order.status !== 'pending'
                              ? 'bg-black text-white'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                          }`}>
                            2
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mt-1.5 text-center">
                            จัดเตรียมสินค้า
                          </span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCancelled
                              ? 'bg-neutral-200 text-neutral-400'
                              : order.status === 'shipped' || order.status === 'delivered'
                              ? 'bg-black text-white'
                              : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                          }`}>
                            3
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mt-1.5 text-center">
                            กำลังจัดส่ง
                          </span>
                        </div>

                        {/* Step 4: Final (Delivered or Cancelled) */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCancelled
                              ? 'bg-rose-600 text-white'
                              : isDelivered
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                          }`}>
                            {isCancelled ? <XCircle className="w-4 h-4" /> : isDelivered ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 text-center ${
                            isCancelled ? 'text-rose-600' : isDelivered ? 'text-emerald-700' : 'text-neutral-500'
                          }`}>
                            {isCancelled ? 'ยกเลิกคำสั่งซื้อ' : 'จัดส่งสำเร็จ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-4 sm:p-6 divide-y divide-neutral-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F5F5F5] border border-neutral-200 shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
                              {item.category}
                            </span>
                            <h4 className="text-sm font-bold text-black">{item.name}</h4>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              ไซส์ (Size): <strong className="text-black font-semibold">EU {item.size}</strong> • จำนวน: <strong className="text-black font-semibold">{item.quantity} คู่</strong>
                            </p>
                          </div>
                        </div>

                        <div className="text-right sm:self-center w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                          <span className="text-xs text-neutral-500 sm:hidden">ยอดรวมรายการ:</span>
                          <span className="text-sm font-black text-black">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment Summary Footer */}
                  <div className="bg-[#FBFBFB] p-4 sm:p-5 border-t border-neutral-200 flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
                    <div className="space-y-1 text-xs text-neutral-600 max-w-xl">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-black font-semibold">ที่อยู่จัดส่ง:</strong> {order.shippingAddress} ({order.customerName}, {order.customerPhone})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.paymentMethod === 'promptpay' ? (
                          <QrCode className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        ) : order.paymentMethod === 'card' ? (
                          <CreditCard className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        ) : (
                          <Truck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        )}
                        <span>
                          <strong className="text-black font-semibold">การชำระเงิน:</strong>{' '}
                          {order.paymentMethod === 'promptpay'
                            ? 'PromptPay QR'
                            : order.paymentMethod === 'card'
                            ? 'Credit Card'
                            : 'Cash on Delivery (เก็บเงินปลายทาง)'}
                        </span>
                      </div>
                    </div>

                    {/* Total & Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-200">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                          ยอดสุทธิ (Total)
                        </span>
                        <span className="text-lg font-black text-black">
                          ฿{order.total.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            id={`cancel-order-${order.id}`}
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-3.5 py-2 border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 hover:border-rose-400 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            ยกเลิกคำสั่งซื้อ
                          </button>
                        )}

                        <button
                          id={`reorder-btn-${order.id}`}
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>สั่งซื้ออีกครั้ง</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
