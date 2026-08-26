import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, getMeRequest } from '../api/auth';

const AuthContext = createContext(null);
const TOKEN_KEY = 'admin_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMeRequest()
      .then((res) => {
        if (res.data.user.role === 'admin') {
          setUser(res.data.user);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    const { token, user: u } = res.data;
    if (u.role !== 'admin') {
      throw new Error('Access denied. Admin credentials required.');
    }
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
