import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterFormData, UserRole } from '../types';

const USERS_STORAGE_KEY = 'shoes_shop_users_v2';
const CURRENT_USER_STORAGE_KEY = 'shoes_shop_current_user_v2';
const REMEMBERED_USERNAME_KEY = 'shoes_shop_remembered_username_v1';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'ผู้ดูแลระบบ',
    lastname: 'ShoesShop',
    email: 'admin@shoesshop.com',
    phone: '081-234-5678',
    address: '100/1 ศูนย์การค้าสยามสแควร์ แขวงปทุมวัน',
    district: 'ปทุมวัน',
    province: 'กรุงเทพมหานคร',
    postalCode: '10330',
    username: 'admin2547',
    password: 'admin2547',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user_demo_1',
    name: 'สมชาย',
    lastname: 'ใจดี',
    email: 'somchai@example.com',
    phone: '089-987-6543',
    address: '99/1 ถ.สุขุมวิท แขวงคลองเตย',
    district: 'คลองเตย',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    username: 'mmmm2547',
    password: 'mmmm2547',
    role: 'user',
    createdAt: '2026-02-15T08:30:00.000Z',
  },
  {
    id: 'user_demo_2',
    name: 'กานดา',
    lastname: 'รักษ์ดี',
    email: 'kanda.r@example.com',
    phone: '084-555-1235',
    address: '254/8 ซอยทองหล่อ 10 แขวงคลองตันเหนือ',
    district: 'วัฒนา',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    username: '25472547',
    password: '25472547',
    role: 'user',
    createdAt: '2026-03-01T10:15:00.000Z',
  }
];

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (credentials: LoginCredentials) => { success: boolean; error?: string; user?: User };
  register: (data: RegisterFormData) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  isUsernameTaken: (username: string, excludeUserId?: string) => boolean;
  rememberedUsername: string;
  updateUserRole: (userId: string, newRole: UserRole) => { success: boolean; message?: string };
  deleteUser: (userId: string) => { success: boolean; message?: string };
  addUserByAdmin: (userData: Omit<User, 'id' | 'createdAt'>) => { success: boolean; message?: string; user?: User };
  updateUserByAdmin: (userId: string, userData: Partial<User>) => { success: boolean; message?: string };
  resetUserStore: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure admin2547 exists in parsed
          const hasAdmin = parsed.some((u: User) => u.username.toLowerCase() === 'admin2547');
          let updatedList = parsed.map((u: User) => ({
            ...u,
            role: u.role || (u.username.toLowerCase() === 'admin2547' ? 'admin' : 'user'),
          }));

          if (!hasAdmin) {
            updatedList = [INITIAL_USERS[0], ...updatedList];
          }
          return updatedList;
        }
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          return {
            ...parsed,
            role: parsed.role || (parsed.username?.toLowerCase() === 'admin2547' ? 'admin' : 'user'),
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [rememberedUsername, setRememberedUsername] = useState<string>(() => {
    try {
      return localStorage.getItem(REMEMBERED_USERNAME_KEY) || '';
    } catch {
      return '';
    }
  });

  // Save users to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [users]);

  // Save currentUser to localStorage whenever updated
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save currentUser to localStorage', e);
    }
  }, [currentUser]);

  const isUsernameTaken = (username: string, excludeUserId?: string): boolean => {
    const cleanUsername = username.trim().toLowerCase();
    return users.some((u) => u.username.toLowerCase() === cleanUsername && u.id !== excludeUserId);
  };

  const login = (credentials: LoginCredentials): { success: boolean; error?: string; user?: User } => {
    const { username, password, rememberMe } = credentials;
    const cleanUsername = username.trim();

    const user = users.find(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase() && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
      };
    }

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem(REMEMBERED_USERNAME_KEY, cleanUsername);
      setRememberedUsername(cleanUsername);
    } else {
      localStorage.removeItem(REMEMBERED_USERNAME_KEY);
      setRememberedUsername('');
    }

    const { password: _, ...safeUser } = user;
    const loggedUser = safeUser as User;
    setCurrentUser(loggedUser);
    return { success: true, user: loggedUser };
  };

  const register = (data: RegisterFormData): { success: boolean; error?: string; user?: User } => {
    const {
      name,
      lastname,
      email,
      address,
      postalCode,
      province,
      district,
      phone,
      username,
      password,
      confirmPassword,
      agreeTerms,
      role,
    } = data;

    if (!agreeTerms) {
      return { success: false, error: 'กรุณายอมรับเงื่อนไขการใช้งาน' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' };
    }

    if (isUsernameTaken(username)) {
      return { success: false, error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้อื่น' };
    }

    const assignedRole: UserRole = role || (username.trim().toLowerCase() === 'admin2547' ? 'admin' : 'user');

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      lastname: lastname.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      postalCode: postalCode ? postalCode.trim() : '',
      province: province ? province.trim() : 'กรุงเทพมหานคร',
      district: district ? district.trim() : '',
      phone: phone?.trim() || '',
      username: username.trim(),
      password: password,
      role: assignedRole,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    
    // Automatically log in the registered user
    const { password: _, ...safeUser } = newUser;
    const userToSet = safeUser as User;
    setCurrentUser(userToSet);

    return { success: true, user: userToSet };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserRole = (userId: string, newRole: UserRole): { success: boolean; message?: string } => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return { success: false, message: 'ไม่พบผู้ใช้งานนี้ในระบบ' };
    }

    if (user.username.toLowerCase() === 'admin2547' && newRole !== 'admin') {
      return { success: false, message: 'ไม่สามารถเปลี่ยน Role ของบัญชี Super Admin หลัก (admin2547) ได้' };
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    // If current logged-in user's role is modified
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }

    return { success: true, message: `เปลี่ยนสิทธิ์ผู้ใช้เป็น ${newRole.toUpperCase()} เรียบร้อยแล้ว` };
  };

  const deleteUser = (userId: string): { success: boolean; message?: string } => {
    const target = users.find((u) => u.id === userId);
    if (!target) {
      return { success: false, message: 'ไม่พบผู้ใช้ที่ต้องการลบ' };
    }

    if (target.username.toLowerCase() === 'admin2547') {
      return { success: false, message: 'ไม่อนุญาตให้ลบบัญชี Super Admin หลัก (admin2547)' };
    }

    if (currentUser && currentUser.id === userId) {
      return { success: false, message: 'คุณไม่สามารถลบบัญชีของตัวเองขณะกำลังเข้าสู่ระบบได้' };
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return { success: true, message: `ลบผู้ใช้ @${target.username} สำเร็จ` };
  };

  const addUserByAdmin = (userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message?: string; user?: User } => {
    if (isUsernameTaken(userData.username)) {
      return { success: false, message: `Username "${userData.username}" ถูกใช้งานแล้ว` };
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    return { success: true, message: `เพิ่มผู้ใช้งาน @${newUser.username} สำเร็จ`, user: newUser };
  };

  const updateUserByAdmin = (userId: string, userData: Partial<User>): { success: boolean; message?: string } => {
    if (userData.username && isUsernameTaken(userData.username, userId)) {
      return { success: false, message: `Username "${userData.username}" ถูกใช้งานแล้ว` };
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, ...userData };
        }
        return u;
      })
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...userData } : null));
    }

    return { success: true, message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ' };
  };

  const resetUserStore = () => {
    setUsers(INITIAL_USERS);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        isUsernameTaken,
        rememberedUsername,
        updateUserRole,
        deleteUser,
        addUserByAdmin,
        updateUserByAdmin,
        resetUserStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
