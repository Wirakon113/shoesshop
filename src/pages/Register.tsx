import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { THAI_PROVINCES, getDistrictsByProvince, getPostalCode } from '../data/thaiLocations';
import {
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface FormState {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
  general?: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, currentUser, isUsernameTaken } = useAuth();
  const { showToast } = useStore();

  const initialDistricts = getDistrictsByProvince('กรุงเทพมหานคร');
  const initialDistrict = initialDistricts[0]?.name || 'คลองเตย';
  const initialPostalCode = initialDistricts[0]?.postalCode || '10110';

  const [formData, setFormData] = useState<FormState>({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    district: initialDistrict,
    province: 'กรุงเทพมหานคร',
    postalCode: initialPostalCode,
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // Handle province change with auto-district and auto-postal code
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

    setTouched((prev) => ({
      ...prev,
      province: true,
      district: true,
      postalCode: true,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.province;
      delete next.district;
      delete next.postalCode;
      return next;
    });
  };

  // Handle district change with auto postal code
  const handleDistrictChange = (newDistrict: string) => {
    const autoPostalCode = getPostalCode(formData.province, newDistrict);

    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
      postalCode: autoPostalCode,
    }));

    setTouched((prev) => ({
      ...prev,
      district: true,
      postalCode: true,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.district;
      delete next.postalCode;
      return next;
    });
  };

  // Validation function
  const validateField = (name: keyof FormState, value: any): string | undefined => {
    switch (name) {
      case 'name':
        if (!String(value).trim()) return 'กรุณากรอกชื่อ';
        return undefined;

      case 'lastname':
        if (!String(value).trim()) return 'กรุณากรอกนามสกุล';
        return undefined;

      case 'email':
        if (!String(value).trim()) return 'กรุณากรอกอีเมล';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
          return 'รูปแบบอีเมลไม่ถูกต้อง (เช่น user@example.com)';
        }
        return undefined;

      case 'phone':
        if (value && !/^[0-9\-+ ]{9,15}$/.test(String(value).trim())) {
          return 'เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)';
        }
        return undefined;

      case 'address':
        if (!String(value).trim()) return 'กรุณากรอกที่อยู่สำหรับการจัดส่ง';
        return undefined;

      case 'postalCode':
        if (!String(value).trim()) return 'รหัสไปรษณีย์ไม่ถูกต้อง';
        return undefined;

      case 'province':
        if (!String(value).trim()) return 'กรุณาเลือกจังหวัด';
        return undefined;

      case 'district':
        if (!String(value).trim()) return 'กรุณาเลือกแขวง/ตำบล/เขต';
        return undefined;

      case 'username':
        if (!String(value).trim()) return 'กรุณากรอกชื่อผู้ใช้';
        if (String(value).trim().length < 3) return 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร';
        if (isUsernameTaken(String(value).trim())) return 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้อื่น';
        return undefined;

      case 'password':
        if (!value) return 'กรุณากรอกรหัสผ่าน';
        if (String(value).length < 8) return 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
        return undefined;

      case 'confirmPassword':
        if (!value) return 'กรุณากรอกยืนยันรหัสผ่าน';
        if (value !== formData.password) return 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
        return undefined;

      case 'agreeTerms':
        if (!value) return 'กรุณายอมรับเงื่อนไขการใช้งาน';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (errorMsg) {
          next[field as keyof FormErrors] = errorMsg;
        } else {
          delete next[field as keyof FormErrors];
        }
        return next;
      });
    }

    // Dynamic check confirm password if password changes
    if (field === 'password' && touched.confirmPassword) {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' }));
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (errorMsg) {
        next[field as keyof FormErrors] = errorMsg;
      } else {
        delete next[field as keyof FormErrors];
      }
      return next;
    });
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    const allTouched: Record<string, boolean> = {};

    (Object.keys(formData) as Array<keyof FormState>).forEach((field) => {
      allTouched[field] = true;
      const msg = validateField(field, formData[field]);
      if (msg) {
        newErrors[field as keyof FormErrors] = msg;
      }
    });

    setTouched(allTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      showToast('กรุณาตรวจสอบและกรอกข้อมูลให้ครบถ้วนถูกต้อง', 'error');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      const res = register(formData);
      setIsSubmitting(false);

      if (res.success) {
        showToast('สร้างบัญชีสำเร็จ ยินดีต้อนรับสู่ Shoes Shop!', 'success');
        navigate('/', { replace: true });
      } else {
        setErrors({ general: res.error || 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' });
      }
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Top Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black font-display">
            สร้างบัญชี
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1.5 font-medium">
            เข้าร่วมครอบครัว Shoes Shop เพื่อสัมผัสประสบการณ์ช้อปปิ้งที่ดีที่สุด
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
          {/* General Error Alert */}
          {errors.general && (
            <div
              id="register-general-error"
              className="mb-6 p-3.5 bg-neutral-50 border border-black rounded-xl flex items-start gap-3 text-xs text-black animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errors.general}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Two-Column: Name & Lastname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-name"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  ชื่อ (Name) <span className="text-black">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    placeholder="ชื่อจริงของคุณ"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                      touched.name && errors.name
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                        : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                </div>
                {touched.name && errors.name && (
                  <p
                    id="register-name-error"
                    className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                  >
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Lastname */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-lastname"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  นามสกุล (Lastname) <span className="text-black">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="register-lastname"
                    type="text"
                    placeholder="นามสกุลของคุณ"
                    value={formData.lastname}
                    onChange={(e) => handleChange('lastname', e.target.value)}
                    onBlur={() => handleBlur('lastname')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                      touched.lastname && errors.lastname
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                        : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                </div>
                {touched.lastname && errors.lastname && (
                  <p
                    id="register-lastname-error"
                    className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                  >
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.lastname}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-email"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  อีเมล (Email) <span className="text-black">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                      touched.email && errors.email
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                        : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p
                    id="register-email-error"
                    className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                  >
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-phone"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  เบอร์โทรศัพท์ (Phone)
                </label>
                <div className="relative">
                  <input
                    id="register-phone"
                    type="tel"
                    placeholder="0812345678"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full px-3.5 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                      touched.phone && errors.phone
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                        : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p
                    id="register-phone-error"
                    className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                  >
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-address"
                className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
              >
                ที่อยู่ / บ้านเลขที่ ถนน (Address) <span className="text-black">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-neutral-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  id="register-address"
                  rows={2}
                  placeholder="เช่น 123/45 ซอยสุขุมวิท 55 ถนนสุขุมวิท"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white resize-none ${
                    touched.address && errors.address
                      ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                      : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                  }`}
                />
              </div>
              {touched.address && errors.address && (
                <p
                  id="register-address-error"
                  className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                >
                  <AlertCircle className="w-3 h-3 text-black shrink-0" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Province, District & Auto-Generated Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Province Dropdown */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-province"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  จังหวัด (Province) <span className="text-black">*</span>
                </label>
                <div className="relative">
                  <select
                    id="register-province"
                    value={formData.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F9F9] text-sm text-black font-medium rounded-xl border border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all appearance-none cursor-pointer pr-8"
                  >
                    {THAI_PROVINCES.map((prov) => (
                      <option key={prov.name} value={prov.name}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-neutral-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {touched.province && errors.province && (
                  <p className="text-[11px] font-semibold text-black flex items-center gap-1 mt-1 pl-1">
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.province}
                  </p>
                )}
              </div>

              {/* District Dropdown */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-district"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  แขวง/ตำบล/เขต <span className="text-black">*</span>
                </label>
                <div className="relative">
                  <select
                    id="register-district"
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F9F9] text-sm text-black font-medium rounded-xl border border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all appearance-none cursor-pointer pr-8"
                  >
                    {getDistrictsByProvince(formData.province).map((dist) => (
                      <option key={dist.name} value={dist.name}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-neutral-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {touched.district && errors.district && (
                  <p className="text-[11px] font-semibold text-black flex items-center gap-1 mt-1 pl-1">
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.district}
                  </p>
                )}
              </div>

              {/* Postal Code (Auto-generated - No typing needed) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="register-postalCode"
                    className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                  >
                    รหัสไปรษณีย์
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                    <Sparkles className="w-2.5 h-2.5 text-neutral-500" /> อัตโนมัติ
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="register-postalCode"
                    type="text"
                    readOnly
                    value={formData.postalCode}
                    className="w-full px-3.5 py-2.5 bg-neutral-100 text-sm text-black font-mono font-bold tracking-wider rounded-xl border border-[#E5E5E5] cursor-default select-all"
                    title="ระบบสร้างรหัสไปรษณีย์ให้อัตโนมัติตามจังหวัดและแขวง/เขตที่เลือก"
                  />
                </div>
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-username"
                className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
              >
                ชื่อผู้ใช้ (Username) <span className="text-black">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="register-username"
                  type="text"
                  autoComplete="username"
                  placeholder="ตั้งชื่อผู้ใช้สำหรับเข้าสู่ระบบ (อย่างน้อย 3 ตัวอักษร)"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  onBlur={() => handleBlur('username')}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                    touched.username && errors.username
                      ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                      : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                  }`}
                />
              </div>
              {touched.username && errors.username && (
                <p
                  id="register-username-error"
                  className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                >
                  <AlertCircle className="w-3 h-3 text-black shrink-0" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Two-Column: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  รหัสผ่าน <span className="text-black">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                      touched.password && errors.password
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                        : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                  <button
                    type="button"
                    id="register-toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-black transition-colors"
                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p
                    id="register-password-error"
                    className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                  >
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-confirm-password"
                  className="block text-xs uppercase tracking-wider font-bold text-neutral-800"
                >
                  ยืนยันรหัสผ่าน <span className="text-black">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#F9F9F9] text-sm text-black rounded-xl border transition-all placeholder:text-neutral-400 focus:outline-none focus:bg-white ${
                      touched.confirmPassword && errors.confirmPassword
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                        : 'border-[#E5E5E5] focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                  <button
                    type="button"
                    id="register-toggle-confirm-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-black transition-colors"
                    aria-label={showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p
                    id="register-confirm-password-error"
                    className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                  >
                    <AlertCircle className="w-3 h-3 text-black shrink-0" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  id="register-agree-terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                  onBlur={() => handleBlur('agreeTerms')}
                  className="w-4 h-4 text-black rounded border-neutral-300 focus:ring-black cursor-pointer accent-black mt-0.5"
                />
                <span className="text-xs text-neutral-700 font-medium leading-relaxed group-hover:text-black transition-colors">
                  ฉันยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวของ Shoes Shop
                </span>
              </label>
              {touched.agreeTerms && errors.agreeTerms && (
                <p
                  id="register-terms-error"
                  className="text-xs font-semibold text-black flex items-center gap-1 mt-1 pl-1"
                >
                  <AlertCircle className="w-3 h-3 text-black shrink-0" />
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="register-submit-btn"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3.5 px-4 rounded-xl text-xs uppercase tracking-[0.2em] font-extrabold hover:bg-[#222222] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังสร้างบัญชี...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>สมัครสมาชิก</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Login Link Footer */}
          <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center text-xs text-neutral-600 font-medium">
            <span>มีบัญชีอยู่แล้ว? </span>
            <Link
              to="/login"
              id="register-go-to-login-link"
              className="font-bold text-black uppercase tracking-wider underline hover:text-neutral-600 transition-colors ml-1"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest font-semibold text-neutral-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
          >
            ← กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
};
