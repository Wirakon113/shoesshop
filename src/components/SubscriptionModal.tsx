import React, { useState } from 'react';
import { X, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    const targetEmail = email.trim();

    if (!targetEmail) {
      setStatus('error');
      setErrorMessage('กรุณากรอกอีเมลของคุณ');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setStatus('error');
      setErrorMessage('รูปแบบอีเมลไม่ถูกต้อง (เช่น user@example.com)');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const fullName = currentUser
        ? `${currentUser.name} ${currentUser.lastname}`.trim()
        : '';

      const response = await fetch(`${import.meta.env.BASE_URL}phpmailer_welcome/subscription.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          email: targetEmail,
          name: fullName || currentUser?.name || '',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch {
      setStatus('error');
      setErrorMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    }
  };

  const handleClose = () => {
    setEmail(currentUser?.email || '');
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0b3d91] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-white">สมัครรับข่าวสาร</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {status === 'loading' && (
            <div className="text-center py-6">
              <Loader2 className="w-10 h-10 mx-auto text-[#0b3d91] animate-spin" />
              <p className="mt-4 text-sm text-gray-500">กำลังส่งอีเมล...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 mx-auto text-green-500" />
              <h3 className="mt-4 text-lg font-bold text-[#0b3d91]">ส่งสำเร็จ!</h3>
              <p className="mt-2 text-sm text-gray-500">
                อีเมลข่าวสารได้ถูกส่งไปที่<br />
                <span className="font-semibold text-gray-700">{email}</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                ตรวจสอบกล่องจดหมายของคุณ
              </p>
              <button
                onClick={handleClose}
                className="mt-5 px-6 py-2.5 bg-[#0b3d91] text-white rounded-full text-sm font-medium hover:bg-[#092d6e] transition-colors"
              >
                ปิด
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <XCircle className="w-14 h-14 mx-auto text-red-500" />
              <h3 className="mt-4 text-lg font-bold text-red-600">ส่งไม่สำเร็จ</h3>
              <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
              <div className="flex gap-3 mt-5 justify-center">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ปิด
                </button>
                <button
                  onClick={handleSubscribe}
                  className="px-5 py-2 bg-[#0b3d91] text-white rounded-full text-sm font-medium hover:bg-[#092d6e] transition-colors"
                >
                  ลองใหม่
                </button>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#0b3d91]" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">สมัครรับข่าวสาร</h3>
              <p className="mt-2 text-sm text-gray-500">
                รับโปรโมชั่นพิเศษ ข่าวสารสินค้าใหม่<br />
                และส่วนลด 10% ทันที
              </p>

              {/* Email Input */}
              <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91] focus:border-transparent transition-all"
                />
              </div>

              <button
                onClick={handleSubscribe}
                className="mt-4 w-full px-6 py-3 bg-[#0b3d91] text-white rounded-lg text-sm font-medium hover:bg-[#092d6e] transition-colors"
              >
                สมัครรับข่าวสาร
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
