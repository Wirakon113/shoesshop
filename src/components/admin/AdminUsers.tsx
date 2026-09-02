import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';
import { THAI_PROVINCES, getDistrictsByProvince, getPostalCode } from '../../data/thaiLocations';
import {
  Users,
  Search,
  ShieldCheck,
  User as UserIcon,
  ShieldAlert,
  Trash2,
  Edit2,
  Plus,
  X,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
  KeyRound,
  RotateCcw,
  Building,
  Hash,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const {
    users,
    currentUser,
    updateUserRole,
    deleteUser,
    addUserByAdmin,
    updateUserByAdmin,
    resetUserStore,
  } = useAuth();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    province: 'กรุงเทพมหานคร',
    district: 'พระนคร',
    postalCode: '10200',
    username: '',
    password: '',
    role: 'user' as UserRole,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.lastname.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search)) ||
      (u.address && u.address.toLowerCase().includes(search.toLowerCase())) ||
      (u.province && u.province.toLowerCase().includes(search.toLowerCase())) ||
      (u.district && u.district.toLowerCase().includes(search.toLowerCase())) ||
      (u.postalCode && u.postalCode.includes(search));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleProvinceChange = (newProvince: string) => {
    const districts = getDistrictsByProvince(newProvince);
    const firstDistrict = districts[0]?.name || '';
    const firstPostal = districts[0]?.postalCode || '';
    setFormData((prev) => ({
      ...prev,
      province: newProvince,
      district: firstDistrict,
      postalCode: firstPostal,
    }));
  };

  const handleDistrictChange = (newDistrict: string) => {
    const newPostal = getPostalCode(formData.province, newDistrict);
    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
      postalCode: newPostal || prev.postalCode,
    }));
  };

  const handleOpenAdd = () => {
    const defaultProvince = 'กรุงเทพมหานคร';
    const defaultDistricts = getDistrictsByProvince(defaultProvince);
    const defaultDistrict = defaultDistricts[0]?.name || 'คลองเตย';
    const defaultPostal = defaultDistricts[0]?.postalCode || '10110';

    setFormData({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      address: '',
      province: defaultProvince,
      district: defaultDistrict,
      postalCode: defaultPostal,
      username: '',
      password: '',
      role: 'user',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    const prov = user.province || 'กรุงเทพมหานคร';
    const distList = getDistrictsByProvince(prov);
    const dist = user.district || distList[0]?.name || '';
    const post = user.postalCode || getPostalCode(prov, dist) || '';

    setFormData({
      name: user.name || '',
      lastname: user.lastname || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      province: prov,
      district: dist,
      postalCode: post,
      username: user.username || '',
      password: user.password || '',
      role: user.role || 'user',
    });
    setFormErrors({});
  };

  const validateForm = (isEdit = false) => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'กรุณากรอกชื่อจริง';
    if (!formData.lastname.trim()) errors.lastname = 'กรุณากรอกนามสกุล';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'กรุณากรอกอีเมลที่ถูกต้อง';
    if (!formData.username.trim()) errors.username = 'กรุณาระบุ Username';
    if (!formData.address.trim()) errors.address = 'กรุณาระบุที่อยู่ (เลขที่, ซอย, ถนน)';
    if (!formData.postalCode.trim()) errors.postalCode = 'กรุณาระบุรหัสไปรษณีย์';
    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      errors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    const result = addUserByAdmin({
      name: formData.name.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      province: formData.province.trim(),
      district: formData.district.trim(),
      postalCode: formData.postalCode.trim(),
      username: formData.username.trim(),
      password: formData.password,
      role: formData.role,
    });

    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      setFormErrors({ username: result.message || 'เกิดข้อผิดพลาด' });
    }
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !validateForm(true)) return;

    const updatePayload: Partial<User> = {
      name: formData.name.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      province: formData.province.trim(),
      district: formData.district.trim(),
      postalCode: formData.postalCode.trim(),
      username: formData.username.trim(),
      role: formData.role,
    };

    if (formData.password && formData.password.trim().length > 0) {
      updatePayload.password = formData.password.trim();
    }

    const result = updateUserByAdmin(editingUser.id, updatePayload);
    if (result.success) {
      setEditingUser(null);
    } else {
      setFormErrors({ username: result.message || 'เกิดข้อผิดพลาด' });
    }
  };

  const handleToggleRole = (user: User) => {
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    updateUserRole(user.id, newRole);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
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
            <Users className="w-5 h-5" />
            จัดการบัญชีผู้ใช้งาน (Users & Roles)
          </h2>
          <p className="text-xs text-neutral-500">
            ระบบกำหนดสิทธิ์การเข้าถึง (RBAC): Admin จัดการร้านค้า และ User สำหรับสั่งซื้อสินค้า
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตรายชื่อผู้ใช้เป็นค่าเริ่มต้น (รวมถึง admin2547) หรือไม่?')) {
                resetUserStore();
              }
            }}
            className="flex-1 sm:flex-initial py-2.5 px-3 border border-neutral-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            title="รีเซ็ตบัญชีผู้ใช้เริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            รีเซ็ตผู้ใช้
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มผู้ใช้ใหม่
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 border border-neutral-200">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, นามสกุล, username (@admin2547), อีเมล, เบอร์โทร..."
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 text-xs focus:outline-none focus:border-black"
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

        {/* Role Filter */}
        <div className="flex items-center justify-start md:justify-end gap-1">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
              roleFilter === 'all'
                ? 'bg-black text-white border-black'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            ทั้งหมด ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
              roleFilter === 'admin'
                ? 'bg-black text-white border-black'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            ADMIN ({users.filter((u) => u.role === 'admin').length})
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
              roleFilter === 'user'
                ? 'bg-black text-white border-black'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
            }`}
          >
            USER ({users.filter((u) => u.role === 'user').length})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3.5 px-4">ผู้ใช้งาน (User Profile)</th>
                <th className="py-3.5 px-4">ชื่อผู้ใช้ (Username)</th>
                <th className="py-3.5 px-4">อีเมล & เบอร์โทร</th>
                <th className="py-3.5 px-4">ที่อยู่ & รหัสไปรษณีย์</th>
                <th className="py-3.5 px-4">สิทธิ์การเข้าถึง (Role)</th>
                <th className="py-3.5 px-4">วันที่สมัคร</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                    ไม่พบข้อมูลผู้ใช้งานที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isMasterAdmin = user.username.toLowerCase() === 'admin2547';
                  const isCurrent = currentUser?.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-none flex items-center justify-center font-bold text-xs shrink-0 ${
                              user.role === 'admin'
                                ? 'bg-black text-white'
                                : 'bg-neutral-100 text-black border border-neutral-200'
                            }`}
                          >
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-black text-sm flex items-center gap-1.5">
                              {user.name} {user.lastname}
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-neutral-200 text-neutral-700 font-semibold">
                                  คุณ
                                </span>
                              )}
                            </div>
                            <div className="text-neutral-400 text-[11px]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-black bg-neutral-100 px-2 py-1">
                          @{user.username}
                        </span>
                        {isMasterAdmin && (
                          <div className="text-[10px] text-amber-700 font-bold mt-1">
                            ★ Master Admin
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-neutral-700 font-medium">{user.email}</div>
                        <div className="text-neutral-500 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{user.phone || '-'}</span>
                        </div>
                      </td>

                      {/* Address & Postal Code */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-[220px]">
                          <div className="text-neutral-800 text-xs font-medium line-clamp-1">
                            {user.address || 'ยังไม่ได้ระบุที่อยู่'}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            {(user.district || user.province) && (
                              <span className="text-[11px] text-neutral-500 truncate">
                                {user.district ? `${user.district}, ` : ''}{user.province || ''}
                              </span>
                            )}
                            {user.postalCode ? (
                              <span className="shrink-0 px-1.5 py-0.2 bg-neutral-100 border border-neutral-300 font-mono font-bold text-[10px] text-black">
                                📮 {user.postalCode}
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-400">ไม่มีรหัสไปรษณีย์</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge & Quick Switcher */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              user.role === 'admin'
                                ? 'bg-black text-white'
                                : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                            }`}
                          >
                            {user.role === 'admin' ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                            )}
                            {user.role}
                          </span>

                          {!isMasterAdmin && (
                            <button
                              onClick={() => handleToggleRole(user)}
                              className="text-[10px] uppercase font-bold text-neutral-500 hover:text-black hover:underline"
                              title={`สลับเป็น ${user.role === 'admin' ? 'USER' : 'ADMIN'}`}
                            >
                              สลับสิทธิ์
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedUserDetail(user)}
                            className="p-1.5 text-neutral-500 hover:text-black border border-transparent hover:border-neutral-300 transition-colors"
                            title="ดูรายละเอียดข้อมูลผู้ใช้และที่อยู่"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 text-neutral-600 hover:text-black border border-transparent hover:border-neutral-300 transition-colors"
                            title="แก้ไขข้อมูลผู้ใช้และที่อยู่"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isMasterAdmin && (
                            <button
                              onClick={() => setDeleteConfirmId(user.id)}
                              disabled={isCurrent}
                              className={`p-1.5 border border-transparent transition-colors ${
                                isCurrent
                                  ? 'text-neutral-300 cursor-not-allowed'
                                  : 'text-neutral-400 hover:text-red-600 hover:border-red-200'
                              }`}
                              title={isCurrent ? 'ไม่สามารถลบบัญชีตัวเองได้' : 'ลบผู้ใช้'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Detail Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full border border-neutral-200 p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedUserDetail(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-neutral-200">
              <div
                className={`w-12 h-12 flex items-center justify-center text-lg font-bold ${
                  selectedUserDetail.role === 'admin' ? 'bg-black text-white' : 'bg-neutral-100 text-black'
                }`}
              >
                {selectedUserDetail.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-black text-black">
                  {selectedUserDetail.name} {selectedUserDetail.lastname}
                </h3>
                <span className="font-mono text-xs font-bold bg-neutral-100 px-2 py-0.5">
                  @{selectedUserDetail.username}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 p-3">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">สิทธิ์ (Role)</span>
                  <span className="font-bold text-black uppercase">{selectedUserDetail.role}</span>
                </div>
                <div className="bg-neutral-50 p-3">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">วันที่สร้างบัญชี</span>
                  <span className="font-mono font-medium text-black">{formatDate(selectedUserDetail.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="font-medium">{selectedUserDetail.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="font-mono">{selectedUserDetail.phone || 'ไม่มีเบอร์โทรศัพท์'}</span>
                </div>
              </div>

              {/* Detailed Address Card */}
              <div className="mt-4 p-3.5 bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-black text-[11px]">
                    <MapPin className="w-4 h-4 text-neutral-700" />
                    <span>ข้อมูลที่อยู่จัดส่งและรหัสไปรษณีย์</span>
                  </div>
                  {selectedUserDetail.postalCode && (
                    <span className="px-2 py-0.5 bg-black text-white font-mono font-bold text-[10px]">
                      รหัสไปรษณีย์: {selectedUserDetail.postalCode}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-neutral-400 block">ที่อยู่ (เลขที่, ซอย, ถนน)</span>
                    <span className="font-medium text-neutral-900">{selectedUserDetail.address || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">เขต / อำเภอ</span>
                    <span className="font-medium text-neutral-900">{selectedUserDetail.district || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">จังหวัด</span>
                    <span className="font-medium text-neutral-900">{selectedUserDetail.province || '-'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-neutral-400 block">รหัสไปรษณีย์ (Postal Code)</span>
                    <span className="font-mono font-bold text-black">{selectedUserDetail.postalCode || '-'}</span>
                  </div>
                </div>

                {/* Full address summary string */}
                <div className="mt-2 pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-600 bg-white p-2 border border-neutral-200">
                  <strong className="text-black">ที่อยู่เต็ม: </strong>
                  {[
                    selectedUserDetail.address,
                    selectedUserDetail.district ? `เขต/อำเภอ ${selectedUserDetail.district}` : '',
                    selectedUserDetail.province ? `จ.${selectedUserDetail.province}` : '',
                    selectedUserDetail.postalCode || '',
                  ]
                    .filter(Boolean)
                    .join(' ') || 'ยังไม่ได้ระบุที่อยู่'}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-between items-center">
              <button
                onClick={() => {
                  const u = selectedUserDetail;
                  setSelectedUserDetail(null);
                  handleOpenEdit(u);
                }}
                className="py-2 px-4 border border-black hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                แก้ไขข้อมูลผู้ใช้นี้
              </button>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="py-2 px-5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-white max-w-2xl w-full border border-neutral-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingUser(null);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="border-b border-neutral-200 pb-3 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                Admin User Portal
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">
                {editingUser ? `แก้ไขข้อมูลผู้ใช้: @${editingUser.username}` : 'เพิ่มผู้ใช้งานใหม่ลงในระบบ'}
              </h3>
            </div>

            <form onSubmit={editingUser ? handleSubmitEdit : handleSubmitAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    ชื่อจริง (First Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น สมศักดิ์"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-medium"
                  />
                  {formErrors.name && <p className="text-red-500 text-[11px] mt-1">{formErrors.name}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    นามสกุล (Last Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    placeholder="เช่น มั่นคง"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-medium"
                  />
                  {formErrors.lastname && <p className="text-red-500 text-[11px] mt-1">{formErrors.lastname}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    อีเมล (Email) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                  {formErrors.email && <p className="text-red-500 text-[11px] mt-1">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    เบอร์โทรศัพท์ (Phone)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081-234-5678"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    ชื่อผู้ใช้ (Username) *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="เช่น somsak88"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono"
                  />
                  {formErrors.username && <p className="text-red-500 text-[11px] mt-1">{formErrors.username}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    {editingUser ? 'เปลี่ยนรหัสผ่าน (เว้นว่างหากไม่เปลี่ยน)' : 'รหัสผ่าน (Password) *'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? '••••••••' : 'อย่างน้อย 6 ตัวอักษร'}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono"
                  />
                  {formErrors.password && <p className="text-red-500 text-[11px] mt-1">{formErrors.password}</p>}
                </div>

                {/* Role */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    สิทธิ์การใช้งาน (User Role) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`border p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                        formData.role === 'user' ? 'border-black bg-neutral-50' : 'border-neutral-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={formData.role === 'user'}
                        onChange={() => setFormData({ ...formData, role: 'user' })}
                        className="accent-black"
                      />
                      <div>
                        <div className="text-xs font-bold uppercase text-black">USER (ผู้ซื้อทั่วไป)</div>
                        <div className="text-[11px] text-neutral-500">เลือกดูสินค้าและสั่งซื้อ</div>
                      </div>
                    </label>

                    <label
                      className={`border p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                        formData.role === 'admin' ? 'border-black bg-neutral-50' : 'border-neutral-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={() => setFormData({ ...formData, role: 'admin' })}
                        className="accent-black"
                      />
                      <div>
                        <div className="text-xs font-bold uppercase text-black">ADMIN (ผู้ดูแลระบบ)</div>
                        <div className="text-[11px] text-neutral-500">จัดการสินค้า ผู้ใช้ และออเดอร์</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Address Section Header */}
                <div className="sm:col-span-2 pt-3 border-t border-neutral-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black mb-1">
                    <MapPin className="w-4 h-4 text-black" />
                    <span>ข้อมูลที่อยู่จัดส่งและรหัสไปรษณีย์ (Shipping Address)</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mb-3">
                    ระบุข้อมูลที่อยู่ เขต/อำเภอ จังหวัด และรหัสไปรษณีย์ของผู้ใช้ สำหรับการจัดส่งสินค้า
                  </p>
                </div>

                {/* Address (House / Soi / Road) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    ที่อยู่ (เลขที่, อาคาร, ซอย, ถนน) *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="เช่น 123/45 ซอยสุขุมวิท 55 ถนนสุขุมวิท"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-medium"
                  />
                  {formErrors.address && <p className="text-red-500 text-[11px] mt-1">{formErrors.address}</p>}
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    จังหวัด (Province) *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black bg-white font-medium"
                  >
                    {THAI_PROVINCES.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    เขต / อำเภอ (District) *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black bg-white font-medium"
                  >
                    {getDistrictsByProvince(formData.province).map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Postal Code */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1 flex items-center justify-between">
                    <span>รหัสไปรษณีย์ (Postal Code) *</span>
                    <span className="text-[10px] text-neutral-400 font-normal">ระบบดึงอัตโนมัติตามเขต/อำเภอ หรือระบุเองได้</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="เช่น 10110"
                      maxLength={5}
                      className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono font-bold text-black"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 border border-neutral-200">
                      POSTCODE
                    </span>
                  </div>
                  {formErrors.postalCode && <p className="text-red-500 text-[11px] mt-1">{formErrors.postalCode}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="py-2.5 px-5 border border-neutral-300 text-neutral-700 hover:border-black text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  {editingUser ? 'บันทึกการแก้ไข' : 'สร้างบัญชีผู้ใช้'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              ยืนยันการลบผู้ใช้งาน?
            </h3>
            <p className="text-xs text-neutral-600 mb-6">
              การกระทำนี้จะลบประวัติและบัญชีผู้ใช้นี้ออกจากระบบอย่างถาวร
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
                  deleteUser(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                ลบผู้ใช้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
