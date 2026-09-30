import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle2, CreditCard, QrCode, Truck, ArrowRight, ArrowLeft, PackageCheck, ShoppingBag, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { THAI_PROVINCES, getDistrictsByProvince, getPostalCode } from '../data/thaiLocations';

// Root-absolute so the request reaches the PHP endpoint from any route.
// A bare relative URL would resolve against e.g. /cart and return index.html
// instead of the mailer. In dev, Vite proxies this path to the PHP server
// (see vite.config.ts); on static hosts without PHP the call simply fails
// and the order flow continues with an email-failed notice.
const EMAIL_ENDPOINT = `${import.meta.env.BASE_URL}phpmailer_welcome/confirmbuy.php`;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, createOrder, showToast } = useStore();
  const { currentUser } = useAuth();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card' | 'cod'>('promptpay');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    province: 'กรุงเทพมหานคร',
    postalCode: '',
    notes: '',
  });
  const [orderNumber, setOrderNumber] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [formError, setFormError] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'failed'>('idle');
  const [placedTotal, setPlacedTotal] = useState(0);
  // Tracks whether the open-prefill below already ran for the current
  // open session. The parent passes a new `onClose` closure (and the store
  // provides a new `showToast`) on every render, so this effect must NOT
  // re-run on those identities — otherwise it would reset `step` back to
  // 'details' right after a successful submit (order created + cart cleared
  // re-render the tree) and the success screen would never stick.
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }
    if (wasOpenRef.current) {
      return;
    }
    wasOpenRef.current = true;
    if (!currentUser) {
      onClose();
      showToast('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า', 'warning');
      navigate('/login', {
        state: {
          from: { pathname: '/cart' },
          message: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการสั่งซื้อสินค้าและชำระเงิน',
        },
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      firstName: currentUser.name || prev.firstName,
      lastName: currentUser.lastname || prev.lastName,
      email: currentUser.email || prev.email,
      phone: currentUser.phone || prev.phone,
      address: currentUser.address || prev.address,
      district: currentUser.district || prev.district || '',
      province: currentUser.province || prev.province || 'กรุงเทพมหานคร',
      postalCode: currentUser.postalCode || prev.postalCode || '',
    }));
    setStep('details');
    setOrderNumber('');
    setFormError('');
    setEmailStatus('idle');
    setPlacedTotal(0);
    setIsPlacing(false);
  }, [currentUser, isOpen, navigate, onClose, showToast]);

  if (!isOpen) return null;

  const shippingCost = cartTotal >= 2500 ? 0 : 150;
  const finalTotal = cartTotal + shippingCost;

  const formattedFinalTotal = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(finalTotal);

  const formattedPlacedTotal = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(placedTotal);

  const validateCheckoutForm = (): string => {
    if (!formData.firstName.trim()) return 'กรุณากรอกชื่อจริง (First Name)';
    if (!formData.lastName.trim()) return 'กรุณากรอกนามสกุล (Last Name)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return 'กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com';
    }
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 10) {
      return 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9–10 หลัก)';
    }
    if (!formData.address.trim()) return 'กรุณากรอกที่อยู่ / บ้านเลขที่ ถนน';
    if (!formData.province.trim()) return 'กรุณาเลือกจังหวัด (Province)';
    if (!formData.district.trim()) return 'กรุณาเลือกแขวง / ตำบล / เขต (District)';
    if (!/^\d{5}$/.test(formData.postalCode.trim())) {
      return 'กรุณากรอกรหัสไปรษณีย์ 5 หลักให้ถูกต้อง';
    }
    if (paymentMethod !== 'promptpay' && paymentMethod !== 'card' && paymentMethod !== 'cod') {
      return 'กรุณาเลือกช่องทางการชำระเงิน';
    }
    return '';
  };

  // Best-effort confirmation email via the existing PHPMailer endpoint
  // (same relative-path pattern as SubscriptionModal). The order is already
  // saved locally at this point, so an email failure must NOT roll back or
  // duplicate the order — it only flips the notice shown on success.
  const sendOrderConfirmationEmail = async (payload: {
    email: string;
    customerName: string;
    orderId: string;
    createdAt: string;
    status: string;
    paymentMethod: string;
    shippingAddress: string;
    customerPhone: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    notes?: string;
    items: { productId: number; name: string; price: number; size: number; quantity: number; image: string }[];
  }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      let response: Response;
      try {
        response = await fetch(EMAIL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeout);
      }
      if (!response.ok) {
        const reason = `email endpoint HTTP ${response.status}`;
        console.error('[checkout] confirmation email failed:', reason);
        return { ok: false, error: reason };
      }
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const reason = 'email service did not return JSON (email service unavailable)';
        console.error('[checkout] confirmation email failed:', reason, `(${contentType || 'unknown content-type'})`);
        return { ok: false, error: reason };
      }
      const result = await response.json();
      if (result && result.success === true) {
        return { ok: true };
      }
      const reason =
        (result && typeof result.error === 'string' && result.error) ||
        'email service rejected the request';
      console.error('[checkout] confirmation email failed:', reason);
      return { ok: false, error: reason };
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'network error';
      console.error('[checkout] confirmation email failed:', reason);
      return { ok: false, error: reason };
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent duplicate orders from rapid / double clicks.
    if (isPlacing) return;

    if (cart.length === 0) {
      const msg = 'ตะกร้าสินค้าว่าง ไม่สามารถสั่งซื้อได้';
      setFormError(msg);
      showToast(msg, 'error');
      return;
    }

    const validationError = validateCheckoutForm();
    if (validationError) {
      // Do NOT create an order, clear the cart, or send any email.
      setFormError(validationError);
      showToast(validationError, 'error');
      return;
    }
    setFormError('');

    setIsPlacing(true);
    setEmailStatus('idle');

    try {
      // Snapshot everything BEFORE create/clear so the success screen and
      // the email use the real totals even after the cart is emptied.
      const snapshotItems = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        category: item.category,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.image,
      }));
      const snapshotSubtotal = cartTotal;
      const snapshotShipping = shippingCost;
      const snapshotTotal = finalTotal;
      const customerEmail = formData.email.trim();
      const customerName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const customerPhone = formData.phone.trim();
      const fullAddress = [
        formData.address.trim(),
        formData.district ? `แขวง/ตำบล ${formData.district.trim()}` : '',
        `จ.${formData.province.trim()}`,
        formData.postalCode.trim(),
      ].filter(Boolean).join(' ');

      // 1) Create + save the order first (SQLite API หรือ localStorage store).
      const newOrder = await createOrder({
        userId: currentUser?.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: fullAddress,
        items: snapshotItems,
        subtotal: snapshotSubtotal,
        shippingCost: snapshotShipping,
        total: snapshotTotal,
        paymentMethod: paymentMethod,
        status: 'pending',
        notes: formData.notes.trim() || undefined,
      });

      // 2) Flip to the success step BEFORE any async work, so a re-render
      // can never leave the user stuck on SHIPPING & PAYMENT.
      setOrderNumber(newOrder.id);
      setPlacedTotal(snapshotTotal);
      setStep('success');

      // 3) Send the confirmation email (best-effort; order stays valid).
      const { ok: emailSent } = await sendOrderConfirmationEmail({
        email: customerEmail,
        customerName,
        orderId: newOrder.id,
        createdAt: newOrder.createdAt,
        status: newOrder.status,
        paymentMethod,
        shippingAddress: fullAddress,
        customerPhone,
        subtotal: snapshotSubtotal,
        shippingCost: snapshotShipping,
        total: snapshotTotal,
        notes: formData.notes.trim() || undefined,
        items: snapshotItems.map(({ productId, name, price, size, quantity, image }) => ({
          productId,
          name,
          price,
          size,
          quantity,
          image,
        })),
      });
      setEmailStatus(emailSent ? 'sent' : 'failed');

      // 4) Clear the cart silently ONLY after the order exists — no
      // misleading "cart cleared" toast; report the order outcome instead.
      await clearCart(true);
      if (emailSent) {
        showToast(`สั่งซื้อสำเร็จ! หมายเลขคำสั่งซื้อ ${newOrder.id}`, 'success');
      } else {
        showToast(
          `สั่งซื้อสำเร็จ ${newOrder.id} แต่ส่งอีเมลยืนยันไม่สำเร็จ กรุณาตรวจสอบอีเมลหรือติดต่อร้าน`,
          'info'
        );
      }
    } catch {
      // Order NOT created (or not confirmed): keep the cart untouched.
      const msg = 'ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง';
      setFormError(msg);
      showToast(msg, 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleProvinceChange = (newProvince: string) => {
    const districts = getDistrictsByProvince(newProvince);
    const firstDistrict = districts[0]?.name || '';
    const autoPostalCode = districts[0]?.postalCode || '';

    setFormData((prev) => ({
      ...prev,
      province: newProvince,
      district: firstDistrict,
      postalCode: autoPostalCode,
    }));
  };

  const handleDistrictChange = (newDistrict: string) => {
    const autoPostalCode = getPostalCode(formData.province, newDistrict);

    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
      postalCode: autoPostalCode,
    }));
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="checkout-modal-container"
        className="relative bg-white max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden p-6 sm:p-8 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="checkout-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1.5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 'details' ? (
          <div>
            <div className="border-b border-neutral-200 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">MONO STEP Checkout</span>
                {currentUser && (
                  <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full font-medium">
                    กรอกข้อมูลอัตโนมัติจากบัญชี: <strong className="text-black font-semibold">{currentUser.username}</strong>
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-black tracking-tight mt-1">SHIPPING & PAYMENT</h2>
              <p className="text-xs text-neutral-500 mt-0.5">ระบุที่อยู่จัดส่งและเลือกช่องทางการชำระเงิน</p>
            </div>

            {formError && (
              <div className="mb-4 border border-red-300 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">1. Contact & Delivery Info (ข้อมูลผู้รับและที่อยู่จัดส่ง)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      ชื่อจริง (First Name) *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="สมชาย"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black font-medium text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      นามสกุล (Last Name) *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="ใจดี"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black font-medium text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      อีเมล (Email Address) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="somchai@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black font-medium text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      เบอร์โทรศัพท์ (Phone Number) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="089-987-6543"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black font-medium text-black"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    ที่อยู่ / บ้านเลขที่ ถนน (Street Address) *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="99/1 ถ.สุขุมวิท"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black font-medium text-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      จังหวัด (Province) *
                    </label>
                    <div className="relative">
                      <select
                        name="province"
                        required
                        value={formData.province}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black font-medium text-black appearance-none cursor-pointer pr-7"
                      >
                        {THAI_PROVINCES.map((prov) => (
                          <option key={prov.name} value={prov.name}>
                            {prov.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-neutral-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      แขวง / ตำบล / เขต *
                    </label>
                    <div className="relative">
                      <select
                        name="district"
                        required
                        value={formData.district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black font-medium text-black appearance-none cursor-pointer pr-7"
                      >
                        {getDistrictsByProvince(formData.province).map((dist) => (
                          <option key={dist.name} value={dist.name}>
                            {dist.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-neutral-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                        รหัสไปรษณีย์
                      </label>
                      <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-1 py-0.2 rounded border border-neutral-200">
                        อัตโนมัติ
                      </span>
                    </div>
                    <input
                      type="text"
                      name="postalCode"
                      readOnly
                      value={formData.postalCode}
                      className="w-full bg-neutral-100 border border-neutral-300 px-3 py-2 text-sm focus:outline-none font-mono font-bold text-black cursor-default select-all"
                      title="รหัสไปรษณีย์สร้างให้อัตโนมัติ"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    หมายเหตุถึงผู้จัดส่ง (Optional Delivery Note)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="เช่น ฝากไว้ที่ป้อม รปภ., โทรแจ้งก่อนส่ง..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-[#F5F5F5] border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black text-black"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">2. Select Payment Option (เลือกวิธีชำระเงิน)</h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-3 text-left border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'promptpay'
                        ? 'border-black bg-black text-white shadow-md'
                        : 'border-neutral-200 bg-white text-black hover:border-neutral-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">PromptPay QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 text-left border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-black bg-black text-white shadow-md'
                        : 'border-neutral-200 bg-white text-black hover:border-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 text-left border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-black text-white shadow-md'
                        : 'border-neutral-200 bg-white text-black hover:border-neutral-400'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-4 border-t border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span>Items Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} pairs)</span>
                  <span className="font-semibold text-black">
                    ฿{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-black">
                    {shippingCost === 0 ? 'FREE (จัดส่งฟรี)' : `฿${shippingCost}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-extrabold text-black pt-2 border-t border-neutral-200">
                  <span>Total Amount (ยอดรวมสุทธิ)</span>
                  <span>{formattedFinalTotal}</span>
                </div>
              </div>

              {/* Cancel and Confirm Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  id="checkout-cancel-btn"
                  onClick={onClose}
                  className="w-full sm:w-1/3 py-3.5 px-4 border border-neutral-300 bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 hover:border-black text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ยกเลิก (Cancel)</span>
                </button>

                <button
                  type="submit"
                  id="checkout-confirm-btn"
                  disabled={isPlacing}
                  className="w-full sm:w-2/3 bg-black text-white py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-black"
                >
                  {isPlacing ? (
                    <span>กำลังดำเนินการสั่งซื้อ... (PROCESSING...)</span>
                  ) : (
                    <>
                      <span>ยืนยันสั่งซื้อ (Confirm Order)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-black text-white mx-auto flex items-center justify-center rounded-full shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Order Confirmed</span>
              <h2 className="text-2xl font-black text-black tracking-tight mt-1">THANK YOU FOR YOUR ORDER</h2>
              <p className="text-sm text-neutral-600 mt-2">
                รหัสคำสั่งซื้อ (Order ID): <span className="font-bold text-black bg-neutral-100 px-2 py-0.5 rounded font-mono">{orderNumber}</span>
              </p>
            </div>

            <div className="bg-neutral-50 p-5 text-left border border-neutral-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">ผู้รับ (Recipient):</span>
                <span className="font-semibold text-black">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ที่อยู่จัดส่ง:</span>
                <span className="font-semibold text-black text-right max-w-[280px]">
                  {formData.address} {formData.district} {formData.province} {formData.postalCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">วิธีชำระเงิน:</span>
                <span className="font-semibold text-black uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200">
                <span className="text-neutral-500">ยอดชำระสุทธิ:</span>
                <span className="font-bold text-black text-sm">{formattedPlacedTotal}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              ระบบได้บันทึกคำสั่งซื้อเรียบร้อยแล้ว คุณสามารถตรวจสอบสถานะการจัดส่งได้ที่หน้าประวัติการสั่งซื้อ
            </p>

            {emailStatus === 'sent' && (
              <p className="text-xs text-green-700 border border-green-200 bg-green-50 px-3 py-2">
                ส่งอีเมลยืนยันคำสั่งซื้อไปที่ {formData.email} เรียบร้อยแล้ว
              </p>
            )}
            {emailStatus === 'failed' && (
              <p className="text-xs text-amber-800 border border-amber-200 bg-amber-50 px-3 py-2">
                สร้างคำสั่งซื้อสำเร็จแล้ว แต่ส่งอีเมลยืนยันไม่สำเร็จ กรุณาตรวจสอบอีเมลของคุณหรือติดต่อร้าน
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="view-orders-btn"
                onClick={() => {
                  onClose();
                  navigate('/orders');
                }}
                className="w-full bg-black text-white py-3.5 text-xs uppercase tracking-wider font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <PackageCheck className="w-4 h-4" />
                <span>ดูประวัติการสั่งซื้อ</span>
              </button>

              <button
                id="continue-shopping-btn"
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                className="w-full border border-neutral-300 bg-white text-neutral-800 py-3.5 text-xs uppercase tracking-wider font-bold hover:bg-neutral-100 hover:border-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ช้อปสินค้าต่อ</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
