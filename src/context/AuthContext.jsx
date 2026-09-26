import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService.js';
import i18n from '../i18n/index.js';

const AuthContext = createContext(null);

export const DEMO_ACCOUNT = {
  email: 'demo@fandomverse.io',
  password: 'demo1234',
  role: 'user',
  name: 'Fan Demo',
};

export const ADMIN_ACCOUNT = {
  email: 'admin@fandomverse.io',
  password: 'admin1234',
  role: 'admin',
  name: 'Chief Admin (FandomVerse)',
};

function ensureInitialUsers(users) {
  let updated = [...users];

  // Ensure demo regular user
  if (!updated.some((u) => u.email === DEMO_ACCOUNT.email)) {
    updated.push({
      id: 'user-demo',
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
      role: 'user',
      fandomInterest: 'anime',
      createdAt: '2026-01-15T08:00:00.000Z',
    });
  }

  // Ensure chief admin user
  if (!updated.some((u) => u.email === ADMIN_ACCOUNT.email)) {
    updated.push({
      id: 'user-admin',
      name: ADMIN_ACCOUNT.name,
      email: ADMIN_ACCOUNT.email,
      password: ADMIN_ACCOUNT.password,
      role: 'admin',
      fandomInterest: 'gaming',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  }

  // Ensure role field exists on any legacy accounts
  return updated.map(u => ({
    ...u,
    role: u.role || (u.email === ADMIN_ACCOUNT.email ? 'admin' : 'user')
  }));
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => ensureInitialUsers(storageService.loadUsers()));
  const [currentUserEmail, setCurrentUserEmail] = useState(() => storageService.loadCurrentUser());

  useEffect(() => {
    storageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    storageService.saveCurrentUser(currentUserEmail);
  }, [currentUserEmail]);

  const currentUser = useMemo(() => {
    const found = users.find((u) => u.email === currentUserEmail);
    if (!found) return null;
    const { password, ...publicUser } = found;
    return publicUser;
  }, [users, currentUserEmail]);

  const isAdmin = useMemo(() => {
    return currentUser?.role === 'admin' || currentUserEmail === ADMIN_ACCOUNT.email;
  }, [currentUser, currentUserEmail]);

  const register = ({ name, email, password, fandomInterest }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some((u) => u.email === normalizedEmail);
    if (exists) {
      return { success: false, message: i18n.t('auth.emailAlreadyRegistered') };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: normalizedEmail,
      password,
      role: 'user',
      fandomInterest,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserEmail(normalizedEmail);
    return { success: true };
  };

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const match = users.find((u) => u.email === normalizedEmail && u.password === password);
    if (!match) {
      return { success: false, message: i18n.t('auth.invalidCredentials') };
    }
    setCurrentUserEmail(normalizedEmail);
    return { success: true, user: match };
  };

  const logout = () => {
    setCurrentUserEmail(null);
  };

  // Switch account quickly (useful for Admin/User testing)
  const switchAccount = (email) => {
    const match = users.find((u) => u.email === email);
    if (match) {
      setCurrentUserEmail(email);
      return true;
    }
    return false;
  };

  // User management methods for Admin
  const updateUserRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const deleteUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target?.email === ADMIN_ACCOUNT.email) {
      return { success: false, message: 'Không thể xóa tài khoản Quản trị viên tối cao.' };
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser && currentUser.id === userId) {
      setCurrentUserEmail(null);
    }
    return { success: true };
  };

  const addUser = ({ name, email, password, role = 'user', fandomInterest = 'anime' }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalizedEmail)) {
      return { success: false, message: 'Email này đã tồn tại trong hệ thống.' };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: normalizedEmail,
      password,
      role,
      fandomInterest,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    return { success: true, user: newUser };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        users, // For admin user list
        register,
        login,
        logout,
        switchAccount,
        updateUserRole,
        deleteUser,
        addUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
