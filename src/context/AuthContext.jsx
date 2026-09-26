import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService.js';
import i18n from '../i18n/index.js';

const AuthContext = createContext(null);

export const DEMO_ACCOUNT = {
  email: 'demo@fandomverse.io',
  password: 'demo1234',
};

function ensureDemoUser(users) {
  if (users.some((u) => u.email === DEMO_ACCOUNT.email)) return users;
  return [
    ...users,
    {
      id: 'user-demo',
      name: 'Fan Demo',
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
      fandomInterest: 'anime',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => ensureDemoUser(storageService.loadUsers()));
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
    return { success: true };
  };

  const logout = () => {
    setCurrentUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        register,
        login,
        logout,
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
