import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import {
  Eye,
  EyeOff,
  User as UserIcon,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser, rememberedUsername } = useAuth();
  const { showToast } = useStore();

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Error State
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // If already logged in, redirect to home or previous page
  useEffect(() => {
    if (currentUser) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  // Load remembered username if available
  useEffect(() => {
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, [rememberedUsername]);

  // Real-time Field Validation
  const validateField = (field: 'username' | 'password', val: string) => {
    const newErrors = { ...errors };
    if (field === 'username') {
      if (!val.trim()) {
        newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
      } else {
        delete newErrors.username;
      }
    }

    if (field === 'password') {
      if (!val) {
        newErrors.password = 'กรุณากรอกรหัสผ่าน';
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
  };

  const handleBlur = (field: 'username' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'username') validateField('username', username);
    if (field === 'password') validateField('password', password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    const newErrors: { username?: string; password?: string; general?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    }
    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Simulate snappy login processing
    setTimeout(() => {
      const res = login({
        username: username.trim(),
        password,
        rememberMe,
      });

      setIsSubmitting(false);

      if (res.success) {
        showToast('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับสู่ Shoes Shop', 'success');
        const from = (location.state as any)?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setErrors({ general: res.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      }
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      showToast('กรุณากรอกอีเมลให้ถูกต้อง', 'error');
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setIsForgotModalOpen(false);
      setForgotEmail('');
      showToast('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว', 'success');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Subtle Monochrome Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black font-display">
            เข้าสู่ระบบ
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1.5 font-medium">
            ยินดีต้อนรับสู่ Shoes Shop • Step into your style
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
          {/* Checkout / Auth Required Prompt */}
          {location.state?.message && !errors.general && (
            <div
              id="login-auth-required-banner"
              className="mb-6 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950 animate-in fade-in slide-in-from-top-1"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-900">ต้องเข้าสู่ระบบก่อนดำเนินการ</span>
                <span className="font-medium text-amber-800">{location.state.message}</span>
              </div>
            </div>
          )}

          {/* General Error Banner */}
          {errors.general && (
            <div
              id="login-general-error"
              className="mb-6 p-3.5 bg-neutral-50 border border-black rounded-xl flex items-start gap-3 text-xs text-black animate-in fade-in slide-in-from-top-1"
            >
              <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errors.general}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
              >
                ชื่อผู้ใช้ (Username) <span className="text-black">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="กรอกชื่อผู้ใช้ของคุณ"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (touched.username) validateField('username', e.target.value);
                  }}
                  onBlur={() => handleBlur('username')}
                  className={`w-full pl-10 pr-4 py-3 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                    touched.username && errors.username
                      ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                      : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                  }`}
                />
              </div>
              {touched.username && errors.username && (
                <p
                  id="login-username-error"
                  className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                >
                  <AlertCircle className="w-3 h-3 text-black shrink-0" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  รหัสผ่าน (Password) <span className="text-black">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-bold text-neutral-600 hover:text-black border-b border-transparent hover:border-black pb-0.5 transition-all"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) validateField('password', e.target.value);
                  }}
                  onBlur={() => handleBlur('password')}
                  className={`w-full pl-10 pr-11 py-3 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                    touched.password && errors.password
                      ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                      : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                  }`}
                />
                <button
                  type="button"
                  id="login-toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-black transition-colors"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p
                  id="login-password-error"
                  className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                >
                  <AlertCircle className="w-3 h-3 text-black shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  id="login-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-black rounded border-neutral-300 focus:ring-black cursor-pointer accent-black"
                />
                <span className="text-xs text-neutral-700 font-medium group-hover:text-black transition-colors">
                  Remember me (จดจำฉันไว้ในระบบ)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3.5 px-4 rounded-xl text-xs uppercase tracking-[0.2em] font-extrabold hover:bg-[#222222] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Register Link Footer */}
          <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center text-xs text-neutral-600 font-medium">
            <span>ยังไม่มีบัญชี? </span>
            <Link
              to="/register"
              id="login-go-to-register-link"
              className="font-bold text-black uppercase tracking-wider underline hover:text-neutral-600 transition-colors ml-1"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>

        {/* Safe Back to Store */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest font-semibold text-neutral-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
          >
            ← กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-[#F5F5F5] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-left space-y-3">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center text-black">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-black font-display">
                รีเซ็ตรหัสผ่าน
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                กรอกอีเมลที่คุณใช้ลงทะเบียน เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้
              </p>

              {forgotSuccess ? (
                <div className="p-4 bg-[#F5F5F5] border border-black rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-black mx-auto" />
                  <p className="text-xs font-bold text-black">
                    ส่งคำขอรีเซ็ตรหัสผ่านเรียบร้อยแล้ว
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-neutral-700 mb-1">
                      อีเมลของคุณ
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    ส่งลิงก์รีเซ็ต
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
