/**
 * AuthContext — frontend authentication state management.
 *
 * Provides { user, loading, login, register, logout } to the entire app via
 * React Context.  The JWT is persisted in localStorage under TOKEN_KEY so
 * the session survives a page refresh.  On mount, the stored token is
 * validated against GET /api/users/me; if it is expired or invalid the token
 * is silently removed and the user is treated as logged-out.
 *
 * Usage:
 *   const { user, login, logout } = useAuth();
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, registerRequest, getMeRequest } from '../api/auth.js';

const AuthContext = createContext(null);

/** localStorage key used to persist the JWT across sessions. */
const TOKEN_KEY = 'airbnb_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount: rehydrate the session from a stored token if one exists.
    // Removes the token silently if the server rejects it (expired / revoked).
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getMeRequest()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  /** POST /api/users/login — stores token and returns the user object. */
  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  /** POST /api/users/register — creates account, stores token, returns user. */
  const register = async (payload) => {
    const res = await registerRequest(payload);
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  /** Remove the stored token and clear the user from state. */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
