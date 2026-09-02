import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Eye,
  Trash2,
  X,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  QrCode,
  DollarSign,
  Calendar,
  RotateCcw,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, resetOrdersCatalog } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" /> รอดำเนินการ
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Package className="w-3 h-3" /> กำลังเตรียมจัดส่ง
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Truck className="w-3 h-3" /> จัดส่งแล้ว
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> สำเร็จแล้ว
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-neutral-100 text-neutral-600 border border-neutral-300">
            <XCircle className="w-3 h-3" /> ยกเลิก
          </span>
        );
      default:
        return <span className="text-xs font-bold">{status}</span>;
    }
  };

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'promptpay':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
            <QrCode className="w-3 h-3" /> PromptPay QR
          </span>
        );
      case 'card':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
            <CreditCard className="w-3 h-3" /> บัตรเครดิต
          </span>
        );
      case 'cod':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
            <DollarSign className="w-3 h-3" /> เก็บเงินปลายทาง
          </span>
        );
      default:
        return <span className="uppercase text-xs font-mono">{method}</span>;
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 border border-neutral-200">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            จัดการคำสั่งซื้อ (Orders Management)
          </h2>
          <p className="text-xs text-neutral-500">
            ตรวจสอบรายการสั่งซื้อ ปรับเปลี่ยนสถานะการจัดส่ง และดูรายละเอียดสินค้าของลูกค้า
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตรายการคำสั่งซื้อเป็นข้อมูลตัวอย่างตั้งต้นหรือไม่?')) {
                resetOrdersCatalog();
              }
            }}
            className="flex-1 sm:flex-initial py-2.5 px-3 border border-neutral-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            title="รีเซ็ตเป็นคำสั่งซื้อตัวอย่าง"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            รีเซ็ตออเดอร์
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 border border-neutral-200">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหารหัสคำสั่งซื้อ (SS-...), ชื่อลูกค้า, เบอร์โทร..."
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 text-xs focus:outline-none focus:border-black font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="md:col-span-2 flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-black text-white border-black'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            ทั้งหมด ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-2 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            รอดำเนินการ ({orders.filter((o) => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('processing')}
            className={`px-2.5 py-2 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
              statusFilter === 'processing'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            เตรียมจัดส่ง ({orders.filter((o) => o.status === 'processing').length})
          </button>
          <button
            onClick={() => setStatusFilter('shipped')}
            className={`px-2.5 py-2 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
              statusFilter === 'shipped'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            จัดส่งแล้ว ({orders.filter((o) => o.status === 'shipped').length})
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-2.5 py-2 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
              statusFilter === 'delivered'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            สำเร็จ ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3.5 px-4">รหัสคำสั่งซื้อ</th>
                <th className="py-3.5 px-4">ลูกค้า & ที่อยู่จัดส่ง</th>
                <th className="py-3.5 px-4">สินค้า</th>
                <th className="py-3.5 px-4">ยอดรวม</th>
                <th className="py-3.5 px-4">การชำระเงิน</th>
                <th className="py-3.5 px-4">สถานะคำสั่งซื้อ</th>
                <th className="py-3.5 px-4">เวลาสั่งซื้อ</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 text-xs">
                    ไม่พบรายการคำสั่งซื้อตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="font-mono font-black text-black hover:underline text-sm flex items-center gap-1"
                      >
                        #{order.id}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-black">{order.customerName}</div>
                      <div className="text-neutral-500 text-[11px]">{order.customerEmail}</div>
                      <div className="text-neutral-400 text-[10px] truncate max-w-[180px]">
                        {order.shippingAddress}
                      </div>
                    </td>

                    {/* Items preview */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-9 h-9 bg-neutral-100 border border-neutral-200 relative overflow-hidden"
                            title={`${item.name} (Size ${item.size}) x${item.quantity}`}
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 right-0 bg-black text-white text-[8px] font-bold px-1">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-[10px] font-bold text-neutral-400">
                            +{order.items.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-black text-sm">{formatPrice(order.total)}</div>
                      <div className="text-[10px] text-neutral-400">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} คู่
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">{getPaymentBadge(order.paymentMethod)}</td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold uppercase px-2 py-1 border focus:outline-none cursor-pointer ${
                          order.status === 'pending'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : order.status === 'processing'
                            ? 'bg-blue-50 text-blue-900 border-blue-300'
                            : order.status === 'shipped'
                            ? 'bg-purple-50 text-purple-900 border-purple-300'
                            : order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                        }`}
                      >
                        <option value="pending">🟡 รอดำเนินการ</option>
                        <option value="processing">🔵 กำลังเตรียมจัดส่ง</option>
                        <option value="shipped">🟣 จัดส่งแล้ว</option>
                        <option value="delivered">🟢 สำเร็จแล้ว</option>
                        <option value="cancelled">⚪ ยกเลิก</option>
                      </select>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-neutral-600 hover:text-black border border-transparent hover:border-neutral-300 transition-colors"
                          title="ดูรายละเอียดคำสั่งซื้อ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(order.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 border border-transparent hover:border-red-200 transition-colors"
                          title="ลบคำสั่งซื้อ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white max-w-2xl w-full border border-neutral-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-neutral-200 pb-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Order Details
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2 mt-0.5">
                    คำสั่งซื้อ #{selectedOrder.id}
                  </h3>
                </div>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                เวลาสั่งซื้อ: {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            {/* Order Status Changer Bar */}
            <div className="bg-neutral-50 p-4 border border-neutral-200 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                ปรับปรุงสถานะคำสั่งซื้อ:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, st);
                      setSelectedOrder((prev) => (prev ? { ...prev, status: st } : null));
                    }}
                    className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors border ${
                      selectedOrder.status === st
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-neutral-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-neutral-500" />
                  ข้อมูลลูกค้า
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-black">{selectedOrder.customerName}</div>
                  <div className="text-neutral-600">{selectedOrder.customerEmail}</div>
                  <div className="text-neutral-600 font-mono">{selectedOrder.customerPhone}</div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  ที่อยู่สำหรับจัดส่ง
                </h4>
                <div className="text-xs text-neutral-700 leading-relaxed">
                  {selectedOrder.shippingAddress}
                </div>
                {selectedOrder.notes && (
                  <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 border border-amber-200">
                    <strong>หมายเหตุ:</strong> {selectedOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="border border-neutral-200 overflow-hidden mb-6">
              <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 text-xs font-bold uppercase tracking-wider text-black">
                รายการสินค้าในคำสั่งซื้อ ({selectedOrder.items.length} รายการ)
              </div>
              <div className="divide-y divide-neutral-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-black text-sm">{item.name}</div>
                        <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-semibold bg-neutral-100 px-1.5 py-0.5">
                            ไซส์: EU {item.size}
                          </span>
                          <span>จำนวน: {item.quantity} คู่</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-bold text-black text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="bg-neutral-50 p-4 border-t border-neutral-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>ยอดรวมสินค้า</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>ค่าจัดส่ง</span>
                  <span>{selectedOrder.shippingCost === 0 ? 'ฟรีค่าจัดส่ง' : formatPrice(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-black font-black text-base pt-2 border-t border-neutral-200">
                  <span>ยอดสุทธิ</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-6 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              ยืนยันการลบคำสั่งซื้อ #{deleteConfirmId}?
            </h3>
            <p className="text-xs text-neutral-600 mb-6">
              การกระทำนี้จะลบประวัติคำสั่งซื้อนี้ออกจากระบบอย่างถาวร
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 px-4 border border-neutral-300 text-neutral-700 hover:border-black text-xs font-bold uppercase tracking-wider transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  deleteOrder(deleteConfirmId);
                  setDeleteConfirmId(null);
                  if (selectedOrder?.id === deleteConfirmId) {
                    setSelectedOrder(null);
                  }
                }}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                ลบคำสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
